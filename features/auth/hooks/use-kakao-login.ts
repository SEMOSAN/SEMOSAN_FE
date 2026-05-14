import { api } from "@/lib/api";
import { tokenStorage } from "@/lib/auth/tokenStorage";
import {
  ENDPOINTS,
  KakaoLoginBody,
  OAuthLoginResponse,
} from "@/types/api.generated";
import { useMutation } from "@tanstack/react-query";

async function kakaoLogin(body: KakaoLoginBody): Promise<OAuthLoginResponse> {
  const res = await api.post<OAuthLoginResponse>({
    path: ENDPOINTS.OAUTH_KAKAO_LOGIN,
    body,
  });
  return res.data;
}

export function useKakaoLogin() {
  return useMutation({
    mutationFn: async (): Promise<OAuthLoginResponse> => {
      // TODO : 카카오 로그인 구현
      const token = { accessToken: "1" };
      return kakaoLogin({ code: token.accessToken, deviceType: "IOS" });
    },
    onSuccess: async ({ accessToken, refreshToken }) => {
      if (accessToken && refreshToken) {
        await tokenStorage.setTokens(accessToken, refreshToken);
      }
    },
  });
}
