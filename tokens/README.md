# 디자인 토큰

Tokens Studio for Figma에서 export된 디자인 토큰 파일을 관리하는 폴더입니다.

---

## ⚠️ 직접 편집 금지

이 폴더의 파일들은 **Tokens Studio for Figma**에서 자동 생성된 파일입니다.
직접 수정하지 말고, Figma에서 토큰을 수정한 뒤 re-export 해주세요.

---

## 토큰 최신화 방법

1. Figma에서 **Tokens Studio** 플러그인 실행
2. **Import variables** 실행하여 Figma Variables를 불러오기
3. **Import styles** 실행하여 Figma Styles를 불러오기
4. **Export** → **Multiple files** 옵션으로 내보내기
5. 생성된 파일/폴더(`global/`, `semantic/`, `$metadata.json`, `$themes.json`)를 이 폴더에 그대로 붙여넣기 (덮어쓰기)
6. `npm run tokens` 실행

> 결과: `css/*`, `tokens.cjs`, `typography-plugin.cjs`가 자동으로 최신화됨.

> ⚠️ **반드시 Import variables와 Import styles를 먼저 실행한 뒤 Export 해야 합니다.**
> 이 과정을 건너뛰면 최신 토큰이 반영되지 않은 채로 export될 수 있습니다.

---

## 파일 구성

```
tokens/
├── global/
│   └── global.json       # 전역 디자인 토큰 (color, typography, spacing 등)
├── semantic/
│   └── Mode 1.json       # 시맨틱 토큰 (의미론적 토큰)
├── $metadata.json        # 토큰 세트의 순서 및 메타 정보
└── $themes.json          # 테마 구성 정보 (현재 비어있음 — 다크모드 미지원)
```

빌드 결과물 (수정 금지):

| 파일 | 내용 |
|------|------|
| `tokens.cjs` | Tailwind 컬러 토큰 — `colors` 객체 키 구조가 곧 Tailwind 클래스명 |
| `typography-plugin.cjs` | Tailwind 타이포그래피 토큰 — 정의된 키가 곧 `typo-*` 클래스명 |
| `css/variables.css` | 모든 토큰을 CSS 커스텀 프로퍼티(`--spacing-*`, `--radius-*` 등)로 정의 |
| `css/typography.css` | CSS 변수를 참조하는 `.typo-*` 클래스 |

---

## 사용법 요약

**컬러** — `tokens.cjs`의 `colors` 객체를 확인 후 Tailwind 클래스로 사용:
```
bg-{그룹}-{이름} / text-{그룹}-{이름} / border-{그룹}-{이름}
```

**타이포그래피** — `typography-plugin.cjs`의 키를 확인 후 className으로 사용:
```tsx
<Text className="typo-body-1-normal-regular text-label-normal" />
```

**간격/반경** — Tailwind 테마 미주입. CSS 변수로 사용:
```tsx
<View style={{ padding: 'var(--spacing-16)', borderRadius: 'var(--radius-md)' }} />
```
