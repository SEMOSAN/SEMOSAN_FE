import { tokenStorage } from "@/lib/auth/tokenStorage";
import { OAuthLoginResponse } from "@/types/api.generated";
import { login } from "@react-native-kakao/user";
import { useMutation } from "@tanstack/react-query";

export function useKakaoLogin() {
  return useMutation({
    mutationFn: async (): Promise<OAuthLoginResponse> => {
      // login() 내부적으로 POST /api/oauth/kakao/login 를 호출함.
      const token = await login();

      return token;
    },
    onSuccess: async ({ accessToken, refreshToken }) => {
      if (accessToken && refreshToken) {
        await tokenStorage.setTokens(accessToken, refreshToken);
      }
    },
  });
}
