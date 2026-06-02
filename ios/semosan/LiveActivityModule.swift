import ActivityKit
import ExpoModulesCore

// MARK: - Darwin notification bridge (file-level globals for C callback access)

private var _pauseHandler: (() -> Void)?
private var _resumeHandler: (() -> Void)?

private func _darwinPauseCallback(
    _ center: CFNotificationCenter?,
    _ observer: UnsafeMutableRawPointer?,
    _ name: CFNotificationName?,
    _ object: UnsafeRawPointer?,
    _ userInfo: CFDictionary?
) {
    DispatchQueue.main.async { _pauseHandler?() }
}

private func _darwinResumeCallback(
    _ center: CFNotificationCenter?,
    _ observer: UnsafeMutableRawPointer?,
    _ name: CFNotificationName?,
    _ object: UnsafeRawPointer?,
    _ userInfo: CFDictionary?
) {
    DispatchQueue.main.async { _resumeHandler?() }
}

// MARK: - Module

public class LiveActivityModule: Module {
    private var widgetIsRunningOverride: Bool? = nil
    private var widgetOverrideExpiry: Date = .distantPast

    public func definition() -> ModuleDefinition {
        Name("LiveActivityModule")

        Events("onLiveActivityControl")

        OnCreate {
            _pauseHandler = { [weak self] in
                self?.widgetIsRunningOverride = false
                self?.widgetOverrideExpiry = Date().addingTimeInterval(3.0)
                self?.sendEvent("onLiveActivityControl", ["action": "pause"])
            }
            _resumeHandler = { [weak self] in
                self?.widgetIsRunningOverride = true
                self?.widgetOverrideExpiry = Date().addingTimeInterval(3.0)
                self?.sendEvent("onLiveActivityControl", ["action": "resume"])
            }

            let darwinCenter = CFNotificationCenterGetDarwinNotifyCenter()
            let ptr = Unmanaged.passUnretained(self).toOpaque()

            CFNotificationCenterAddObserver(
                darwinCenter, ptr, _darwinPauseCallback,
                "com.tastyhiking.semosanapp.liveactivity.pause" as CFString,
                nil, .deliverImmediately
            )
            CFNotificationCenterAddObserver(
                darwinCenter, ptr, _darwinResumeCallback,
                "com.tastyhiking.semosanapp.liveactivity.resume" as CFString,
                nil, .deliverImmediately
            )
            /*
            if #available(iOS 16.2, *) {
                Task {
                    for activity in Activity<SemosanLiveActivityAttributes>.activities {
                        await activity.end(.none, dismissalPolicy: .immediate)
                    }
                }
            }
            */
        }

        AsyncFunction("startActivity") { (params: [String: Any]) async throws -> String in
            guard #available(iOS 16.2, *) else {
                throw Exception(name: "UNSUPPORTED", description: "Live Activities require iOS 16.2+")
            }
            guard ActivityAuthorizationInfo().areActivitiesEnabled else {
                throw Exception(name: "LIVE_ACTIVITY_DISABLED", description: "Live Activities are not enabled on this device")
            }

            for activity in Activity<SemosanLiveActivityAttributes>.activities {
                await activity.end(.none, dismissalPolicy: .immediate)
            }
            try? await Task.sleep(nanoseconds: 300_000_000)

            let modeStr = params["mode"] as? String ?? "free"
            let mode: SemosanLiveActivityAttributes.Mode = modeStr == "course" ? .course : .free

            let attributes = SemosanLiveActivityAttributes(mode: mode)
            let initialState = SemosanLiveActivityAttributes.ContentState(
                elapsedSeconds: 0,
                isRunning: true,
                timerStartEpoch: params["timerStartEpoch"] as? Double ?? Date().timeIntervalSince1970 * 1000,
                remainingMinutes: params["remainingMinutes"] as? Int ?? 0,
                remainingMeters: params["remainingMeters"] as? Int ?? 0,
                progress: params["progress"] as? Double ?? 0.0
            )

            let activity = try Activity<SemosanLiveActivityAttributes>.request(
                attributes: attributes,
                content: .init(state: initialState, staleDate: nil),
                pushType: nil
            )
            return activity.id
        }

        AsyncFunction("updateActivity") { (params: [String: Any]) async throws in
            guard #available(iOS 16.2, *) else { return }
            guard let activity = Activity<SemosanLiveActivityAttributes>.activities.first else {
                throw Exception(name: "LIVE_ACTIVITY_NOT_FOUND", description: "No active Live Activity found")
            }

            let jsIsRunning = params["isRunning"] as? Bool ?? true
            var actualIsRunning = jsIsRunning

            if let override = self.widgetIsRunningOverride, Date() < self.widgetOverrideExpiry {
                actualIsRunning = override
                if jsIsRunning == override {
                    self.widgetIsRunningOverride = nil
                }
            } else {
                self.widgetIsRunningOverride = nil
            }

            let newState = SemosanLiveActivityAttributes.ContentState(
                elapsedSeconds: params["elapsedSeconds"] as? Int ?? 0,
                isRunning: actualIsRunning,
                timerStartEpoch: params["timerStartEpoch"] as? Double,
                remainingMinutes: params["remainingMinutes"] as? Int ?? 0,
                remainingMeters: params["remainingMeters"] as? Int ?? 0,
                progress: params["progress"] as? Double ?? 0.0
            )
            await activity.update(.init(state: newState, staleDate: nil))
        }

        AsyncFunction("stopActivity") { () async throws in
            guard #available(iOS 16.2, *) else { return }
            guard let activity = Activity<SemosanLiveActivityAttributes>.activities.first else {
                return
            }
            await activity.end(.none, dismissalPolicy: .immediate)
        }
    }
}
