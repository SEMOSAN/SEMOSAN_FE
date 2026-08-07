/**
 * semver 형식 버전 비교.
 * a < b → -1, a === b → 0, a > b → 1. 누락된 세그먼트는 0으로 취급.
 * 예: compareVersion("1.1", "1.2.0") === -1
 */
export function compareVersion(a: string, b: string): number {
  const pa = a.split(".").map((n) => parseInt(n, 10) || 0);
  const pb = b.split(".").map((n) => parseInt(n, 10) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff > 0 ? 1 : -1;
  }
  return 0;
}
