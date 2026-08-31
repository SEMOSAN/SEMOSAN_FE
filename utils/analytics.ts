import { getApp } from "@react-native-firebase/app";
import {
  getAnalytics,
  logEvent,
  logScreenView,
  setUserId,
} from "@react-native-firebase/analytics";

/**
 * GA4 이벤트 파라미터로 보낼 수 있는 값.
 * undefined/null은 전송 전에 제거된다.
 */
type AnalyticsParams = Record<
  string,
  string | number | boolean | null | undefined
>;

/** GA4 파라미터 문자열 값 길이 제한 */
const PARAM_VALUE_MAX_LENGTH = 100;

/**
 * undefined/null을 제거하고 문자열 길이를 GA4 제한에 맞춘다.
 * (제한을 넘으면 이벤트 전체가 조용히 누락될 수 있다)
 */
function sanitize(params?: AnalyticsParams) {
  if (!params) return undefined;
  const result: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value == null) continue;
    result[key] =
      typeof value === "string"
        ? value.slice(0, PARAM_VALUE_MAX_LENGTH)
        : value;
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

/**
 * 분석 실패가 기능을 막지 않도록 동기 예외와 Promise rejection을 모두 삼킨다.
 * getAnalytics(getApp())은 기본 Firebase 앱이 초기화되기 전이면 동기적으로
 * throw하므로, .catch()만으로는 호출부로의 전파를 막을 수 없다.
 */
function runSafely(label: string, task: () => Promise<unknown>): void {
  try {
    task().catch((error: unknown) => {
      console.warn(`[Analytics] ${label} 실패:`, error);
    });
  } catch (error) {
    console.warn(`[Analytics] ${label} 실패:`, error);
  }
}

/**
 * GA4 커스텀 이벤트 전송.
 * 호출부에서 await 하지 않아도 되도록 Promise를 반환하지 않는다.
 */
export function logAnalyticsEvent(
  eventName: string,
  params?: AnalyticsParams,
): void {
  runSafely(`이벤트 전송(${eventName})`, () =>
    logEvent(getAnalytics(getApp()), eventName, sanitize(params)),
  );
}

/** 화면 조회 이벤트 — GA4의 screen_view */
export function logAnalyticsScreenView(screenName: string): void {
  runSafely(`화면 조회 전송(${screenName})`, () =>
    logScreenView(getAnalytics(getApp()), {
      screen_name: screenName,
      screen_class: screenName,
    }),
  );
}

/** 로그인 시 사용자 식별자 설정, 로그아웃 시 null */
export function setAnalyticsUserId(userId: string | null): void {
  runSafely("사용자 ID 설정", () => setUserId(getAnalytics(getApp()), userId));
}
