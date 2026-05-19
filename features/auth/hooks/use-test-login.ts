import { api } from "@/lib/api";
import { tokenStorage } from "@/lib/auth/tokenStorage";
import { ENDPOINTS } from "@/types/api.generated";
import { useMutation } from "@tanstack/react-query";

type TestLoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export function useTestLogin() {
  return useMutation({
    mutationFn: async ({ testUserId }: { testUserId: number }): Promise<TestLoginResponse> => {
      const res = await api.post<TestLoginResponse>({
        path: ENDPOINTS.AUTH_TEST_LOGIN,
        body: {
          testUserId,
          deviceType: "IOS",
          secretKey: process.env.EXPO_PUBLIC_LOGIN_SECRET_KEY,
        },
      });
      return res.data;
    },
    onSuccess: async ({ accessToken, refreshToken }) => {
      await tokenStorage.setTokens(accessToken, refreshToken);
    },
  });
}
