import ActivityKit
import ExpoModulesCore

public class LiveActivityModule: Module {
    private var currentActivityId: String?

    public func definition() -> ModuleDefinition {
        Name("LiveActivityModule")

        AsyncFunction("startActivity") { [weak self] (params: [String: Any]) async throws -> String in
            guard #available(iOS 16.2, *) else {
                throw Exception(name: "UNSUPPORTED", description: "Live Activities require iOS 16.2+")
            }
            guard ActivityAuthorizationInfo().areActivitiesEnabled else {
                throw Exception(name: "LIVE_ACTIVITY_DISABLED", description: "Live Activities are not enabled on this device")
            }

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
            self?.currentActivityId = activity.id
            return activity.id
        }

        AsyncFunction("updateActivity") { [weak self] (params: [String: Any]) async throws in
            guard #available(iOS 16.2, *) else { return }
            guard let id = self?.currentActivityId,
                  let activity = Activity<SemosanLiveActivityAttributes>.activities.first(where: { $0.id == id }) else {
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

        AsyncFunction("stopActivity") { [weak self] () async throws in
            guard #available(iOS 16.2, *) else { return }
            guard let id = self?.currentActivityId,
                  let activity = Activity<SemosanLiveActivityAttributes>.activities.first(where: { $0.id == id }) else {
                return
            }
            self?.currentActivityId = nil
            await activity.end(.none, dismissalPolicy: .immediate)
        }
    }
}
