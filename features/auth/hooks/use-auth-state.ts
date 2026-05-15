import { tokenStorage } from "@/lib/auth/tokenStorage";
import { useEffect, useState } from "react";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export function useAuthState(): { status: AuthStatus } {
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    // TODO : accessToken으로 서버통해 검증. 스플래시화면 생겨서 시간벌수있으면 추가.
    tokenStorage.getAccessToken().then((token) => {
      setStatus(token ? "authenticated" : "unauthenticated");
    });
  }, []);

  return { status };
}
