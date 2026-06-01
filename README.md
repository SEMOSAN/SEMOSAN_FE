# SEMOSAN — 세모산

<img src="assets/screenshots/semosan.png" alt="세모산 앱 소개" width="100%" />

<br />

> 등산이 처음이어도 괜찮아요.
> 내 체력과 취향에 맞는 코스를 찾고, 실시간 안내와 기록, 후기까지 —
> 더 가볍고 안전한 등산을 세모산과 함께 시작하세요.

<br />

## 📱 주요 기능

<table>
  <tr>
    <td align="center" width="33%">
      <img src="assets/screenshots/home-feed.png" alt="정복 지도" width="220" />
      <br /><br />
      <b>🗺️ 정복 지도</b>
      <br />
      <sub>내가 다녀온 산을 지도 위에서 한눈에</sub>
    </td>
    <td align="center" width="33%">
      <img src="assets/screenshots/semofeed.png" alt="세모피드" width="220" />
      <br /><br />
      <b>📰 세모피드</b>
      <br />
      <sub>등산 커뮤니티의 생생한 후기 피드</sub>
    </td>
    <td align="center" width="33%">
      <img src="assets/screenshots/mountains.png" alt="산 탐색" width="220" />
      <br /><br />
      <b>🏔️ 산 목록</b>
      <br />
      <sub>인근 산 조회 및 코스 정보 확인</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="33%">
      <img src="assets/screenshots/tracking.png" alt="GPS 트래킹" width="220" />
      <br /><br />
      <b>📍 실시간 GPS 트래킹</b>
      <br />
      <sub>코스 안내·마일스톤 인증 사진·정상 기록</sub>
    </td>
    <td align="center" width="33%">
      <img src="assets/screenshots/community.png" alt="커뮤니티" width="220" />
      <br /><br />
      <b>💬 커뮤니티</b>
      <br />
      <sub>등산 후기 및 사진 공유</sub>
    </td>
    <td align="center" width="33%">
      <img src="assets/screenshots/mypage.png" alt="내 기록" width="220" />
      <br /><br />
      <b>📊 마이페이지</b>
      <br />
      <sub>등산 이력 및 난이도 피드백 관리</sub>
    </td>
  </tr>
</table>

<br />

## 🛠️ 기술 스택

### Frontend
- **React Native** + **Expo** (expo-router 파일 기반 라우팅)
- **NativeWind v4** — Tailwind CSS 유틸리티 클래스
- **TanStack Query** — 서버 상태 관리 및 캐싱
- **Zustand** — 클라이언트 상태 관리
- **React Native Reanimated** + **Gesture Handler** — 애니메이션 및 제스처

### 지도 & 위치
- **Naver Map** (`@mj-studio/react-native-naver-map`)
- **expo-location** — 백그라운드 GPS 추적
- **expo-task-manager** — 백그라운드 위치 태스크

### 알림 & 실시간
- **Firebase FCM** (`@react-native-firebase/messaging`) — 마일스톤 푸시 알림
- **STOMP WebSocket** (`@stomp/stompjs`) — 실시간 GPS 데이터 전송

### 인증
- **카카오 로그인** (`@react-native-kakao`)
- **Apple 로그인** (`expo-apple-authentication`)

### 디자인 시스템
- **Tokens Studio** (Figma) → **Style Dictionary v5** 빌드 파이프라인
- 시맨틱 디자인 토큰 기반 컬러·타이포그래피

<br />

## 📁 프로젝트 구조

```
app/
  (tabs)/           # 탭 화면 (홈, 탐색, 트래킹, 커뮤니티, 마이페이지)
  _layout.tsx       # 루트 레이아웃
features/           # 기능 단위 모듈
  auth/             # 로그인·인증
  tracking/         # GPS 트래킹 (핵심 기능)
  mountains/        # 산 탐색
  community/        # 커뮤니티
  mypage/           # 마이페이지
  home/             # 홈
components/         # 공통 UI 컴포넌트
tokens/             # Figma 디자인 토큰 (수정 금지)
```

<br />

## 🚀 시작하기

### 요구사항

- Node.js 18+
- Xcode (iOS 빌드)
- Expo CLI

### 설치

```bash
git clone https://github.com/SEMOSAN/SEMOSAN_FE.git
cd SEMOSAN_FE
npm run expo-install
```

### 개발 서버 실행

```bash
npm start
```

### 디자인 토큰 재빌드 (Figma 토큰 변경 후)

```bash
npm run tokens
```

<br />

## 📐 개발 규칙

- 스타일은 반드시 `className` (NativeWind) 사용 — `StyleSheet` / 인라인 스타일 지양
- 토큰으로 정의된 값은 Tailwind 클래스로 참조 (hex 하드코딩 금지)
- `tokens/`, `tokens.cjs`, `css/` 자동 생성 파일 직접 수정 금지
