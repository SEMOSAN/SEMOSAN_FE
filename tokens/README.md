# tokens

Tokens Studio for Figma에서 export된 디자인 토큰 파일을 관리하는 폴더입니다.

## ⚠️ 직접 편집 금지

이 폴더의 파일들은 **Tokens Studio for Figma**에서 자동 생성된 파일입니다.
직접 수정하지 말고, Figma에서 토큰을 수정한 뒤 re-export 해주세요.

## 토큰 최신화 방법

1. Figma에서 **Tokens Studio** 플러그인 실행
2. **Import variables** 실행하여 Figma Variables를 불러오기
3. **Import styles** 실행하여 Figma Styles를 불러오기
4. **Export** → **Multiple files** 옵션으로 내보내기
5. 생성된 파일/폴더(`global/`, `semantic/`, `$metadata.json`, `$themes.json`)를 이 폴더에 그대로 붙여넣기 (덮어쓰기)
6. `npm run tokens` 실행

> 결과 : css/\* 및 tokens.cjs가 자동으로 최신화됨.

> ⚠️ **반드시 Import variables와 Import styles를 먼저 실행한 뒤 Export 해야 합니다.**
> 이 과정을 건너뛰면 최신 토큰이 반영되지 않은 채로 export될 수 있습니다.

## 파일 구성

export 시 아래 파일/폴더가 생성되며, 이 폴더에 함께 위치해야 합니다.

```
tokens/
├── global/
│   └── global.json       # 전역 디자인 토큰 (color, typography, spacing 등)
├── semantic/
│   └── Mode 1.json       # 시맨틱 토큰 (light/dark 모드별 의미론적 토큰)
├── $metadata.json        # 토큰 세트의 순서 및 메타 정보
└── $themes.json          # 테마(light/dark 등) 구성 정보
```

## 주의사항

- 파일명 및 폴더 구조는 **변경하지 마세요**. 변환 스크립트가 이 구조를 기준으로 파일을 찾습니다.
- 파일 중 하나라도 누락되면 빌드가 실패할 수 있습니다.
- 토큰 구조(세트 이름, 계층 등)를 변경해야 할 경우, 변환 스크립트도 함께 수정이 필요할 수 있으니 팀에 공유해주세요.
