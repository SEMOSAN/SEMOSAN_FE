import ActivityKit
import Foundation

struct SemosanLiveActivityAttributes: ActivityAttributes {
    enum Mode: String, Codable {
        case course
        case free
    }

    // 정적 속성: 액티비티 시작 시 1회 설정
    var mode: Mode

    struct ContentState: Codable, Hashable {
        var elapsedSeconds: Int   // 경과 시간 (초)
        var isRunning: Bool       // 재생/일시정지
        // 코스 따라가기 전용 (free 모드에서는 무시)
        var remainingMinutes: Int
        var remainingMeters: Int
        var progress: Double      // 0.0 ~ 1.0
    }
}
