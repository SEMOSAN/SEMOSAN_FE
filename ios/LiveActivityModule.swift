import ActivityKit
import ExpoModulesCore

public class LiveActivityModule: Module {
    public func definition() -> ModuleDefinition {
        Name("LiveActivityModule")

        OnCreate {
            if #available(iOS 16.2, *) {
                Task {
                    for activity in Activity<SemosanLiveActivityAttributes>.activities {
                        await activity.end(.none, dismissalPolicy: .immediate)
                    }
                }
            }
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

            let newState = SemosanLiveActivityAttributes.ContentState(
                elapsedSeconds: params["elapsedSeconds"] as? Int ?? 0,
                isRunning: params["isRunning"] as? Bool ?? true,
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
