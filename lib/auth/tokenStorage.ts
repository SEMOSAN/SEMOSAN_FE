import AsyncStorage from "@react-native-async-storage/async-storage";
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

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
/** 사용자가 명시적으로 로그아웃/탈퇴했음을 기록. 개발용 샘플 토큰 재주입을 막는다. */
const SIGNED_OUT_KEY = "auth.signedOut";

const SAMPLE_ACCESS_TOKEN = process.env.EXPO_PUBLIC_SAMPLE_ACCESS_TOKEN;

export const tokenStorage = {
  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      reportFailure("getAccessToken", error);
      return null;
    }
  },

  async setAccessToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
    } catch (error) {
      reportFailure("setAccessToken", error);
    }
  },

  async removeAccessToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      reportFailure("removeAccessToken", error);
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      reportFailure("getRefreshToken", error);
      return null;
    }
  },

  async setRefreshToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      reportFailure("setRefreshToken", error);
    }
  },

  async removeRefreshToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      reportFailure("removeRefreshToken", error);
    }
  },

  async clearTokens(): Promise<void> {
    await Promise.all([this.removeAccessToken(), this.removeRefreshToken()]);
    try {
      await AsyncStorage.setItem(SIGNED_OUT_KEY, "true");
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

  /**
   * 개발 편의용 샘플 토큰을 앱 시작 시 1회만 주입한다.
   * getAccessToken 의 fallback 으로 두면 clearTokens 이후에도 토큰이 되살아나
   * 탈퇴한 계정의 죽은 토큰으로 계속 요청을 보내게 되므로 절대 fallback 으로 쓰지 않는다.
   */
  async seedSampleAccessToken(): Promise<void> {
    if (!__DEV__ || !SAMPLE_ACCESS_TOKEN) return;
    try {
      const [token, signedOut] = await Promise.all([
        AsyncStorage.getItem(ACCESS_TOKEN_KEY),
        AsyncStorage.getItem(SIGNED_OUT_KEY),
      ]);
      if (token || signedOut) return;
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, SAMPLE_ACCESS_TOKEN);
    } catch (error) {
      reportFailure("seedSampleAccessToken", error);
    }
  },
};
