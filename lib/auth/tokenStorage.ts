import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import * as Sentry from "@sentry/react-native";

/**
 * 토큰 저장소 실패는 곧 로그인 상태 유실로 이어진다.
 * 콘솔은 개발 중에만 의미가 있으므로, 운영에서는 Sentry 로 실제 보고한다.
 */
function reportFailure(operation: string, error: unknown): void {
  if (__DEV__) console.error(`tokenStorage.${operation} failed:`, error);
  Sentry.captureException(error, {
    tags: { scope: "tokenStorage", operation },
  });
}

/**
 * 인증 토큰은 SecureStore(iOS Keychain / Android Keystore)에 둔다.
 * AsyncStorage는 평문이라 기기 백업이나 탈옥·루팅 기기에서 그대로 읽힌다.
 * 로그인 여부 같은 비민감 플래그는 그대로 AsyncStorage를 쓴다.
 */
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

/**
 * AsyncStorage에 남아 있는 기존 토큰을 SecureStore로 옮긴다.
 * 이 처리가 없으면 업데이트한 사용자가 전부 로그아웃된다.
 * 옮긴 뒤 평문 사본은 반드시 지운다.
 */
async function migrateFromAsyncStorage(key: string): Promise<string | null> {
  try {
    const legacy = await AsyncStorage.getItem(key);
    if (legacy == null) return null;
    await SecureStore.setItemAsync(key, legacy);
    await AsyncStorage.removeItem(key);
    return legacy;
  } catch (error) {
    reportFailure(`migrate:${key}`, error);
    return null;
  }
}

async function readToken(key: string): Promise<string | null> {
  const stored = await SecureStore.getItemAsync(key);
  if (stored != null) return stored;
  return migrateFromAsyncStorage(key);
}
/** 사용자가 명시적으로 로그아웃/탈퇴했음을 기록. 개발용 샘플 토큰 재주입을 막는다. */
const SIGNED_OUT_KEY = "auth.signedOut";
/** 로그인은 됐지만 온보딩(회원가입 마지막 단계)이 아직 안 끝났음을 기록 */
const ONBOARDING_PENDING_KEY = "auth.onboardingPending";

const SAMPLE_ACCESS_TOKEN = process.env.EXPO_PUBLIC_SAMPLE_ACCESS_TOKEN;

export const tokenStorage = {
  async getAccessToken(): Promise<string | null> {
    try {
      return await readToken(ACCESS_TOKEN_KEY);
    } catch (error) {
      reportFailure("getAccessToken", error);
      return null;
    }
  },

  async setAccessToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
    } catch (error) {
      reportFailure("setAccessToken", error);
    }
  },

  async removeAccessToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      // 마이그레이션 전 남아 있을 수 있는 평문 사본도 함께 제거
      await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      reportFailure("removeAccessToken", error);
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await readToken(REFRESH_TOKEN_KEY);
    } catch (error) {
      reportFailure("getRefreshToken", error);
      return null;
    }
  },

  async setRefreshToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      reportFailure("setRefreshToken", error);
    }
  },

  async removeRefreshToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      reportFailure("removeRefreshToken", error);
    }
  },

  async clearTokens(): Promise<void> {
    await Promise.all([this.removeAccessToken(), this.removeRefreshToken()]);
    try {
      await AsyncStorage.setItem(SIGNED_OUT_KEY, "true");
      await AsyncStorage.removeItem(ONBOARDING_PENDING_KEY);
    } catch (error) {
      reportFailure("markSignedOut", error);
    }
  },

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      this.setAccessToken(accessToken),
      this.setRefreshToken(refreshToken),
    ]);
    try {
      await AsyncStorage.removeItem(SIGNED_OUT_KEY);
    } catch (error) {
      reportFailure("clearSignedOutFlag", error);
    }
  },

  /** 온보딩이 아직 안 끝난 상태로 표시(true) / 완료 처리(false). 저장 성공 여부를 반환한다. */
  async setOnboardingPending(pending: boolean): Promise<boolean> {
    try {
      if (pending) {
        await AsyncStorage.setItem(ONBOARDING_PENDING_KEY, "true");
      } else {
        await AsyncStorage.removeItem(ONBOARDING_PENDING_KEY);
      }
      return true;
    } catch (error) {
      reportFailure("setOnboardingPending", error);
      return false;
    }
  },

  /** 저장소 읽기 실패는 완료(false)와 구분해야 하므로 null 을 반환한다. */
  async isOnboardingPending(): Promise<boolean | null> {
    try {
      return (await AsyncStorage.getItem(ONBOARDING_PENDING_KEY)) === "true";
    } catch (error) {
      reportFailure("isOnboardingPending", error);
      return null;
    }
  },

  /**
   * 개발 편의용 샘플 토큰을 앱 시작 시 1회만 주입한다.
   * getAccessToken 의 fallback 으로 두면 clearTokens 이후에도 토큰이 되살아나
   * 탈퇴한 계정의 죽은 토큰으로 계속 요청을 보내게 되므로 절대 fallback 으로 쓰지 않는다.
   */
  async seedSampleAccessToken(): Promise<void> {
    if (!__DEV__ || !SAMPLE_ACCESS_TOKEN) return;
    try {
      const [token, signedOut] = await Promise.all([
        readToken(ACCESS_TOKEN_KEY),
        AsyncStorage.getItem(SIGNED_OUT_KEY),
      ]);
      if (token || signedOut) return;
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, SAMPLE_ACCESS_TOKEN);
    } catch (error) {
      reportFailure("seedSampleAccessToken", error);
    }
  },
};
