import { api } from "@/lib/api";
import { getApp } from "@react-native-firebase/app";
import {
  getAPNSToken,
  getMessaging,
  getToken,
  setAPNSToken,
} from "@react-native-firebase/messaging";
import * as Sentry from "@sentry/react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

type RegisterFcmTokenOptions = {
  /** false 면 권한 팝업을 띄우지 않고, 이미 허용한 기기만 조용히 등록한다 */
  requestPermission?: boolean;
};

/** 이번 세션의 등록. 로그인 직후 호출과 훅 호출이 겹쳐도 POST 는 한 번만 나간다 */
let registration: Promise<boolean> | null = null;

/** 세션 종료 시 호출. 재로그인하면 서버가 토큰을 정리하므로 다시 등록해야 한다 */
export function resetFcmTokenRegistration(): void {
  registration = null;
}

/** FCM 토큰을 서버에 등록한다. 같은 세션에서 이미 성공했다면 건너뛴다 */
export function registerFcmToken(
  options: RegisterFcmTokenOptions = {},
): Promise<boolean> {
  if (registration) return registration;

  const attempt: Promise<boolean> = register(options).then((registered) => {
    // 실패는 다음 호출에서 재시도. 그 사이 저장된 새 시도는 건드리지 않는다
    if (!registered && registration === attempt) registration = null;
    return registered;
  });
  registration = attempt;
  return attempt;
}

async function register({
  requestPermission = true,
}: RegisterFcmTokenOptions): Promise<boolean> {
  try {
    // 권한 요청은 시뮬레이터에서도 수행한다.
    // simctl push로 알림 표시·탭 라우팅을 검증하려면 권한이 필요하다.
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted" && requestPermission) {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("[Push] 알림 권한 없음 — 토큰 등록 건너뜀");
      return false;
    }

    // FCM 토큰은 실기기에서만 발급된다
    if (!Device.isDevice) {
      console.log("[Push] 실기기에서만 토큰 등록 가능");
      return false;
    }

    // iOS: Firebase SDK로 FCM 등록 토큰 획득 (APNs 토큰 아님)
    // Android: FCM 토큰 직접 반환
    const app = getApp();
    const fcmMessaging = getMessaging(app);

    // APNs 토큰이 붙지 않으면 FCM 토큰이 발급돼도 iOS로 전달되지 않는다.
    // 원인 추적이 어려웠던 지점이라 값을 남긴다.
    if (Platform.OS === "ios") {
      const apnsToken = await getAPNSToken(fcmMessaging);
      console.log(
        "[Push] APNs 토큰:",
        apnsToken ? `있음 (${apnsToken.length}자)` : "null — APNs 등록 실패",
      );

      // 개발 빌드는 APNs 샌드박스를 쓰는데, Firebase SDK의 프로비저닝 프로파일
      // 기반 자동 판별이 실패하면 FCM이 프로덕션 서버로 보내고 APNs가 조용히
      // 거절한다(앱에 아무 흔적도 남지 않음). 개발 빌드에서만 환경을 명시한다.
      if (__DEV__ && apnsToken) {
        await setAPNSToken(fcmMessaging, apnsToken, "sandbox");
        console.log("[Push] APNs 토큰 타입을 sandbox로 명시");
      }
    }

    const token = await getToken(fcmMessaging);

    await api.post({
      path: "/api/fcm/tokens",
      body: {
        token,
        deviceType: Platform.OS === "ios" ? "IOS" : "ANDROID",
      },
    });

    console.log("[Push] FCM 토큰 등록 완료:", token);
    return true;
  } catch (error) {
    console.error("[Push] FCM 토큰 등록 실패:", error);
    Sentry.captureException(new Error("FcmTokenRegistrationFailed"));
    return false;
  }
}
