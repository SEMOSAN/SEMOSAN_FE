import { QueryClient } from "@tanstack/react-query";

/**
 * 앱 전역 QueryClient.
 * 세션 종료(로그아웃/탈퇴/토큰 만료) 시 컴포넌트 밖에서도 캐시를 비워야 하므로
 * 루트 레이아웃이 아닌 모듈 스코프에 둔다.
 */
export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2, staleTime: 1000 * 60 * 5 } },
});
