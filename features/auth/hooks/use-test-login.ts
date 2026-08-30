import { api } from "@/lib/api";
import { startSession } from "@/lib/auth/session";
import { ENDPOINTS, LoginResponse } from "@/types/api.generated";
import { useMutation } from "@tanstack/react-query";

export function useTestLogin() {
  return useMutation({
    mutationFn: async ({
      testUserId,
    }: {
      testUserId: number;
    }): Promise<LoginResponse> => {
      const res = await api.post<LoginResponse>({
        path: ENDPOINTS.AUTH_TEST_LOGIN,
        body: {
          testUserId,
          deviceType: "IOS",
          secretKey: process.env.EXPO_PUBLIC_LOGIN_SECRET_KEY,
        },
      });
      return res.data;
    },
    onSuccess: async ({ accessToken, refreshToken, onboardingCompleted }) => {
      if (accessToken && refreshToken) {
        await startSession(accessToken, refreshToken, !!onboardingCompleted);
      }
    },
  });
}
