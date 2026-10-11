import { api } from "@/lib/api";
import {
  ENDPOINTS,
  MountainDetailResponse,
  PageResponseLikedMountainResponse,
} from "@/types/api.generated";
import {
  notifyManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react-native";
import React from "react";
import { LIKES_KEY, useMountainBookmark } from "../use-mountain-bookmark";

jest.mock("@/lib/api", () => ({
  api: { get: jest.fn(), post: jest.fn() },
}));

// 기본 스케줄러는 setTimeout으로 알림을 모아 보내서 act() 밖에서 리렌더가 터진다.
notifyManager.setScheduler((cb) => cb());

const mockPost = api.post as jest.Mock;
const mockGet = api.get as jest.Mock;

const MOUNTAIN_ID = 7;
const mountainData = { mountainId: MOUNTAIN_ID, name: "관악산" };

function detailKey(mountainId: number) {
  return [ENDPOINTS.MOUNTAINS_BY_MOUNTAINID(mountainId)];
}

const clients: QueryClient[] = [];

function createClient() {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      // mutation gcTime 기본값(5분)을 두면 정리 타이머가 남아 jest가 종료되지 않는다.
      mutations: { retry: false, gcTime: 0 },
    },
  });
  clients.push(client);
  return client;
}

function setup(
  queryClient: QueryClient,
  { mountainId = MOUNTAIN_ID, liked = false } = {},
) {
  function wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }
  return renderHook(
    () => useMountainBookmark(mountainId, liked, mountainData),
    { wrapper },
  );
}

async function tap(result: { current: { toggle: () => void } }) {
  await act(async () => {
    result.current.toggle();
  });
}

function likesCache(queryClient: QueryClient) {
  return queryClient.getQueryData<PageResponseLikedMountainResponse>(LIKES_KEY);
}

function detailLiked(queryClient: QueryClient, mountainId = MOUNTAIN_ID) {
  return queryClient.getQueryData<MountainDetailResponse>(detailKey(mountainId))
    ?.mountain?.likedByMe;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockPost.mockResolvedValue({ data: { liked: true }, status: 200 });
});

afterEach(() => {
  // 정리하지 않으면 mutation gc 타이머가 남아 jest가 종료되지 않는다.
  clients.forEach((client) => client.clear());
  clients.length = 0;
});

describe("useMountainBookmark", () => {
  it("하트를 한 번 누르면 POST 한 건만 나가고 저장 목록을 다시 받아오지 않는다", async () => {
    const queryClient = createClient();
    const { result } = setup(queryClient);

    await tap(result);

    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockPost).toHaveBeenCalledWith({
      path: ENDPOINTS.MOUNTAINS_BY_MOUNTAINID_LIKE(MOUNTAIN_ID),
    });
    expect(mockGet).not.toHaveBeenCalled();
  });

  it("좋아요를 누르면 상세 캐시의 likedByMe가 켜진다", async () => {
    const queryClient = createClient();
    queryClient.setQueryData<MountainDetailResponse>(detailKey(MOUNTAIN_ID), {
      mountain: { mountainId: MOUNTAIN_ID, name: "관악산", likedByMe: false },
    });

    const { result } = setup(queryClient);
    await tap(result);

    expect(detailLiked(queryClient)).toBe(true);
  });

  it("좋아요를 누르면 저장 목록 맨 앞에 추가된다", async () => {
    const queryClient = createClient();
    queryClient.setQueryData<PageResponseLikedMountainResponse>(LIKES_KEY, {
      content: [{ mountainId: 1, name: "북한산" }],
      totalElements: 1,
    });

    const { result } = setup(queryClient);
    await tap(result);

    const cache = likesCache(queryClient);
    expect(cache?.content?.map((m) => m.mountainId)).toEqual([MOUNTAIN_ID, 1]);
    expect(cache?.totalElements).toBe(2);
  });

  it("좋아요를 해제하면 저장 목록에서 빠진다", async () => {
    mockPost.mockResolvedValue({ data: { liked: false }, status: 200 });
    const queryClient = createClient();
    queryClient.setQueryData<PageResponseLikedMountainResponse>(LIKES_KEY, {
      content: [mountainData, { mountainId: 1, name: "북한산" }],
      totalElements: 2,
    });

    const { result } = setup(queryClient, { liked: true });
    await tap(result);

    const cache = likesCache(queryClient);
    expect(cache?.content?.map((m) => m.mountainId)).toEqual([1]);
    expect(cache?.totalElements).toBe(1);
  });

  it("저장 목록 1페이지에 없는 산도 좋아요를 해제할 수 있다", async () => {
    // 저장 목록 기본 page size가 10이라 11번째 이후 산은 1페이지에 없다.
    // 예전처럼 목록으로 좋아요 여부를 판정하면 해제가 아니라 또 좋아요가 눌린다.
    mockPost.mockResolvedValue({ data: { liked: false }, status: 200 });
    const queryClient = createClient();
    queryClient.setQueryData<PageResponseLikedMountainResponse>(LIKES_KEY, {
      content: Array.from({ length: 10 }, (_, i) => ({
        mountainId: i + 100,
        name: `산${i}`,
      })),
      totalElements: 11,
    });
    queryClient.setQueryData<MountainDetailResponse>(detailKey(MOUNTAIN_ID), {
      mountain: { mountainId: MOUNTAIN_ID, name: "관악산", likedByMe: true },
    });

    const { result } = setup(queryClient, { liked: true });
    await tap(result);

    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(detailLiked(queryClient)).toBe(false);
    expect(likesCache(queryClient)?.content).toHaveLength(10);
  });

  it("서버가 돌려준 liked가 낙관적 값과 다르면 서버 쪽으로 맞춘다", async () => {
    // 다른 기기에서 이미 해제된 상태였다면 토글 결과가 예상과 어긋날 수 있다.
    mockPost.mockResolvedValue({ data: { liked: false }, status: 200 });
    const queryClient = createClient();
    queryClient.setQueryData<MountainDetailResponse>(detailKey(MOUNTAIN_ID), {
      mountain: { mountainId: MOUNTAIN_ID, name: "관악산", likedByMe: false },
    });

    const { result } = setup(queryClient);
    await tap(result);

    expect(detailLiked(queryClient)).toBe(false);
  });

  it("요청이 실패하면 캐시를 원래대로 되돌린다", async () => {
    mockPost.mockRejectedValue(new Error("500"));
    const queryClient = createClient();
    queryClient.setQueryData<PageResponseLikedMountainResponse>(LIKES_KEY, {
      content: [{ mountainId: 1, name: "북한산" }],
      totalElements: 1,
    });
    queryClient.setQueryData<MountainDetailResponse>(detailKey(MOUNTAIN_ID), {
      mountain: { mountainId: MOUNTAIN_ID, name: "관악산", likedByMe: false },
    });

    const { result } = setup(queryClient);
    await tap(result);

    expect(detailLiked(queryClient)).toBe(false);
    expect(likesCache(queryClient)?.content?.map((m) => m.mountainId)).toEqual([
      1,
    ]);
    expect(likesCache(queryClient)?.totalElements).toBe(1);
  });

  it("요청이 끝나기 전에 또 누르면 중복 요청을 보내지 않는다", async () => {
    const queryClient = createClient();
    const { result } = setup(queryClient);

    await act(async () => {
      result.current.toggle();
      result.current.toggle();
    });

    expect(mockPost).toHaveBeenCalledTimes(1);
  });
});
