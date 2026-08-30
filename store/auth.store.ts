import { create } from "zustand";

export type AuthStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "needsOnboarding";

type AuthState = {
  status: AuthStatus;
  setStatus: (status: AuthStatus) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  status: "loading",
  setStatus: (status) => set({ status }),
}));

/** 훅 밖(인터셉터 등)에서 인증 상태를 바꿀 때 사용 */
export const authState = {
  get: () => useAuthStore.getState().status,
  setAuthenticated: () => useAuthStore.getState().setStatus("authenticated"),
  setUnauthenticated: () =>
    useAuthStore.getState().setStatus("unauthenticated"),
  /** 토큰은 유효하지만 회원가입(온보딩)이 끝나지 않은 상태 */
  setNeedsOnboarding: () =>
    useAuthStore.getState().setStatus("needsOnboarding"),
};
