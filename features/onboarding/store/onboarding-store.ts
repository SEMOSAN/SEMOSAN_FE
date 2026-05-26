import { RegisterOnboardingRequest } from "@/types/api.generated";
import { create } from "zustand";

type HikingLevel = RegisterOnboardingRequest["hikingLevel"];
type ExerciseType = RegisterOnboardingRequest["exerciseType"];
type Gender = RegisterOnboardingRequest["gender"];

type OnboardingState = {
  // 1단계: 프로필
  nickname: string;
  profileUrl: string;
  birthDate: string;
  gender: Gender;
  height: number;
  weight: number;

  // 2단계: 등산 경험
  hikingLevel: HikingLevel | null;

  // 3단계 이후 (추후 화면 추가)
  exerciseType: ExerciseType;
  exerciseFrequency: RegisterOnboardingRequest["exerciseFrequency"];
  exerciseDuration: RegisterOnboardingRequest["exerciseDuration"];
  pushNotificationEnabled: boolean;
  liveActivityEnabled: boolean;
  voiceEnabled: boolean;
};

type OnboardingActions = {
  setProfile: (data: {
    nickname: string;
    profileUrl: string;
    birthDate: string;
    gender: Gender;
    height: number;
    weight: number;
  }) => void;
  setHikingLevel: (hikingLevel: HikingLevel) => void;
  setExerciseType: (exerciseType: ExerciseType) => void;
  setExerciseDuration: (
    exerciseDuration: RegisterOnboardingRequest["exerciseDuration"],
  ) => void;
  setExerciseFrequency: (
    exerciseFrequency: RegisterOnboardingRequest["exerciseFrequency"],
  ) => void;
  setPermissions: (data: {
    pushNotificationEnabled: boolean;
    liveActivityEnabled: boolean;
    voiceEnabled: boolean;
  }) => void;
  toRequest: () => RegisterOnboardingRequest | null;
  reset: () => void;
};

const INITIAL_STATE: OnboardingState = {
  nickname: "",
  profileUrl: "",
  birthDate: "",
  gender: "NONE",
  height: 0,
  weight: 0,
  hikingLevel: null,
  exerciseType: "NONE",
  exerciseFrequency: undefined,
  exerciseDuration: undefined,
  pushNotificationEnabled: true,
  liveActivityEnabled: true,
  voiceEnabled: true,
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>(
  (set, get) => ({
    ...INITIAL_STATE,

    setProfile: (data) => set(data),

    setHikingLevel: (hikingLevel) => set({ hikingLevel }),

    setExerciseType: (exerciseType) => set({ exerciseType }),

    setExerciseDuration: (exerciseDuration) => set({ exerciseDuration }),

    setExerciseFrequency: (exerciseFrequency) => set({ exerciseFrequency }),

    setPermissions: (data) => set(data),

    toRequest: () => {
      const s = get();
      if (!s.hikingLevel) return null;
      return {
        nickname: s.nickname || undefined,
        profileUrl: s.profileUrl || undefined,
        birthDate: s.birthDate,
        gender: s.gender,
        height: s.height,
        weight: s.weight,
        hikingLevel: s.hikingLevel,
        exerciseType: s.exerciseType,
        exerciseFrequency: s.exerciseFrequency,
        exerciseDuration: s.exerciseDuration,
        pushNotificationEnabled: s.pushNotificationEnabled,
        liveActivityEnabled: s.liveActivityEnabled,
        voiceEnabled: s.voiceEnabled,
      };
    },

    reset: () => set(INITIAL_STATE),
  }),
);
