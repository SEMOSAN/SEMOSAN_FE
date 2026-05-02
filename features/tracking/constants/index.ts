// ─── 타입 ────────────────────────────────────────────────
export type Difficulty = '초급' | '중급' | '고급';

export type Course = {
  id: string;
  name: string;
  difficulty: Difficulty;
  altitudeNm: number;
  distanceKm: number;
  ascentM: number;
  descentM: number;
  durationHours: number;
  durationMinutes: number;
};

// ─── 목 데이터 ───────────────────────────────────────────
export const MOCK_COURSES: Course[] = [
  { id: '1', name: '코스 이름', difficulty: '초급', altitudeNm: 2.43, distanceKm: 13.95, ascentM: 1436, descentM: 1354, durationHours: 7, durationMinutes: 55 },
  { id: '2', name: '코스 이름', difficulty: '초급', altitudeNm: 2.43, distanceKm: 13.95, ascentM: 1436, descentM: 1354, durationHours: 7, durationMinutes: 55 },
  { id: '3', name: '코스 이름', difficulty: '초급', altitudeNm: 2.43, distanceKm: 13.95, ascentM: 1436, descentM: 1354, durationHours: 7, durationMinutes: 55 },
];

// ─── 난이도 스타일 맵 ────────────────────────────────────
export const DIFFICULTY_BG: Record<Difficulty, string> = {
  '초급': 'bg-green-50',
  '중급': 'bg-yellow-50',
  '고급': 'bg-red-50',
};

export const DIFFICULTY_TEXT_COLOR: Record<Difficulty, string> = {
  '초급': 'text-secondary-strong',
  '중급': 'text-yellow-600',
  '고급': 'text-red-500',
};

// ─── 그림자 ──────────────────────────────────────────────
export const SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.15,
  shadowRadius: 4,
  elevation: 4,
} as const;

/** drop shadow-01: 0 2px 4px 0 rgba(0,0,0,0.10) */
export const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.10,
  shadowRadius: 4,
  elevation: 3,
} as const;

// ─── 타이포그래피 ─────────────────────────────────────────
/** 카운트다운 숫자 타이포그래피 (Figma: Lexend 80px SemiBold) */
export const COUNTDOWN_NUMBER_STYLE = {
  fontFamily: 'Lexend-SemiBold',
  fontSize: 80,
  letterSpacing: -1.264,
} as const;

/** 트래킹 타이머 타이포그래피 */
export const TRACKING_TIMER_STYLE = {
  fontFamily: 'Lexend-SemiBold',
  fontSize: 48,
  letterSpacing: -0.75,
} as const;

// ─── 트레일 고도 바 ───────────────────────────────────────
/**
 * 지도 위 세로 고도 그라데이션 바 (Figma 미토큰 색상)
 * linear-gradient(0deg): 아래 → 위 = 파랑 → 초록 → 노랑 → 빨강
 */
export const TRAIL_BAR_COLORS = ['#507EF4', '#4ADE80', '#FFD40D', '#FF5249'] as const;
export const TRAIL_BAR_LOCATIONS = [0, 0.33, 0.66, 1] as const;
/** 바 너비 (Figma: 10px) */
export const TRAIL_BAR_WIDTH = 10;
/** 화면 왼쪽 가장자리로부터의 간격 */
export const TRAIL_BAR_LEFT = 12;
/** 바 높이 */
export const TRAIL_BAR_HEIGHT = 450;
/** 코스 카드 상단 기준 top (status bar 아래) */
export const TRACKING_COURSE_CARD_TOP = 56;
/** 코스 카드 높이 (p-3 상하패딩 24 + 콘텐츠 행 ~20) */
export const TRACKING_COURSE_CARD_HEIGHT = 44;
/** 그라데이션 바와 코스 카드/바텀시트 사이 간격 */
export const TRAIL_BAR_GAP = 18;

/** 위치 버튼과 트래킹 바텀시트 사이 간격 */
export const LOCATION_BUTTON_GAP = 18;

// ─── 트래킹 바텀시트 ──────────────────────────────────────
/**
 * TrackingSheet 높이 (툴팁 표시 기준 추정치)
 * 핸들(20) + 타이머 영역(100) + 버튼 영역(툴팁 포함 ~100) = 220
 */
export const TRACKING_SHEET_HEIGHT = 220;

// ─── 레이아웃 상수 ────────────────────────────────────────
/** 바텀시트가 collapsed 상태일 때 네비게이션 바 위로 노출되는 높이 */
export const COLLAPSED_PEEK_HEIGHT = 24;
/** collapsed 바텀시트 peek 과 플로팅 카드 사이 간격 */
export const FLOATING_CARD_GAP = 16;
/** 플로팅 카드 좌우 마진 */
export const FLOATING_CARD_HORIZONTAL_MARGIN = 16;

export function formatElapsedTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}
