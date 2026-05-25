export type HikingLevel = "EXPERT" | "EXPERIENCED" | "HOBBY" | "BEGINNER";

export const HIKING_OPTIONS: { label: string; value: HikingLevel }[] = [
  { label: "등산이 제 일상이에요 (숙련자)", value: "EXPERT" },
  { label: "취미로 즐기는 편이에요 (경험자)", value: "EXPERIENCED" },
  { label: "가끔 기분 전환으로 가요 (취미자)", value: "HOBBY" },
  { label: "이제 막 시작했어요 (입문자)", value: "BEGINNER" },
];
