import { MountainListResponse } from "@/types/api.generated";

type MountainDifficulty = NonNullable<MountainListResponse["difficulty"]>;

export const COURSE_BADGE: Record<
  MountainDifficulty,
  { style: { bg: string; text: string }; korean: string }
> = {
  EASY: {
    style: { bg: "bg-green-50", text: "text-green-500" },
    korean: "초급",
  },
  NORMAL: {
    style: { bg: "bg-blue-50", text: "text-blue-500" },
    korean: "중급",
  },
  HARD: { style: { bg: "bg-red-50", text: "text-red-500" }, korean: "상급" },
};
