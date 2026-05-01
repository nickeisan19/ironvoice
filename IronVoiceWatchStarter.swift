// =============================================================================
// IronVoiceWatchStarter.swift
//
// Starter scaffold for an Apple Watch companion to IronVoice Pro.
// This is NOT a complete app — it's a launch point for an Xcode watchOS project.
//
// SETUP:
//   1. Xcode → File → New → Project → watchOS → App
//   2. Replace ContentView.swift with this file
//   3. Add to Info.plist:
//        - NSSpeechRecognitionUsageDescription
//        - NSMicrophoneUsageDescription
//   4. Set IronVoiceConfig.endpoint and bearer token below (or load from
//      iCloud Keychain / WatchConnectivity from the iPhone app)
//   5. Capabilities: enable Background Modes (for sync) and HealthKit if
//      you ever wire up workout sessions.
//
// SCOPE OF THIS STARTER:
//   - Sync hits the same backup.php endpoint with Bearer auth
//   - Logs a set by voice dictation via the Speech framework
//   - Shows the most recent PR in a List
//
// NOT YET IMPLEMENTED (left as exercises):
//   - Local persistence (SwiftData / Core Data)
//   - Offline queue + retry
//   - Rest timer with haptics + Live Activity
//   - WatchConnectivity to share token from the iPhone PWA wrapper
//   - HealthKit workout sessions for heart rate / calories
// =============================================================================

import SwiftUI
import Speech
import AVFoundation

// MARK: - Configuration

enum IronVoiceConfig {
    /// Replace with your actual backup.php URL (e.g. https://nas.example.com/ironvoice/backup.php)
    static let endpoint = URL(string: "https://YOUR-NAS-HOST/ironvoice/backup.php")!
    /// Pass via WatchConnectivity from the phone in production. Hardcoded here for demo only.
    static let bearerToken = "REPLACE_WITH_YOUR_TOKEN"
    /// User email used as the per-user bucket key on the server.
    static let userEmail = "you@example.com"
}

// MARK: - Models (must match the JSON shape backup.php expects)

struct Workout: Codable, Identifiable {
    var id: Int64                  // ms-since-epoch (stable across devices)
    var exercise: String
    var weight: Double
    var reps: Int
    var oneRM: Double
    var date: String               // YYYY-MM-DD
    var modifiedAt: Int64
    var deleted: Bool?
}

struct PR: Codable, Identifiable {
    var id: String { exercise }
    var exercise: String
    var maxWeight: Double
    var max1RM: Double
    var achievedAt: Int64
}

struct RestoreResponse: Codable {
    var data: [Workout]
    var prs: [PR]
}

struct UserProfile: Codable {
    var first: String
    var email: String
}

struct BackupRequest: Codable {
    let action: String
    let user: UserProfile
    var data: [Workout]
    var prs: [PR]
    var templates: [String]   // simplified — extend to match the web schema
    var syncedAt: Int64
}

struct RestoreRequest: Codable {
    let action = "restore"
    let user: UserProfile
}

// MARK: - Sync layer

@MainActor
final class SyncClient: ObservableObject {

    @Published var prs: [PR] = []
    @Published var status: String = "Ready"

    private var session: URLSession {
        URLSession(configuration: .default)
    }

    func restore() async {
        status = "Restoring…"
        let body = RestoreRequest(user: UserProfile(first: "", email: IronVoiceConfig.userEmail))
        do {
            var req = URLRequest(url: IronVoiceConfig.endpoint)
            req.httpMethod = "POST"
            req.setValue("application/json", forHTTPHeaderField: "Content-Type")
            req.setValue("Bearer \(IronVoiceConfig.bearerToken)", forHTTPHeaderField: "Authorization")
            req.httpBody = try JSONEncoder().encode(body)

            let (data, response) = try await session.data(for: req)
            guard let http = response as? HTTPURLResponse, http.statusCode == 200 else {
                status = "HTTP error"
                return
            }
            let decoded = try JSONDecoder().decode(RestoreResponse.self, from: data)
            prs = decoded.prs.sorted { $0.max1RM > $1.max1RM }
            status = "Updated"
        } catch {
            status = "Failed: \(error.localizedDescription)"
        }
    }

    func logSet(exercise: String, weight: Double, reps: Int) async {
        // Build a single-entry append payload. In production you'd merge with
        // a local store and push the whole set, not just one entry, since the
        // server stores the union (last-write-wins on the file).
        let now = Int64(Date().timeIntervalSince1970 * 1000)
        let oneRM = weight * (1.0 + Double(reps) / 30.0)
        let dateStr: String = {
            let f = DateFormatter()
            f.dateFormat = "yyyy-MM-dd"
            return f.string(from: Date())
        }()
        let workout = Workout(
            id: now, exercise: exercise, weight: weight, reps: reps,
            oneRM: oneRM, date: dateStr, modifiedAt: now, deleted: nil
        )
        // NOTE: we POST a single-item array. backup.php overwrites the file,
        // so this would clobber prior history. A real implementation must
        // round-trip restore → merge → backup atomically, OR add an append
        // action server-side. This is left as an exercise.
        let payload = BackupRequest(
            action: "backup",
            user: UserProfile(first: "", email: IronVoiceConfig.userEmail),
            data: [workout], prs: [], templates: [],
            syncedAt: now
        )
        do {
            var req = URLRequest(url: IronVoiceConfig.endpoint)
            req.httpMethod = "POST"
            req.setValue("application/json", forHTTPHeaderField: "Content-Type")
            req.setValue("Bearer \(IronVoiceConfig.bearerToken)", forHTTPHeaderField: "Authorization")
            req.httpBody = try JSONEncoder().encode(payload)
            _ = try await session.data(for: req)
            status = "Logged \(weight) × \(reps)"
        } catch {
            status = "Sync failed"
        }
    }
}

// MARK: - Voice dictation

@MainActor
final class VoiceLogger: ObservableObject {

    @Published var transcript = ""
    @Published var isListening = false

    private let recognizer = SFSpeechRecognizer(locale: Locale(identifier: "en-US"))
    private let audioEngine = AVAudioEngine()
    private var task: SFSpeechRecognitionTask?
    private var request: SFSpeechAudioBufferRecognitionRequest?

    func requestAuth() async -> Bool {
        await withCheckedContinuation { c in
            SFSpeechRecognizer.requestAuthorization { status in
                c.resume(returning: status == .authorized)
            }
        }
    }

    func start() {
        guard !isListening else { return }
        do {
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.record, mode: .measurement, options: .duckOthers)
            try session.setActive(true, options: .notifyOthersOnDeactivation)

            let req = SFSpeechAudioBufferRecognitionRequest()
            req.shouldReportPartialResults = true
            request = req

            let input = audioEngine.inputNode
            input.installTap(onBus: 0, bufferSize: 1024, format: input.outputFormat(forBus: 0)) { buffer, _ in
                req.append(buffer)
            }
            audioEngine.prepare()
            try audioEngine.start()

            task = recognizer?.recognitionTask(with: req) { [weak self] result, error in
                Task { @MainActor in
                    if let r = result { self?.transcript = r.bestTranscription.formattedString }
                    if error != nil || result?.isFinal == true { self?.stop() }
                }
            }
            isListening = true
        } catch {
            print("Voice start failed: \(error)")
        }
    }

    func stop() {
        audioEngine.stop()
        audioEngine.inputNode.removeTap(onBus: 0)
        request?.endAudio()
        task?.cancel()
        request = nil
        task = nil
        isListening = false
    }

    /// Very simple parser. The web app does this much better — port it over.
    /// Returns (exercise, weight, reps) or nil if parse failed.
    func parse(_ text: String) -> (String, Double, Int)? {
        let lower = text.lowercased()
        let exercises = ["bench press", "back squat", "deadlift", "overhead press",
                         "bicep curl", "lat pulldown"]
        guard let exercise = exercises.first(where: { lower.contains($0) }) else { return nil }
        let nums = lower.components(separatedBy: CharacterSet.decimalDigits.inverted)
            .compactMap { Double($0) }
        guard nums.count >= 2 else { return nil }
        return (exercise, nums[0], Int(nums[1]))
    }
}

// MARK: - Views

struct ContentView: View {

    @StateObject private var sync = SyncClient()
    @StateObject private var voice = VoiceLogger()

    var body: some View {
        NavigationStack {
            List {
                Section {
                    Button(action: { Task { await sync.restore() } }) {
                        Label("Sync from NAS", systemImage: "arrow.triangle.2.circlepath")
                    }
                    NavigationLink(destination: VoiceLogView(voice: voice, sync: sync)) {
                        Label("Log a set", systemImage: "mic.fill")
                    }
                }

                Section("Recent PRs") {
                    if sync.prs.isEmpty {
                        Text("No PRs yet").foregroundStyle(.secondary)
                    } else {
                        ForEach(sync.prs.prefix(10)) { pr in
                            HStack {
                                Text(pr.exercise.capitalized)
                                Spacer()
                                Text("\(Int(pr.max1RM)) lb").bold()
                            }
                        }
                    }
                }

                Section { Text(sync.status).font(.footnote).foregroundStyle(.secondary) }
            }
            .navigationTitle("IronVoice")
        }
        .task { await sync.restore() }
    }
}

struct VoiceLogView: View {

    @ObservedObject var voice: VoiceLogger
    @ObservedObject var sync: SyncClient
    @State private var parsed: (String, Double, Int)?

    var body: some View {
        VStack(spacing: 12) {
            Text(voice.transcript.isEmpty ? "Tap to start" : voice.transcript)
                .multilineTextAlignment(.center)
                .padding()

            if let p = parsed {
                Text("\(p.0.capitalized) · \(Int(p.1)) × \(p.2)")
                    .font(.headline)
                Button("Save") {
                    Task { await sync.logSet(exercise: p.0, weight: p.1, reps: p.2) }
                }
                .buttonStyle(.borderedProminent)
            }

            Button(voice.isListening ? "Stop" : "Start") {
                if voice.isListening {
                    voice.stop()
                    parsed = voice.parse(voice.transcript)
                } else {
                    Task {
                        if await voice.requestAuth() { voice.start() }
                    }
                }
            }
            .buttonStyle(.bordered)
        }
        .navigationTitle("Voice Log")
    }
}

@main
struct IronVoiceWatchApp: App {
    var body: some Scene {
        WindowGroup { ContentView() }
    }
}
