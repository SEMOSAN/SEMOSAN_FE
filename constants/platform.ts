import Constants, { ExecutionEnvironment } from "expo-constants";

export const isDevMode = __DEV__;
export const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
export const isLiveActivityEnabled =
  process.env.EXPO_PUBLIC_LIVE_ACTIVITY_ENABLED === "true";
