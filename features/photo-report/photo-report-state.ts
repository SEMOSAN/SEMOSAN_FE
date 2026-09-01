import AsyncStorage from "@react-native-async-storage/async-storage";

type PhotoReportState = {
  sessionId: number | null;
  photoSource: number | { uri: string } | null;
  templateIndex: number;
};

const STORAGE_KEY = "@photo_report_state";
const INITIAL_STATE: PhotoReportState = {
  sessionId: null,
  photoSource: null,
  templateIndex: 0,
};

// 앱을 종료했다가 다시 들어와도 편집 중이던 포토 리포트(사진/템플릿 선택)를
// 복원할 수 있도록 인메모리가 아닌 AsyncStorage에 저장한다.
export async function getPhotoReportState(): Promise<PhotoReportState> {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  if (!json) return INITIAL_STATE;
  try {
    return { ...INITIAL_STATE, ...JSON.parse(json) };
  } catch {
    return INITIAL_STATE;
  }
}

export async function setPhotoReportState(
  updates: Partial<PhotoReportState>,
): Promise<void> {
  const current = await getPhotoReportState();
  const next = { ...current, ...updates };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
