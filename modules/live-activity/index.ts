import { EventEmitter, requireOptionalNativeModule } from 'expo-modules-core';
import { Platform } from 'react-native';

const LiveActivityNativeModule = Platform.OS === 'ios'
  ? requireOptionalNativeModule('LiveActivityModule')
  : null;

const emitter = LiveActivityNativeModule
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ? new EventEmitter<Record<string, any>>(LiveActivityNativeModule)
  : null;

export type LiveActivityMode = 'course' | 'free';

export interface StartLiveActivityParams {
  mode: LiveActivityMode;
  remainingMinutes?: number;
  remainingMeters?: number;
  progress?: number;
  remainingPhotos?: number;
  timerStartEpoch?: number;
}

export interface UpdateLiveActivityParams {
  elapsedSeconds: number;
  isRunning: boolean;
  mode: LiveActivityMode;
  remainingMinutes?: number;
  remainingMeters?: number;
  progress?: number;
  remainingPhotos?: number;
  timerStartEpoch?: number;
}

export const LiveActivity = {
  start(params: StartLiveActivityParams): Promise<string | null> {
    if (!LiveActivityNativeModule) return Promise.resolve(null);
    return LiveActivityNativeModule.startActivity({
      mode: params.mode,
      remainingMinutes: params.remainingMinutes ?? 0,
      remainingMeters: params.remainingMeters ?? 0,
      progress: params.progress ?? 0,
      remainingPhotos: params.remainingPhotos ?? 4,
      timerStartEpoch: params.timerStartEpoch,
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
      remainingPhotos: params.remainingPhotos ?? 4,
      timerStartEpoch: params.timerStartEpoch,
    });
  },

  stop(): Promise<void> {
    if (!LiveActivityNativeModule) return Promise.resolve();
    return LiveActivityNativeModule.stopActivity();
  },
};

export type LiveActivityControlAction = 'pause' | 'resume';

export function addLiveActivityControlListener(
  callback: (action: LiveActivityControlAction) => void,
): { remove: () => void } {
  if (!emitter) return { remove: () => {} };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sub = emitter.addListener('onLiveActivityControl', (event: any) =>
    callback(event.action as LiveActivityControlAction),
  );
  return sub;
}
