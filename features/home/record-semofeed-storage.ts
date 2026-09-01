import AsyncStorage from "@react-native-async-storage/async-storage";

type RecordSemoFeedState = { id: number; isPublic: boolean };

function storageKey(sessionId: number, tab: string): string {
  return `@record_semofeed:${sessionId}:${tab}`;
}

// 백엔드에 기록별 세모피드 게시 여부를 조회할 API가 없어, 이 기기에서
// 게시/공개 전환한 상태를 로컬에 저장해 앱 재시작 후에도 복원한다.
export async function getRecordSemoFeedState(
  sessionId: number,
  tab: string,
): Promise<RecordSemoFeedState | null> {
  const json = await AsyncStorage.getItem(storageKey(sessionId, tab));
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function setRecordSemoFeedState(
  sessionId: number,
  tab: string,
  state: RecordSemoFeedState,
): Promise<void> {
  await AsyncStorage.setItem(storageKey(sessionId, tab), JSON.stringify(state));
}
