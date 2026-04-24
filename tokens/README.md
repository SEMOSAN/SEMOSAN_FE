# tokens

Tokens Studio for Figma에서 export된 디자인 토큰 파일을 관리하는 폴더입니다.

## ⚠️ 직접 편집 금지

이 폴더의 파일들은 **Tokens Studio for Figma**에서 자동 생성된 파일입니다.
직접 수정하지 말고, Figma에서 토큰을 수정한 뒤 re-export 해주세요.

## 사용 방법

1. Figma에서 **Tokens Studio** 플러그인 실행
2. **Import variables** 실행하여 Figma Variables를 불러오기
3. **Import styles** 실행하여 Figma Styles를 불러오기
4. **Export** → **Multiple files** 옵션으로 내보내기
5. 생성된 아래 3개 파일을 이 폴더에 그대로 붙여넣기 (덮어쓰기)

> ⚠️ **반드시 Import variables와 Import styles를 먼저 실행한 뒤 Export 해야 합니다.**
> 이 과정을 건너뛰면 최신 토큰이 반영되지 않은 채로 export될 수 있습니다.

## 파일 구성

export 시 아래 3개의 파일이 생성되며, 이 폴더에 함께 위치해야 합니다.

| 파일             | 용도                                             |
| ---------------- | ------------------------------------------------ |
| `global.json`    | 전역 디자인 토큰 (color, typography, spacing 등) |
| `$metadata.json` | 토큰 세트의 순서 및 메타 정보                    |
| `$themes.json`   | 테마(light/dark 등) 구성 정보                    |

## 업데이트 후 해야 할 일

토큰 파일을 교체한 뒤에는 반드시 변환 스크립트를 실행해 프론트엔드에서 사용할 수 있는 형태로 빌드하세요.

```bash
npm run tokens
```

실행 결과는 `build/` 폴더에 생성됩니다.

## 주의사항

- 파일명(`global.json`, `$metadata.json`, `$themes.json`)은 **변경하지 마세요**. 변환 스크립트가 이 이름을 기준으로 파일을 찾습니다.
- 3개 파일 중 하나라도 누락되면 빌드가 실패할 수 있습니다.
- 토큰 구조(세트 이름, 계층 등)를 변경해야 할 경우, 변환 스크립트도 함께 수정이 필요할 수 있으니 팀에 공유해주세요.
