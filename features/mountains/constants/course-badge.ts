import { type CourseDifficulty } from "./mountain-detail";

export const COURSE_BADGE: Record<CourseDifficulty, { bg: string; text: string }> = {
  초급: { bg: "bg-green-50", text: "text-green-500" },
  중급: { bg: "bg-blue-50", text: "text-blue-500" },
  상급: { bg: "bg-red-50", text: "text-red-500" },
};
