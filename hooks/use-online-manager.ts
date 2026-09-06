import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";
import * as React from "react";
import { Platform } from "react-native";

export function useOnlineManager() {
  React.useEffect(() => {
    // React Query already supports on reconnect auto refetch in web browser
    if (Platform.OS !== "web") {
      return NetInfo.addEventListener((state) => {
        // isInternetReachable은 reachability 확인 전 null을 반환하는 경우가 잦아
        // 이를 함께 걸면 실제로는 연결돼 있는데도 오프라인으로 오판해 쿼리가
        // paused 상태로 멈춘 채 풀리지 않는 문제가 있었다. isConnected만 사용.
        onlineManager.setOnline(state.isConnected ?? false);
      });
    }
  }, []);
}
