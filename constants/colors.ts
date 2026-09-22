/**
 * 디자인 토큰 색상의 런타임 조회 경로.
 * className을 받지 못하는 SVG 아이콘·ActivityIndicator 등에 값으로 넘길 때 쓴다.
 * (tokens.cjs는 CommonJS라 require로 읽는다)
 */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const tokens = require("../tokens.cjs") as {
  colors: Record<string, Record<string, string>>;
};

export const colors = tokens.colors;
