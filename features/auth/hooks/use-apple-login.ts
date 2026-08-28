import { api } from "@/lib/api";
import { startSession } from "@/lib/auth/session";
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
    onSuccess: async ({ accessToken, refreshToken, onboardingCompleted }) => {
      if (accessToken && refreshToken) {
        await startSession(accessToken, refreshToken, !!onboardingCompleted);
      }
    },
  });
}
