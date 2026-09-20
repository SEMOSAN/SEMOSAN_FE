import AsyncStorage from "@react-native-async-storage/async-storage";

function storageKey(hikingRecordId: number): string {
  return `@record_difficulty_seen:${hikingRecordId}`;
}

// 난이도 체감 바텀시트를 이 기록에서 이미 보여줬는지(최초 조회 여부) 기기에 저장
export async function getHasSeenDifficultyPrompt(
  hikingRecordId: number,
): Promise<boolean> {
  const value = await AsyncStorage.getItem(storageKey(hikingRecordId));
  return value === "1";
}

export async function markDifficultyPromptSeen(
  hikingRecordId: number,
): Promise<void> {
  await AsyncStorage.setItem(storageKey(hikingRecordId), "1");
}
