import { RegisterOnboardingRequest } from "@/types/api.generated";

export type ExerciseType = RegisterOnboardingRequest["exerciseType"];
export type ExerciseDuration = NonNullable<
  RegisterOnboardingRequest["exerciseDuration"]
>;
export type ExerciseFrequency = NonNullable<
  RegisterOnboardingRequest["exerciseFrequency"]
>;

export const EXERCISE_LABELS: Record<ExerciseType, string> = {
  GYM: "헬스",
  HIKING: "등산",
  RUNNING: "러닝",
  SWIMMING: "수영",
  HOME_TRAINING: "홈트레이닝",
  PILATES_YOGA: "필라테스/요가",
  SPORTS: "스포츠",
  CROSSFIT: "크로스핏",
  WALKING: "워킹",
  NONE: "운동 안 함",
};

export const EXERCISE_OPTIONS: { label: string; value: ExerciseType }[] = [
  { label: "헬스", value: "GYM" },
  { label: "등산", value: "HIKING" },
  { label: "러닝", value: "RUNNING" },
  { label: "수영", value: "SWIMMING" },
  { label: "홈트레이닝", value: "HOME_TRAINING" },
  { label: "필라테스/요가", value: "PILATES_YOGA" },
  { label: "스포츠 (배드민턴, 테니스, 축구 등)", value: "SPORTS" },
  { label: "크로스핏", value: "CROSSFIT" },
  { label: "운동 안 함", value: "NONE" },
];

export const DURATION_OPTIONS: { label: string; value: ExerciseDuration }[] = [
  { label: "4시간 이상", value: "OVER_4H" },
  { label: "2~4시간", value: "HOUR_2_4" },
  { label: "1~2시간", value: "HOUR_1_2" },
  { label: "1시간 미만", value: "UNDER_1H" },
];

export const FREQUENCY_OPTIONS: { label: string; value: ExerciseFrequency }[] =
  [
    { label: "거의 매일", value: "DAILY" },
    { label: "주 3~4회", value: "WEEK_3_4" },
    { label: "주 1~2회", value: "WEEK_1_2" },
    { label: "월 1~2회", value: "MONTH_1_2" },
    { label: "연 1~2회", value: "LESS_THAN_MONTH_1" },
  ];
