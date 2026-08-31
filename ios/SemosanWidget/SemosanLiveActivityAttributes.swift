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
        var timerStartEpoch: Double?  // 타이머 가상 시작 시각 (ms, epoch) — isRunning=true일 때만 유효
        // 코스 따라가기 전용 (free 모드에서는 무시)
        var remainingMinutes: Int
        var remainingMeters: Int
        var progress: Double      // 0.0 ~ 1.0
        var remainingPhotos: Int  // 남은 사진 촬영 가능 횟수 (최대 4장)

        init(
            elapsedSeconds: Int,
            isRunning: Bool,
            timerStartEpoch: Double?,
            remainingMinutes: Int,
            remainingMeters: Int,
            progress: Double,
            remainingPhotos: Int
        ) {
            self.elapsedSeconds = elapsedSeconds
            self.isRunning = isRunning
            self.timerStartEpoch = timerStartEpoch
            self.remainingMinutes = remainingMinutes
            self.remainingMeters = remainingMeters
            self.progress = progress
            self.remainingPhotos = remainingPhotos
        }

        enum CodingKeys: String, CodingKey {
            case elapsedSeconds, isRunning, timerStartEpoch
            case remainingMinutes, remainingMeters, progress, remainingPhotos
        }

        // 앱 업데이트 전에 시작된 Live Activity는 remainingPhotos 없이 저장돼 있을 수 있어
        // decodeIfPresent로 하위 호환 유지 (없으면 4장으로 간주)
        init(from decoder: Decoder) throws {
            let c = try decoder.container(keyedBy: CodingKeys.self)
            elapsedSeconds = try c.decode(Int.self, forKey: .elapsedSeconds)
            isRunning = try c.decode(Bool.self, forKey: .isRunning)
            timerStartEpoch = try c.decodeIfPresent(Double.self, forKey: .timerStartEpoch)
            remainingMinutes = try c.decode(Int.self, forKey: .remainingMinutes)
            remainingMeters = try c.decode(Int.self, forKey: .remainingMeters)
            progress = try c.decode(Double.self, forKey: .progress)
            remainingPhotos = try c.decodeIfPresent(Int.self, forKey: .remainingPhotos) ?? 4
        }
    }
}
