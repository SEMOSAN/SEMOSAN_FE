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
 * GA4 커스텀 이벤트 전송.
 *
 * 분석 실패가 기능을 막으면 안 되므로 에러를 삼킨다.
 * 호출부에서 await 하지 않아도 되도록 Promise를 반환하지 않는다.
 */
export function logAnalyticsEvent(
  eventName: string,
  params?: AnalyticsParams,
): void {
  logEvent(getAnalytics(getApp()), eventName, sanitize(params)).catch(
    (error: unknown) => {
      console.warn("[Analytics] 이벤트 전송 실패:", eventName, error);
    },
  );
}

/** 화면 조회 이벤트 — GA4의 screen_view */
export function logAnalyticsScreenView(screenName: string): void {
  logScreenView(getAnalytics(getApp()), {
    screen_name: screenName,
    screen_class: screenName,
  }).catch((error: unknown) => {
    console.warn("[Analytics] 화면 조회 전송 실패:", screenName, error);
  });
}

/** 로그인 시 사용자 식별자 설정, 로그아웃 시 null */
export function setAnalyticsUserId(userId: string | null): void {
  setUserId(getAnalytics(getApp()), userId).catch((error: unknown) => {
    console.warn("[Analytics] 사용자 ID 설정 실패:", error);
  });
}
