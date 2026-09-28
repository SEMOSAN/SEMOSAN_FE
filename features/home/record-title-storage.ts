import AsyncStorage from "@react-native-async-storage/async-storage";

function storageKey(sessionId: number): string {
  return `@record_title:${sessionId}`;
}

// 기록 제목 수정 API가 생기기 전(앱 1.3.0)에 이 기기에만 저장해둔 제목.
// 기록 상세에서 서버로 한 번 올린 뒤 지우는 용도로만 남아 있다.
export async function getRecordTitle(
  sessionId: number,
): Promise<string | null> {
  return AsyncStorage.getItem(storageKey(sessionId));
}

export async function clearRecordTitle(sessionId: number): Promise<void> {
  await AsyncStorage.removeItem(storageKey(sessionId));
}
