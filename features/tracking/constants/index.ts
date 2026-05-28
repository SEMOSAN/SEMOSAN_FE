export type Difficulty = '초급' | '중급' | '고급';

export type Coord = {
  latitude: number;
  longitude: number;
};

export type Course = {
  id: string;
  name: string;
  difficulty: Difficulty;
  /** API altitudes에서 파싱한 최고 고도(m). 데이터 없으면 null */
  altitudeNm: number | null;
  distanceKm: number;
  /** 정상까지 거리(m) — 전체 거리의 절반 */
  summitDistanceM: number;
  /** 하산까지 거리(m) — 전체 거리의 절반 */
  descentDistanceM: number;
  durationHours: number;
  durationMinutes: number;
  /** 코스 경로 좌표 목록 */
  coordinates: Coord[];
  /** 지도 초기 중심 좌표 */
  centerLatitude: number;
  centerLongitude: number;
  /** 지도 초기 줌 레벨 */
  zoom: number;
};

// 관악산 과천향교 출발 코스 목업 좌표 (실제 API 연동 시 교체)
const GWANAK_COURSE_COORDS: Coord[] = [
  { latitude: 37.4272, longitude: 126.9876 }, // 과천향교 출발
  { latitude: 37.4289, longitude: 126.9891 },
  { latitude: 37.4310, longitude: 126.9912 },
  { latitude: 37.4335, longitude: 126.9934 },
  { latitude: 37.4358, longitude: 126.9951 },
  { latitude: 37.4380, longitude: 126.9963 },
  { latitude: 37.4401, longitude: 126.9978 },
  { latitude: 37.4423, longitude: 126.9990 },
  { latitude: 37.4445, longitude: 127.0001 },
  { latitude: 37.4462, longitude: 127.0015 },
  { latitude: 37.4479, longitude: 127.0028 },
  { latitude: 37.4489, longitude: 127.0042 }, // 관악산 정상 부근
];

export const MOCK_COURSES: Course[] = [
  {
    id: '1',
    name: '과천향교 출발 코스',
    difficulty: '초급',
    altitudeNm: null,
    distanceKm: 13.95,
    summitDistanceM: 6975,
    descentDistanceM: 6975,
    durationHours: 7,
    durationMinutes: 55,
    coordinates: GWANAK_COURSE_COORDS,
    centerLatitude: 37.4380,
    centerLongitude: 126.9963,
    zoom: 14,
  },
  {
    id: '2',
    name: '과천향교 출발 코스',
    difficulty: '초급',
    altitudeNm: null,
    distanceKm: 13.95,
    summitDistanceM: 6975,
    descentDistanceM: 6975,
    durationHours: 7,
    durationMinutes: 55,
    coordinates: GWANAK_COURSE_COORDS,
    centerLatitude: 37.4380,
    centerLongitude: 126.9963,
    zoom: 14,
  },
  {
    id: '3',
    name: '과천향교 출발 코스',
    difficulty: '초급',
    altitudeNm: null,
    distanceKm: 13.95,
    summitDistanceM: 6975,
    descentDistanceM: 6975,
    durationHours: 7,
    durationMinutes: 55,
    coordinates: GWANAK_COURSE_COORDS,
    centerLatitude: 37.4380,
    centerLongitude: 126.9963,
    zoom: 14,
  },
];

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

export const SHADOW = {
  boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.15)',
} as const;

export const CARD_SHADOW = {
  boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.1)',
} as const;

// ─── 타이포그래피 ─────────────────────────────────────────
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

export const TRAIL_BAR_COLORS = ['#507EF4', '#4ADE80', '#FFD40D', '#FF5249'] as const;
export const TRAIL_BAR_LOCATIONS = [0, 0.33, 0.66, 1] as const;
/** 바 너비 */
export const TRAIL_BAR_WIDTH = 10;
/** 화면 왼쪽 가장자리로부터의 간격 */
export const TRAIL_BAR_LEFT = 20;
/** 아바타 마커 왼쪽 시작  **/
export const TRAIL_MARKER_LEFT = 20 + 10;
/** 바 높이 */
export const TRAIL_BAR_HEIGHT = 450;
/** 코스 카드 상단 기준 top  */
export const TRACKING_COURSE_CARD_TOP = 56;
/** 코스 카드 높이 */
export const TRACKING_COURSE_CARD_HEIGHT = 44;
/** 그라데이션 바와 코스 카드/바텀시트 사이 간격 */
export const TRAIL_BAR_GAP = 18;

/** 위치 버튼과 트래킹 바텀시트 사이 간격 */
export const LOCATION_BUTTON_GAP = 18;

export const TRACKING_SHEET_HEIGHT = 220;


export const COLLAPSED_PEEK_HEIGHT = 24;
export const FLOATING_CARD_GAP = 16;
export const FLOATING_CARD_HORIZONTAL_MARGIN = 16;

export function formatElapsedTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
