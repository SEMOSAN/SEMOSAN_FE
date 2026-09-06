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

// course 모드 전용 필드는 필수로 강제 — 값을 생략하면 네이티브 쪽에서 기본값(0, 4장 등)으로
// 되돌아가 버려서, 예를 들어 사진을 찍은 뒤 업데이트에서 remainingPhotos를 빠뜨리면
// 남은 장수가 다시 4로 리셋되는 버그로 이어질 수 있다.
interface CourseLiveActivityFields {
  remainingMinutes: number;
  remainingMeters: number;
  progress: number;
  remainingPhotos: number;
}

export type StartLiveActivityParams =
  | ({ mode: 'free'; timerStartEpoch?: number })
  | ({ mode: 'course'; timerStartEpoch?: number } & CourseLiveActivityFields);

export type UpdateLiveActivityParams =
  | {
      mode: 'free';
      elapsedSeconds: number;
      isRunning: boolean;
      timerStartEpoch?: number;
    }
  | ({
      mode: 'course';
      elapsedSeconds: number;
      isRunning: boolean;
      timerStartEpoch?: number;
    } & CourseLiveActivityFields);

export const LiveActivity = {
  start(params: StartLiveActivityParams): Promise<string | null> {
    if (!LiveActivityNativeModule) return Promise.resolve(null);
    return LiveActivityNativeModule.startActivity({
      mode: params.mode,
      remainingMinutes: params.mode === 'course' ? params.remainingMinutes : 0,
      remainingMeters: params.mode === 'course' ? params.remainingMeters : 0,
      progress: params.mode === 'course' ? params.progress : 0,
      remainingPhotos: params.mode === 'course' ? params.remainingPhotos : 4,
      timerStartEpoch: params.timerStartEpoch,
    });
  },

  update(params: UpdateLiveActivityParams): Promise<void> {
    if (!LiveActivityNativeModule) return Promise.resolve();
    return LiveActivityNativeModule.updateActivity({
      elapsedSeconds: params.elapsedSeconds,
      isRunning: params.isRunning,
      mode: params.mode,
      remainingMinutes: params.mode === 'course' ? params.remainingMinutes : 0,
      remainingMeters: params.mode === 'course' ? params.remainingMeters : 0,
      progress: params.mode === 'course' ? params.progress : 0,
      remainingPhotos: params.mode === 'course' ? params.remainingPhotos : 4,
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
