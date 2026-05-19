import { api } from "@/lib/api";
import { tokenStorage } from "@/lib/auth/tokenStorage";
import {
  AppleLoginBody,
  ENDPOINTS,
  OAuthLoginResponse,
} from "@/types/api.generated";
import { useMutation } from "@tanstack/react-query";

async function appleLogin(body: AppleLoginBody): Promise<OAuthLoginResponse> {
  const res = await api.post<OAuthLoginResponse>({
    path: ENDPOINTS.OAUTH_APPLE_LOGIN,
    body,
  });
  return res.data;
}

export function useAppleLogin() {
  return useMutation({
    mutationFn: appleLogin,
    onSuccess: async ({ accessToken, refreshToken }) => {
      if (accessToken && refreshToken) {
    console.log("✅ accessToken:", accessToken);  // 임시 추가
    await tokenStorage.setTokens(accessToken, refreshToken);
  }
    },
  });
}
