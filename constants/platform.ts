import Constants, { ExecutionEnvironment } from "expo-constants";

export const isDevMode = __DEV__;
export const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
