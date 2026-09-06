import {
  haversineMeters,
  shouldAppendCoord,
  totalPathMeters,
} from "../track-path";

const SEOUL = { latitude: 37.5665, longitude: 126.978 };

describe("haversineMeters", () => {
  it("같은 좌표면 0을 반환한다", () => {
    expect(haversineMeters(SEOUL, SEOUL)).toBe(0);
  });

  it("위도 0.01도 차이는 약 1112m다", () => {
    const north = { ...SEOUL, latitude: SEOUL.latitude + 0.01 };
    expect(haversineMeters(SEOUL, north)).toBeCloseTo(1111.95, 0);
  });

  it("경도 0.01도 차이는 위도만큼 벌어지지 않는다", () => {
    const east = { ...SEOUL, longitude: SEOUL.longitude + 0.01 };
    expect(haversineMeters(SEOUL, east)).toBeCloseTo(881.4, 0);
  });

  it("방향이 바뀌어도 거리는 같다", () => {
    const north = { ...SEOUL, latitude: SEOUL.latitude + 0.01 };
    expect(haversineMeters(SEOUL, north)).toBeCloseTo(
      haversineMeters(north, SEOUL),
      6,
    );
  });
});

describe("shouldAppendCoord", () => {
  it("첫 좌표는 항상 남긴다", () => {
    expect(shouldAppendCoord(null, SEOUL, 10)).toBe(true);
  });

  it("최소 거리에 못 미치면 남기지 않는다", () => {
    // 위도 0.00001도 ≈ 1.1m
    const barelyMoved = { ...SEOUL, latitude: SEOUL.latitude + 0.00001 };
    expect(shouldAppendCoord(SEOUL, barelyMoved, 10)).toBe(false);
  });

  it("최소 거리 이상 움직이면 남긴다", () => {
    // 위도 0.0002도 ≈ 22m
    const moved = { ...SEOUL, latitude: SEOUL.latitude + 0.0002 };
    expect(shouldAppendCoord(SEOUL, moved, 10)).toBe(true);
  });

  it("제자리면 남기지 않는다", () => {
    expect(shouldAppendCoord(SEOUL, SEOUL, 10)).toBe(false);
  });

  it("최소 거리가 0이면 제자리여도 남긴다", () => {
    expect(shouldAppendCoord(SEOUL, SEOUL, 0)).toBe(true);
  });
});

describe("totalPathMeters", () => {
  it("좌표가 없으면 0이다", () => {
    expect(totalPathMeters([])).toBe(0);
  });

  it("좌표가 하나면 0이다", () => {
    expect(totalPathMeters([SEOUL])).toBe(0);
  });

  it("구간 거리를 모두 더한다", () => {
    const a = SEOUL;
    const b = { ...SEOUL, latitude: SEOUL.latitude + 0.01 };
    const c = { ...SEOUL, latitude: SEOUL.latitude + 0.02 };
    expect(totalPathMeters([a, b, c])).toBeCloseTo(
      haversineMeters(a, b) + haversineMeters(b, c),
      6,
    );
  });
});
