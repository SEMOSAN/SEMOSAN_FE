import { api } from "@/lib/api";
import { tokenStorage } from "@/lib/auth/tokenStorage";
import { useMutation } from "@tanstack/react-query";

type TestLoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export async function testLogin(): Promise<TestLoginResponse> {
  const res = await api.post<TestLoginResponse>({
    path: "/api/auth/test/login",
    body: {
      testUserId: 1,
      deviceType: "IOS",
      secretKey: "semosan-test-secret-2026",
    },
  });
  return res.data;
}

export function useTestLogin() {
  return useMutation({
    mutationFn: testLogin,
    onSuccess: async ({ accessToken, refreshToken }) => {
      await tokenStorage.setTokens(accessToken, refreshToken);
    },
  });
}
