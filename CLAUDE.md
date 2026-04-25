# Semosan — AI 어시스턴트용 프로젝트 가이드

## 기술 스택

- **React Native + Expo** (라우터: expo-router, `app/` 하위 파일 기반 라우팅)
- **NativeWind v4** — `className` prop으로 Tailwind CSS 유틸리티 클래스 사용
- **Tokens Studio** (Figma 플러그인) → **Style Dictionary v5** 빌드 파이프라인

---

## 디자인 토큰 시스템

### 개요

디자인 토큰은 **Figma**(Tokens Studio 플러그인)에서 관리되며 `tokens/` 디렉토리에 JSON으로 내보내집니다. 빌드 스크립트가 참조를 해석해 Tailwind에서 사용 가능한 파일들로 컴파일합니다. **생성된 파일은 절대 직접 수정하지 마세요.**

```
tokens/                    ← 소스 진실 (Figma 내보내기, 직접 수정 금지)
  global/global.json           원시 값 (팔레트, 폰트, 간격, 반경)
  semantic/Mode 1.json         글로벌 토큰을 참조하는 시맨틱 별칭
  $metadata.json               토큰 셋 로드 순서
tokens-build-script.mjs    Style Dictionary 빌드 설정
─── 자동 생성 파일 (수정 금지) ──────────────────────────────
tokens.cjs                 Tailwind 테마 컬러 확장
typography-plugin.cjs      .typo-* 유틸리티용 Tailwind 플러그인
css/variables.css          모든 토큰을 CSS 커스텀 프로퍼티로 정의
css/typography.css         CSS 변수를 참조하는 .typo-* 클래스
global.css                 Tailwind 진입점 (variables + typography + layers 임포트)
```

### 토큰 재빌드

```bash
npm run tokens
```

Figma 재내보내기 후 반드시 실행하세요. `tokens.cjs`, `typography-plugin.cjs`, `css/variables.css`, `css/typography.css`가 재생성됩니다.

---

## 스타일링 규칙

### 1. NativeWind의 `className`을 항상 사용할 것

```tsx
// ✅
<View className="flex-1 bg-fill-normal px-4 py-3">
  <Text className="typo-body-1-normal-regular text-label-normal">Hello</Text>
</View>

// ❌ 토큰 값에 인라인 스타일이나 StyleSheet 사용 금지
<View style={{ backgroundColor: '#ffffff', padding: 16 }}>
```

### 2. 토큰으로 존재하는 값은 절대 하드코딩하지 말 것

토큰으로 정의된 값이 있다면 Tailwind 클래스로 참조하세요. 원시 hex 값이나 숫자를 직접 사용하지 마세요.

---

## 디자인 토큰 참고

@tokens/README.md

---

## 수정하면 안 되는 파일

| 파일 / 디렉토리 | 이유 |
|----------------|------|
| `tokens/**` | Figma 내보내기 — Tokens Studio 재내보내기로만 업데이트 |
| `tokens.cjs` | `npm run tokens`로 자동 생성 |
| `typography-plugin.cjs` | `npm run tokens`로 자동 생성 |
| `css/variables.css` | `npm run tokens`로 자동 생성 |
| `css/typography.css` | `npm run tokens`로 자동 생성 |

---

## 레거시 / 미이전 코드

- `constants/theme.ts` — Expo 스타터 템플릿의 하드코딩된 `Colors` 객체(light/dark)와 `Fonts`. **디자인 토큰과 연결되지 않음.** 새 컴포넌트는 시맨틱 토큰 클래스를 사용하세요.
- `components/ThemedText.tsx`, `components/ThemedView.tsx` — 레거시 `Colors` 객체를 읽는 `useThemeColor` 사용. 새 화면에서는 사용하지 마세요.
- **다크 모드 토큰 전환 없음** — `tokens/$themes.json`이 비어있습니다. 다크 모드는 현재 토큰 시스템으로 처리되지 않습니다.

---

## 파일 구조

```
app/
  (tabs)/           탭 화면
  _layout.tsx       루트 레이아웃 (global.css 임포트)
components/         공통 UI 컴포넌트
features/           기능 단위 코드
constants/
  theme.ts          레거시 컬러/폰트 상수 (토큰 미연결)
tokens/             Figma 토큰 내보내기 (소스 진실)
tailwind.config.js  Tailwind 설정 (토큰 컬러 + typo 플러그인 확장)
global.css          Tailwind CSS 진입점
```
