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
      if (accessToken && refreshToken)
        await tokenStorage.setTokens(accessToken, refreshToken);
    },
  });
}
