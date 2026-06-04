import ActivityKit
import SwiftUI
import WidgetKit

// MARK: - Design Tokens (Figma 기준)

private enum C {
    // 타이머 색상
    static let timerGreen    = Color(r: 0x00, g: 0xD8, b: 0x64)  // #00D864 secondary-normal
    static let timerGreenSm  = Color(r: 0x4A, g: 0xDE, b: 0x80)  // #4ADE80 (green-300) — Compact
    // 기타
    static let bg            = Color(r: 0x1A, g: 0x1B, b: 0x1F)  // #1A1B1F neutral-900
    static let labelMuted    = Color.white.opacity(0.5)            // 등산 시간 라벨
    static let statsRow      = Color.white.opacity(0.05)           // 통계 행 배경
    static let progressTrack = Color.white.opacity(0.3)            // 프로그레스바 배경
    static let summitBg      = Color(r: 0x00, g: 0x3A, b: 0x1C)  // #003A1C 정상 아이콘 배경
    static let summitBorder  = Color(r: 0xDB, g: 0xDB, b: 0xDB).opacity(0.3)
}

private extension Color {
    init(r: Int, g: Int, b: Int) {
        self.init(.sRGB, red: Double(r)/255, green: Double(g)/255, blue: Double(b)/255)
    }
}

// MARK: - Native Live Timer View (실행 중: SwiftUI 타이머, 정지 중: 정적 텍스트)

private struct LiveTimerText: View {
    let state: SemosanLiveActivityAttributes.ContentState
    var fontSize: CGFloat = 36
    var kerning: CGFloat = 0.72

    var body: some View {
        Group {
            if state.isRunning, let epoch = state.timerStartEpoch {
                Text(Date(timeIntervalSince1970: epoch / 1000), style: .timer)
                    .monospacedDigit()
            } else {
                Text(formatExpanded(state.elapsedSeconds))
            }
        }
        .font(.custom("Lexend-SemiBold", size: fontSize))
        .kerning(kerning)
        .foregroundColor(C.timerGreen)
        .minimumScaleFactor(0.6)
        .lineLimit(1)
    }
}

// MARK: - Timer Formatting

private func formatExpanded(_ seconds: Int) -> String {
    let h = seconds / 3600
    let m = (seconds % 3600) / 60
    let s = seconds % 60
    return String(format: "%02d:%02d:%02d", h, m, s)
}

private func formatCompact(_ seconds: Int) -> String {
    let m = (seconds % 3600) / 60
    let s = seconds % 60
    return String(format: "%02d:%02d", m, s)
}

// MARK: - 재생 중 아이콘 (Play triangle) — Figma SVG

private struct PlayTriangleShape: Shape {
    func path(in rect: CGRect) -> Path {
        let sx = rect.width / 52
        let sy = rect.height / 52
        var p = Path()
        p.move(to:        CGPoint(x: 20*sx,      y: 33.2338*sy))
        p.addLine(to:     CGPoint(x: 20*sx,      y: 18.7662*sy))
        p.addCurve(to:    CGPoint(x: 21.5145*sx, y: 17.9087*sy),
                   control1: CGPoint(x: 20*sx,   y: 17.9889*sy),
                   control2: CGPoint(x: 20.848*sx, y: 17.5088*sy))
        p.addLine(to:     CGPoint(x: 33.5708*sx, y: 25.1425*sy))
        p.addCurve(to:    CGPoint(x: 33.5708*sx, y: 26.8575*sy),
                   control1: CGPoint(x: 34.2182*sx, y: 25.5309*sy),
                   control2: CGPoint(x: 34.2182*sx, y: 26.4691*sy))
        p.addLine(to:     CGPoint(x: 21.5145*sx, y: 34.0913*sy))
        p.addCurve(to:    CGPoint(x: 20*sx,      y: 33.2338*sy),
                   control1: CGPoint(x: 20.848*sx, y: 34.4912*sy),
                   control2: CGPoint(x: 20*sx,   y: 34.0111*sy))
        p.closeSubpath()
        return p
    }
}

// MARK: - 일시정지 아이콘 (Pause bars) — Figma SVG

private struct PauseBarsShape: Shape {
    func path(in rect: CGRect) -> Path {
        let sx = rect.width / 52
        let sy = rect.height / 52
        var p = Path()
        // 왼쪽 바
        p.move(to:    CGPoint(x: 19*sx, y: 34*sy))
        p.addLine(to: CGPoint(x: 19*sx, y: 18*sy))
        p.addCurve(to: CGPoint(x: 20*sx, y: 17*sy),
                   control1: CGPoint(x: 19*sx,      y: 17.4477*sy),
                   control2: CGPoint(x: 19.4477*sx, y: 17*sy))
        p.addLine(to: CGPoint(x: 23*sx, y: 17*sy))
        p.addCurve(to: CGPoint(x: 24*sx, y: 18*sy),
                   control1: CGPoint(x: 23.5523*sx, y: 17*sy),
                   control2: CGPoint(x: 24*sx,      y: 17.4477*sy))
        p.addLine(to: CGPoint(x: 24*sx, y: 34*sy))
        p.addCurve(to: CGPoint(x: 23*sx, y: 35*sy),
                   control1: CGPoint(x: 24*sx,      y: 34.5523*sy),
                   control2: CGPoint(x: 23.5523*sx, y: 35*sy))
        p.addLine(to: CGPoint(x: 20*sx, y: 35*sy))
        p.addCurve(to: CGPoint(x: 19*sx, y: 34*sy),
                   control1: CGPoint(x: 19.4477*sx, y: 35*sy),
                   control2: CGPoint(x: 19*sx,      y: 34.5523*sy))
        p.closeSubpath()
        // 오른쪽 바
        p.move(to:    CGPoint(x: 28*sx, y: 34*sy))
        p.addLine(to: CGPoint(x: 28*sx, y: 18*sy))
        p.addCurve(to: CGPoint(x: 29*sx, y: 17*sy),
                   control1: CGPoint(x: 28*sx,      y: 17.4477*sy),
                   control2: CGPoint(x: 28.4477*sx, y: 17*sy))
        p.addLine(to: CGPoint(x: 32*sx, y: 17*sy))
        p.addCurve(to: CGPoint(x: 33*sx, y: 18*sy),
                   control1: CGPoint(x: 32.5523*sx, y: 17*sy),
                   control2: CGPoint(x: 33*sx,      y: 17.4477*sy))
        p.addLine(to: CGPoint(x: 33*sx, y: 34*sy))
        p.addCurve(to: CGPoint(x: 32*sx, y: 35*sy),
                   control1: CGPoint(x: 33*sx,      y: 34.5523*sy),
                   control2: CGPoint(x: 32.5523*sx, y: 35*sy))
        p.addLine(to: CGPoint(x: 29*sx, y: 35*sy))
        p.addCurve(to: CGPoint(x: 28*sx, y: 34*sy),
                   control1: CGPoint(x: 28.4477*sx, y: 35*sy),
                   control2: CGPoint(x: 28*sx,      y: 34.5523*sy))
        p.closeSubpath()
        return p
    }
}

// MARK: - Expanded Play/Pause Button (size 파라미터: DI=46, LockScreen=52)

private struct ExpandedPlayPauseBtn: View {
    let isRunning: Bool
    var size: CGFloat = 52

    var body: some View {
        let url = URL(string: isRunning ? "semosan://tracking?action=pause" : "semosan://tracking?action=resume")!
        Link(destination: url) {
            btnContent
        }
        .buttonStyle(.plain)
    }

    private var btnContent: some View {
        ZStack {
            Circle()
                .fill(Color.white.opacity(0.2))
                .frame(width: size, height: size)
            if isRunning {
                PauseBarsShape()
                    .fill(Color.white)
                    .frame(width: size, height: size)
            } else {
                PlayTriangleShape()
                    .fill(Color.white)
                    .frame(width: size, height: size)
            }
        }
    }
}

// MARK: - Compact Play/Pause Button (22×22)

private struct CompactPlayPauseBtn: View {
    let isRunning: Bool

    var body: some View {
        ZStack {
            Circle()
                .fill(Color.white.opacity(0.2))
                .frame(width: 22, height: 22)
            Image(systemName: isRunning ? "pause.fill" : "play.fill")
                .font(.system(size: 9, weight: .medium))
                .foregroundColor(.white)
        }
    }
}

// MARK: - Progress Bar (흰색 트랙 + 흰색 fill)

private struct LiveProgressBar: View {
    let progress: Double

    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                Capsule()
                    .fill(C.progressTrack)
                    .frame(width: geo.size.width, height: 6)
                Capsule()
                    .fill(Color.white)
                    .frame(width: geo.size.width * CGFloat(min(max(progress, 0), 1)), height: 6)
            }
        }
        .frame(height: 6)
    }
}

// MARK: - 세모산 로고 Shape (Figma SVG 경로)

private struct SemosanLogoShape: Shape {
    func path(in rect: CGRect) -> Path {
        let sx = rect.width / 18
        let sy = rect.height / 18
        var p = Path()
        p.move(to: CGPoint(x: 10.9333*sx, y: 8.5116*sy))
        p.addCurve(to: CGPoint(x: 11.4216*sx, y: 8.99989*sy),
                   control1: CGPoint(x: 10.9333*sx, y: 8.78128*sy),
                   control2: CGPoint(x: 11.1519*sx, y: 8.99989*sy))
        p.addLine(to: CGPoint(x: 13.3441*sx, y: 8.99989*sy))
        p.addCurve(to: CGPoint(x: 13.8324*sx, y: 9.48818*sy),
                   control1: CGPoint(x: 13.6137*sx, y: 8.99989*sy),
                   control2: CGPoint(x: 13.8324*sx, y: 9.21851*sy))
        p.addLine(to: CGPoint(x: 13.8324*sx, y: 12.4817*sy))
        p.addCurve(to: CGPoint(x: 13.3441*sx, y: 12.97*sy),
                   control1: CGPoint(x: 13.8324*sx, y: 12.7513*sy),
                   control2: CGPoint(x: 13.6137*sx, y: 12.97*sy))
        p.addLine(to: CGPoint(x: 11.9282*sx, y: 12.97*sy))
        p.addCurve(to: CGPoint(x: 9.97507*sx, y: 11.0168*sy),
                   control1: CGPoint(x: 10.8495*sx, y: 12.97*sy),
                   control2: CGPoint(x: 9.97507*sx, y: 12.0955*sy))
        p.addLine(to: CGPoint(x: 9.97507*sx, y: 10.1677*sy))
        p.addCurve(to: CGPoint(x: 9.69618*sx, y: 10.0536*sy),
                   control1: CGPoint(x: 9.97507*sx, y: 10.022*sy),
                   control2: CGPoint(x: 9.79829*sx, y: 9.94968*sy))
        p.addLine(to: CGPoint(x: 6.97543*sx, y: 12.8238*sy))
        p.addCurve(to: CGPoint(x: 6.62706*sx, y: 12.97*sy),
                   control1: CGPoint(x: 6.88362*sx, y: 12.9173*sy),
                   control2: CGPoint(x: 6.75809*sx, y: 12.97*sy))
        p.addLine(to: CGPoint(x: 4.65528*sx, y: 12.97*sy))
        p.addCurve(to: CGPoint(x: 4.16699*sx, y: 12.4817*sy),
                   control1: CGPoint(x: 4.38561*sx, y: 12.97*sy),
                   control2: CGPoint(x: 4.16699*sx, y: 12.7513*sy))
        p.addLine(to: CGPoint(x: 4.16699*sx, y: 8.5103*sy))
        p.addCurve(to: CGPoint(x: 4.3053*sx, y: 8.1698*sy),
                   control1: CGPoint(x: 4.16699*sx, y: 8.38312*sy),
                   control2: CGPoint(x: 4.21661*sx, y: 8.26096*sy))
        p.addLine(to: CGPoint(x: 7.2164*sx, y: 5.17758*sy))
        p.addCurve(to: CGPoint(x: 7.56639*sx, y: 5.02979*sy),
                   control1: CGPoint(x: 7.30833*sx, y: 5.08309*sy),
                   control2: CGPoint(x: 7.43456*sx, y: 5.02979*sy))
        p.addLine(to: CGPoint(x: 10.445*sx, y: 5.02979*sy))
        p.addCurve(to: CGPoint(x: 10.9333*sx, y: 5.51808*sy),
                   control1: CGPoint(x: 10.7147*sx, y: 5.02979*sy),
                   control2: CGPoint(x: 10.9333*sx, y: 5.2484*sy))
        p.addLine(to: CGPoint(x: 10.9333*sx, y: 8.5116*sy))
        p.closeSubpath()
        return p
    }
}

// MARK: - Summit Icon (18×18)

private struct SummitIconBadge: View {
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 4)
                .fill(C.summitBg)
                .overlay(
                    RoundedRectangle(cornerRadius: 4)
                        .strokeBorder(C.summitBorder, lineWidth: 0.5)
                )
                .frame(width: 18, height: 18)
            SemosanLogoShape()
                .fill(C.timerGreen)
                .frame(width: 18, height: 18)
        }
    }
}

private struct CourseStatsRow: View {
    let remainingMinutes: Int
    let remainingMeters: Int

    var body: some View {
        HStack(spacing: 12) {
            HStack(spacing: 8) {
                SummitIconBadge()

                Text("정상까지")
                    .foregroundColor(.white)
            }

            divider

            Text("\(remainingMinutes)분")
                .foregroundColor(.white)

            divider

            Text("\(remainingMeters)m")
                .foregroundColor(.white)

            Spacer()
        }
        .font(.system(size: 15, weight: .semibold))
    }

    private var divider: some View {
        Rectangle()
            .fill(Color.white.opacity(0.3))
            .frame(width: 1, height: 10)
    }
}

// MARK: - Lock Screen Frosted Background (공통)

private struct LockScreenFrostedBackground: View {
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 24)
                .fill(.ultraThinMaterial)
            RoundedRectangle(cornerRadius: 24)
                .fill(C.bg.opacity(0.3))
        }
    }
}

// MARK: - Lock Screen: 자유 기록하기 (Figma 1875:13509)

private struct FreeLockScreenView: View {
    let state: SemosanLiveActivityAttributes.ContentState

    var body: some View {
        HStack(alignment: .center) {
            VStack(alignment: .leading, spacing: 0) {
                Text("등산 시간")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundColor(C.labelMuted)

                LiveTimerText(state: state)
            }

            Spacer()

            ExpandedPlayPauseBtn(isRunning: state.isRunning)
        }
        .padding(20)
        .frame(maxWidth: .infinity)
    }
}

// MARK: - Lock Screen: 코스 따라가기 (Figma 1875:13521)

private struct CourseLockScreenView: View {
    let state: SemosanLiveActivityAttributes.ContentState

    var body: some View {
        VStack(spacing: 0) {
            VStack(alignment: .leading, spacing: 0) {
                HStack(alignment: .center) {
                    VStack(alignment: .leading, spacing: 0) {
                        Text("등산 시간")
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundColor(C.labelMuted)

                        LiveTimerText(state: state)
                    }

                    Spacer()

                    ExpandedPlayPauseBtn(isRunning: state.isRunning)
                }

                Spacer(minLength: 0)

                LiveProgressBar(progress: state.progress)
            }
            .padding(20)
            .frame(maxWidth: .infinity, maxHeight: .infinity)

            CourseStatsRow(
                remainingMinutes: state.remainingMinutes,
                remainingMeters: state.remainingMeters
            )
            .padding(.horizontal, 20)
            .padding(.bottom, 16)
            .frame(maxWidth: .infinity)
        }
        .frame(height: 160)
        .frame(maxWidth: .infinity)
    }
}

// MARK: - Lock Screen View

struct SemosanLockScreenView: View {
    let context: ActivityViewContext<SemosanLiveActivityAttributes>

    var body: some View {
        let state = context.state
        let isCourse = context.attributes.mode == .course

        if isCourse {
            CourseLockScreenView(state: state)
        } else {
            FreeLockScreenView(state: state)
        }
    }
}

// MARK: - Widget Configuration

// MARK: - Widget Configuration

struct SemosanLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: SemosanLiveActivityAttributes.self) { context in
            SemosanLockScreenView(context: context)
                .activityBackgroundTint(Color.black.opacity(0.4))
        } dynamicIsland: { context in
            let state = context.state
            let isCourse = context.attributes.mode == .course

            return DynamicIsland {
                // ── Expanded ──────────────────────────────────────
                DynamicIslandExpandedRegion(.leading) {}
                DynamicIslandExpandedRegion(.trailing) {}
                DynamicIslandExpandedRegion(.bottom) {
                    VStack(alignment: .leading, spacing: 6) {
                        HStack(alignment: .center) {
                            VStack(alignment: .leading, spacing: 2) {
                                Text("등산 시간")
                                    .font(.system(size: 12, weight: .semibold))
                                    .foregroundColor(C.labelMuted)
                                    .lineLimit(1)
                                LiveTimerText(state: state, fontSize: 34, kerning: 0.68)
                            }
                            Spacer()
                            ExpandedPlayPauseBtn(isRunning: state.isRunning, size: 46)
                        }
                        if isCourse {
                            LiveProgressBar(progress: state.progress)
                            CourseStatsRow(
                                remainingMinutes: state.remainingMinutes,
                                remainingMeters: state.remainingMeters
                            )
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 10)
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
                }
            } compactLeading: {
                CompactPlayPauseBtn(isRunning: state.isRunning)
                    .padding(.leading, 4)
            } compactTrailing: {
                Text(formatExpanded(state.elapsedSeconds))
                    .foregroundStyle(C.timerGreenSm)
                    .font(.system(size: 12, weight: .semibold))
                    .minimumScaleFactor(0.7)
                    .lineLimit(1)
                    .padding(.trailing, 4)
            } minimal: {
                Image(systemName: "figure.hiking")
                    .foregroundStyle(C.timerGreen)
                    .font(.system(size: 13, weight: .medium))
            }
        }
    }
}
