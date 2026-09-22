import AsyncStorage from "@react-native-async-storage/async-storage";

function storageKey(sessionId: number): string {
  return `@record_title:${sessionId}`;
}

// 기록 제목을 나중에 수정하는 백엔드 API가 없어, 이 기기에서 새로 지은
// 제목을 로컬에 저장해 앱 재시작 후에도 복원한다.
export async function getRecordTitle(
  sessionId: number,
): Promise<string | null> {
  return AsyncStorage.getItem(storageKey(sessionId));
}

export async function setRecordTitle(
  sessionId: number,
  title: string,
): Promise<void> {
  await AsyncStorage.setItem(storageKey(sessionId), title);
}
