import { api } from "@/lib/api";
import { tokenStorage } from "@/lib/auth/tokenStorage";
import { ENDPOINTS, OAuthLoginResponse } from "@/types/api.generated";
import { login } from "@react-native-kakao/user";
import { useMutation } from "@tanstack/react-query";
import { Platform } from "react-native";

export function useKakaoLogin() {
  return useMutation({
    mutationFn: async () => {
      const { accessToken } = await login();

      const deviceType =
        Platform.OS === "ios"
          ? "IOS"
          : Platform.OS === "android"
            ? "ANDROID"
            : null;

      const { data } = await api.post<OAuthLoginResponse>({
        path: ENDPOINTS.OAUTH_KAKAO_LOGIN,
        body: { accessToken, deviceType },
      });

      return data;
    },
    onSuccess: async ({ accessToken, refreshToken }) => {
      if (accessToken && refreshToken) {
        await tokenStorage.setTokens(accessToken, refreshToken);
      }
    },
  });
}
