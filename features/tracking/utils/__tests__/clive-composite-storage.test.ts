import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CLIVE_COMPOSITE_VERSION,
  cliveCompositeKey,
  getCliveCompositeUrl,
  setCliveCompositeUrl,
} from "../clive-composite-storage";

jest.mock("@react-native-async-storage/async-storage", () => {
  const store = new Map<string, string>();
  return {
    getItem: jest.fn((k: string) => Promise.resolve(store.get(k) ?? null)),
    setItem: jest.fn((k: string, v: string) => {
      store.set(k, v);
      return Promise.resolve();
    }),
    __store: store,
  };
});

const store = (AsyncStorage as unknown as { __store: Map<string, string> })
  .__store;

beforeEach(() => {
  store.clear();
});

describe("cliveCompositeKey", () => {
  it("버전과 세션 ID를 키에 담는다", () => {
    expect(cliveCompositeKey(42)).toBe(
      `@clive_composite:v${CLIVE_COMPOSITE_VERSION}:42`,
    );
  });

  it("세션이 다르면 키가 다르다", () => {
    expect(cliveCompositeKey(1)).not.toBe(cliveCompositeKey(2));
  });
});

describe("getCliveCompositeUrl", () => {
  it("저장한 URL을 그대로 돌려준다", async () => {
    await setCliveCompositeUrl(7, "https://cdn.example.com/clive-7.jpg");
    await expect(getCliveCompositeUrl(7)).resolves.toBe(
      "https://cdn.example.com/clive-7.jpg",
    );
  });

  it("저장된 적 없으면 null이다", async () => {
    await expect(getCliveCompositeUrl(999)).resolves.toBeNull();
  });

  it("JSON이 깨져 있으면 null이다", async () => {
    store.set(cliveCompositeKey(7), "{not json");
    await expect(getCliveCompositeUrl(7)).resolves.toBeNull();
  });

  it("imageUrl이 문자열이 아니면 null이다", async () => {
    store.set(cliveCompositeKey(7), JSON.stringify({ imageUrl: 123 }));
    await expect(getCliveCompositeUrl(7)).resolves.toBeNull();
  });

  it("imageUrl 키가 없으면 null이다", async () => {
    store.set(cliveCompositeKey(7), JSON.stringify({ url: "x" }));
    await expect(getCliveCompositeUrl(7)).resolves.toBeNull();
  });

  it("null이 저장돼 있어도 터지지 않는다", async () => {
    store.set(cliveCompositeKey(7), "null");
    await expect(getCliveCompositeUrl(7)).resolves.toBeNull();
  });

  it("다른 세션의 값을 섞어 읽지 않는다", async () => {
    await setCliveCompositeUrl(1, "https://cdn.example.com/a.jpg");
    await setCliveCompositeUrl(2, "https://cdn.example.com/b.jpg");
    await expect(getCliveCompositeUrl(1)).resolves.toBe(
      "https://cdn.example.com/a.jpg",
    );
    await expect(getCliveCompositeUrl(2)).resolves.toBe(
      "https://cdn.example.com/b.jpg",
    );
  });
});
