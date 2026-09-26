import AsyncStorage from "@react-native-async-storage/async-storage";

/** 카드 디자인이 바뀌면 올린다. 키가 달라져 기존 합성본 대신 새로 만든다 */
export const CLIVE_COMPOSITE_VERSION = 1;

export function cliveCompositeKey(sessionId: number): string {
  return `@clive_composite:v${CLIVE_COMPOSITE_VERSION}:${sessionId}`;
}

/**
 * 한 번 합성해 업로드한 클라이브 이미지의 URL. 다음 진입부터 사진 N장 대신
 * 이 한 장만 받는다. 백엔드에 보관할 필드가 없어 로컬에 둔다.
 */
export async function getCliveCompositeUrl(
  sessionId: number,
): Promise<string | null> {
  const json = await AsyncStorage.getItem(cliveCompositeKey(sessionId));
  if (!json) return null;
  try {
    const parsed: unknown = JSON.parse(json);
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof (parsed as { imageUrl?: unknown }).imageUrl === "string"
    ) {
      return (parsed as { imageUrl: string }).imageUrl;
    }
    return null;
  } catch {
    return null;
  }
}

export async function setCliveCompositeUrl(
  sessionId: number,
  imageUrl: string,
): Promise<void> {
  await AsyncStorage.setItem(
    cliveCompositeKey(sessionId),
    JSON.stringify({ imageUrl }),
  );
}
