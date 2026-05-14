import { requireOptionalNativeModule } from 'expo-modules-core';
import { Platform } from 'react-native';

const LiveActivityNativeModule = Platform.OS === 'ios'
  ? requireOptionalNativeModule('LiveActivityModule')
  : null;

export type LiveActivityMode = 'course' | 'free';

export interface StartLiveActivityParams {
  mode: LiveActivityMode;
  remainingMinutes?: number;
  remainingMeters?: number;
  progress?: number;
}

export interface UpdateLiveActivityParams {
  elapsedSeconds: number;
  isRunning: boolean;
  mode: LiveActivityMode;
  remainingMinutes?: number;
  remainingMeters?: number;
  progress?: number;
}

export const LiveActivity = {
  start(params: StartLiveActivityParams): Promise<string | null> {
    if (!LiveActivityNativeModule) return Promise.resolve(null);
    return LiveActivityNativeModule.startActivity({
      mode: params.mode,
      remainingMinutes: params.remainingMinutes ?? 0,
      remainingMeters: params.remainingMeters ?? 0,
      progress: params.progress ?? 0,
    });
  },

  update(params: UpdateLiveActivityParams): Promise<void> {
    if (!LiveActivityNativeModule) return Promise.resolve();
    return LiveActivityNativeModule.updateActivity({
      elapsedSeconds: params.elapsedSeconds,
      isRunning: params.isRunning,
      mode: params.mode,
      remainingMinutes: params.remainingMinutes ?? 0,
      remainingMeters: params.remainingMeters ?? 0,
      progress: params.progress ?? 0,
    });
  },

  stop(): Promise<void> {
    if (!LiveActivityNativeModule) return Promise.resolve();
    return LiveActivityNativeModule.stopActivity();
  },
};
