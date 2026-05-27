import { api } from "@/lib/api";
import { tokenStorage } from "@/lib/auth/tokenStorage";
import { ENDPOINTS, GetUserProfileResponse } from "@/types/api.generated";
import { useEffect, useState } from "react";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export function useAuthState(): { status: AuthStatus } {
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    async function checkAuth(): Promise<void> {
      const token = await tokenStorage.getAccessToken();
      if (!token) {
        setStatus("unauthenticated");
        return;
      }
      try {
        await api.get<GetUserProfileResponse>(
          { path: ENDPOINTS.USERS_PROFILE },
          { ignoreErrorToast: true },
        );
        setStatus("authenticated");
      } catch {
        setStatus("unauthenticated");
      }
    }
    checkAuth();
  }, []);

  return { status };
}
