import SemosanLogoSvg from "@/assets/semosan-logo.svg";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Defs, LinearGradient as SvgGradient, Path, Stop } from "react-native-svg";

// ─── 데이터 포맷 헬퍼 ──────────────────────────────────────────────────────────

export function fmtDistance(meters?: number): string {
  if (meters == null) return "--";
  return (meters / 1000).toFixed(2);
}

export function fmtCalories(kcal?: number): string {
  if (kcal == null) return "--";
  return String(kcal);
}

export function fmtElevation(meters?: number): string {
  if (meters == null) return "--";
  return String(Math.round(meters));
}

export function fmtWeather(temp?: number): string {
  if (temp == null) return "--";
  return `${Math.round(temp)}°`;
}

export function fmtDuration(seconds?: number): string {
  if (seconds == null) return "--";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function fmtDate(iso?: string): string {
  if (!iso) return "--";
  const d = new Date(iso);
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}`;
}

// ─── 오버레이 props ───────────────────────────────────────────────────────────

export type OverlayProps = {
  distance: string;
  calories: string;
  elevation: string;
  weather: string;
  duration: string;
  date: string;
  // Figma 기준 카드: 240×426. 다른 크기 카드에서는 scale 전달 (e.g. 335/240 ≈ 1.4)
  scale?: number;
};

// ─── 산 실루엣 SVG (Figma 하드코딩) ─────────────────────────────────────────
// viewBox="0 0 186 44", Figma 기준 position: x=28.36, y=30.48

function MountainFrame({ scale = 1 }: { scale?: number }) {
  const w = 186 * scale;
  const h = 44 * scale;
  return (
    <View style={{ position: "absolute", top: 30.48 * scale, left: 28.36 * scale }}>
      <Svg width={w} height={h} viewBox="0 0 186 44" fill="none">
        <Defs>
          <SvgGradient id="fillGrad" x1="92.12" y1="0.42" x2="92.12" y2="43.42" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="white" stopOpacity="0.5" />
            <Stop offset="1" stopColor="white" stopOpacity="0" />
          </SvgGradient>
          <SvgGradient id="strokeGrad" x1="92.12" y1="0.42" x2="92.12" y2="43.42" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="white" stopOpacity="1" />
            <Stop offset="1" stopColor="white" stopOpacity="0" />
          </SvgGradient>
        </Defs>
        <Path
          d="M3.53238 41.0685C3.25928 41.8747 1.14277 42.7482 0.118652 43.0841L184.119 43.42L183.095 42.4122C182.412 41.7404 180.705 42.0763 179.681 41.4044C178.657 40.7325 177.974 40.0607 177.633 39.3888C177.359 38.8513 175.926 38.045 175.243 37.7091C173.991 37.1492 171.146 35.8279 169.781 35.0216C168.415 34.2154 166.936 34.0138 166.367 34.0138L164.319 31.9982C163.295 31.7742 161.11 31.2591 160.564 30.9904C159.881 30.6544 158.516 30.6544 157.492 30.6544C156.467 30.6544 156.809 29.3107 156.467 28.9747C156.194 28.706 155.216 27.9669 154.761 27.631C153.964 27.1831 152.303 26.22 152.03 25.9513C151.688 25.6154 148.957 24.6075 148.275 24.2716C147.728 24.0029 145.999 23.7117 145.202 23.5997L143.495 20.5763L138.375 18.8966L137.009 19.2325L134.961 18.8966C134.506 18.1128 133.527 16.4779 133.254 16.2091C132.913 15.8732 130.523 14.8654 129.84 14.5294L127.792 13.5216L124.72 11.8419L123.354 10.8341L121.989 9.49036H117.21L115.844 10.8341C115.389 10.7221 114.479 10.431 114.479 10.1622C114.479 9.89348 113.113 9.60234 112.43 9.49036L110.723 10.8341L109.358 12.5138H108.334C107.651 11.9539 106.286 10.7669 106.286 10.4982C106.286 10.1622 104.92 8.8186 104.579 8.48259L104.579 8.48254C104.306 8.21379 102.872 7.25077 102.189 6.80286C100.824 5.90702 98.0927 4.04817 98.0927 3.77942C98.0927 3.51067 96.4996 2.09973 95.7031 1.42786H93.3135L90.5825 0.420044L88.8756 1.42786L87.5101 3.44348H86.1446L84.7791 4.11536L82.7309 6.46692L79.6585 8.14661L78.9758 8.48254L78.2931 9.82629L76.9276 11.17C76.7 11.506 76.2448 12.1107 76.2448 11.8419C76.2448 11.5732 74.8793 11.0581 74.1966 10.8341L72.8311 9.82629L71.1242 8.48254L66.0036 9.15442L64.6381 9.82629L60.2003 11.506L59.5175 12.8497L55.7624 13.1857L52.3487 14.5294L48.935 18.2247L46.8867 17.8888L45.8626 18.2247L44.4971 19.2325L42.7903 20.5763L41.4248 21.92L37.6697 23.2638L35.6214 24.6075L33.5732 25.9513H32.2077L31.1836 26.9591L27.7699 29.3107L25.7216 30.3185L23.332 30.9904L20.9424 32.3341L17.87 32.67L17.1873 34.6857H15.8218L14.7977 36.0294L12.4081 37.0372H10.3598L8.65298 38.7169L4.89787 39.7247C4.5565 39.8367 3.80548 40.2622 3.53238 41.0685Z"
          fill="url(#fillGrad)"
          stroke="url(#strokeGrad)"
          strokeWidth="0.762"
        />
      </Svg>
    </View>
  );
}

// ─── 통계 아이템 ──────────────────────────────────────────────────────────────

// 폰트 크기 — Figma 원본 그대로 (카드가 240×426로 Figma 프레임과 1:1 크기이므로 배율 불필요)
const LABEL_FS = 3;
const VALUE_FS = 13;
const UNIT_FS = 6;

function StatItem({
  label,
  value,
  unit,
  scale = 1,
}: {
  label: string;
  value: string;
  unit?: string;
  scale?: number;
}) {
  return (
    <View style={{ gap: scale * 1 }}>
      <Text style={{ fontSize: scale * LABEL_FS, fontWeight: "600", color: "white", opacity: 0.8 }}>
        {label}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "flex-end", gap: scale * 1.5 }}>
        <Text style={{ fontSize: scale * VALUE_FS, fontWeight: "700", color: "white", fontFamily: "Lexend_700Bold", letterSpacing: scale * 0.26, lineHeight: scale * VALUE_FS * 1.25 }}>
          {value}
        </Text>
        {unit ? (
          <Text style={{ fontSize: scale * UNIT_FS, fontWeight: "600", color: "white", paddingBottom: scale * 2 }}>
            {unit}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

// ─── 공통 배경 그라디언트 ─────────────────────────────────────────────────────

function OverlayBackground() {
  return (
    <LinearGradient
      colors={["rgba(0,0,0,0.45)", "rgba(0,0,0,0)"]}
      locations={[0, 0.55]}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    />
  );
}

// ─── 템플릿 1 ─────────────────────────────────────────────────────────────────
// Figma 240×426 기준 좌표. scale=335/240≈1.4 로 전달하면 335×596 카드에 맞게 확장됨

export function Template1Overlay({ distance, calories, elevation, weather, duration, date, scale = 1 }: OverlayProps) {
  const s = scale;
  // 열 시작 x (Figma: 26.36, 95.36, 158.36)
  const col1x = s * 26.36;
  const col2x = s * 95.36;
  const col3x = s * 158.36;
  // 그리드 시작 y (Figma: 87.8)
  const gridY = s * 87.8;
  // 로고 (Figma: x=159, y=402)
  const logoX = s * 159;
  const logoY = s * 402;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <OverlayBackground />
      <MountainFrame scale={s} />

      {/* 열 1: DISTANCE / CALORIES */}
      <View style={{ position: "absolute", top: gridY, left: col1x, gap: s * 10 }}>
        <StatItem label="DISTANCE" value={distance} unit="km" scale={s} />
        <StatItem label="CALORIES" value={calories} unit="kcal" scale={s} />
      </View>

      {/* 열 2: ELEVATION / WEATHER */}
      <View style={{ position: "absolute", top: gridY, left: col2x, gap: s * 10 }}>
        <StatItem label="ELEVATION" value={elevation} unit="m" scale={s} />
        <StatItem label="WEATHER (°C)" value={weather} scale={s} />
      </View>

      {/* 열 3: DURATION / DATE */}
      <View style={{ position: "absolute", top: gridY, left: col3x, gap: s * 10 }}>
        <StatItem label="DURATION" value={duration} scale={s} />
        <StatItem label="DATE" value={date} scale={s} />
      </View>

      {/* 세모산 로고 */}
      <View style={{ position: "absolute", top: logoY, left: logoX, opacity: 0.9 }}>
        <SemosanLogoSvg width={s * 65} height={s * 8} />
      </View>
    </View>
  );
}

// ─── 템플릿 2 산 실루엣 (83×29 viewBox, Figma 하드코딩) ──────────────────────

function MountainFrameSmall({ scale = 1 }: { scale?: number }) {
  const w = 83 * scale;
  const h = 29 * scale;
  return (
    <View style={{ position: "absolute", top: 334.64 * scale, left: 134.5 * scale }}>
      <Svg width={w} height={h} viewBox="0 0 83 29" fill="none">
        <Defs>
          <SvgGradient id="fillGrad2" x1="41.15" y1="0.43" x2="41.15" y2="28.43" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="white" stopOpacity="1" />
            <Stop offset="1" stopColor="white" stopOpacity="0" />
          </SvgGradient>
          <SvgGradient id="strokeGrad2" x1="41.15" y1="0.43" x2="41.15" y2="28.43" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="white" stopOpacity="1" />
            <Stop offset="1" stopColor="white" stopOpacity="0" />
          </SvgGradient>
        </Defs>
        <Path
          d="M1.67612 26.9008C1.55441 27.4258 0.611186 27.9946 0.154785 28.2133L82.1548 28.4321L81.6984 27.7758C81.3941 27.3383 80.6335 27.5571 80.1771 27.1196C79.7207 26.6821 79.4164 26.2446 79.2642 25.8071C79.1425 25.4571 78.5036 24.9321 78.1993 24.7133C77.6415 24.3488 76.3737 23.4883 75.7652 22.9633C75.1566 22.4383 74.4974 22.3071 74.2438 22.3071L73.331 20.9946C72.8746 20.8488 71.901 20.5133 71.6576 20.3383C71.3533 20.1196 70.7448 20.1196 70.2884 20.1196C69.832 20.1196 69.9841 19.2446 69.832 19.0258C69.7103 18.8508 69.2741 18.3696 69.0713 18.1508C68.7163 17.8592 67.9759 17.2321 67.8542 17.0571C67.7021 16.8383 66.485 16.1821 66.1808 15.9633C65.9373 15.7883 65.1665 15.5988 64.8116 15.5258L64.0509 13.5571L61.7689 12.4633L61.1604 12.6821L60.2476 12.4633C60.0447 11.9529 59.6086 10.8883 59.4869 10.7133C59.3348 10.4946 58.2698 9.83834 57.9656 9.61959L57.0527 8.96334L55.6836 7.86959L55.075 7.21334L54.4665 6.33834H52.3366L51.7281 7.21334C51.5252 7.14042 51.1195 6.95084 51.1195 6.77584C51.1195 6.60084 50.511 6.41126 50.2067 6.33834L49.4461 7.21334L48.8375 8.30709H48.3811C48.0769 7.94251 47.4683 7.16959 47.4683 6.99459C47.4683 6.77584 46.8598 5.90084 46.7077 5.68209C46.586 5.50709 45.947 4.88001 45.6427 4.58834C45.0342 4.00501 43.8171 2.79459 43.8171 2.61959C43.8171 2.44459 43.1072 1.52584 42.7522 1.08834H41.6873L40.4702 0.432091L39.7095 1.08834L39.101 2.40084H38.4925L37.8839 2.83834L36.9711 4.36959L35.6019 5.46334L35.2976 5.68209L34.9934 6.55709L34.3848 7.43209C34.2834 7.65084 34.0806 8.04459 34.0806 7.86959C34.0806 7.69459 33.472 7.35917 33.1678 7.21334L32.5592 6.55709L31.7986 5.68209L29.5166 6.11959L28.908 6.55709L26.9303 7.65084L26.626 8.52584L24.9526 8.74459L23.4312 9.61959L21.9099 12.0258L20.9971 11.8071L20.5407 12.0258L19.9321 12.6821L19.1715 13.5571L18.5629 14.4321L16.8895 15.3071L15.9767 16.1821L15.0639 17.0571H14.4553L13.9989 17.7133L12.4776 19.2446L11.5648 19.9008L10.4999 20.3383L9.43493 21.2133L8.06573 21.4321L7.76146 22.7446H7.15293L6.69653 23.6196L5.63159 24.2758H4.71879L3.95812 25.3696L2.28466 26.0258C2.13252 26.0988 1.79783 26.3758 1.67612 26.9008Z"
          fill="url(#fillGrad2)"
          fillOpacity="0.6"
          stroke="url(#strokeGrad2)"
          strokeWidth="0.716"
        />
      </Svg>
    </View>
  );
}

// ─── 템플릿 2 ─────────────────────────────────────────────────────────────────
// Stats 하단 배치 (y≈308), 그라디언트 하단 어둡게, 로고 좌상단

export function Template2Overlay({ distance, calories, elevation, weather, duration, date, scale = 1 }: OverlayProps) {
  const s = scale;
  // Figma 기준 절대 좌표 (카드 x=7770, y=-250.5 기준)
  const col1x = s * 24.5;   // x=7794.5-7770
  const col2x = s * 76.5;   // x=7846.5-7770
  const datex = s * 160.5;  // x=7930.5-7770
  const row1y = s * 308.49; // y=58.0-(-250.5)
  const row2y = s * 342.49; // y=92.0-(-250.5)
  const row3y = s * 376.49; // y=126.0-(-250.5)

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* 하단 그라디언트 (stats가 아래에 있으므로 역방향) */}
      <LinearGradient
        colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.5)"]}
        locations={[0.4, 1.0]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* 세모산 로고 — 좌상단 (x=13.5, y=16.5) */}
      <View style={{ position: "absolute", top: s * 16.5, left: s * 13.5, opacity: 0.9 }}>
        <SemosanLogoSvg width={s * 65} height={s * 8} />
      </View>

      {/* 작은 산 실루엣 */}
      <MountainFrameSmall scale={s} />

      {/* 행 1: DISTANCE | DURATION */}
      <View style={{ position: "absolute", top: row1y, left: col1x }}>
        <StatItem label="DISTANCE" value={distance} unit="km" scale={s} />
      </View>
      <View style={{ position: "absolute", top: row1y, left: col2x }}>
        <StatItem label="DURATION" value={duration} scale={s} />
      </View>

      {/* 행 2: ELEVATION | CALORIES */}
      <View style={{ position: "absolute", top: row2y, left: col1x }}>
        <StatItem label="ELEVATION" value={elevation} unit="m" scale={s} />
      </View>
      <View style={{ position: "absolute", top: row2y, left: col2x }}>
        <StatItem label="CALORIES" value={calories} unit="kcal" scale={s} />
      </View>

      {/* 행 3: WEATHER | (STEPS 빈칸 — 데이터 소스 없음) | DATE */}
      <View style={{ position: "absolute", top: row3y, left: col1x }}>
        <StatItem label="WEATHER (°C)" value={weather} scale={s} />
      </View>
      <View style={{ position: "absolute", top: row3y, left: datex }}>
        <StatItem label="DATE" value={date} scale={s} />
      </View>
    </View>
  );
}

// ─── 템플릿 3 산 실루엣 (85×30 viewBox, Figma 하드코딩) ──────────────────────

function MountainFrame3({ scale = 1 }: { scale?: number }) {
  const w = 85 * scale;
  const h = 30 * scale;
  return (
    <View style={{ position: "absolute", top: 29 * scale, left: 25 * scale }}>
      <Svg width={w} height={h} viewBox="0 0 85 30" fill="none">
        <Defs>
          <SvgGradient id="fillGrad3" x1="42.16" y1="0.43" x2="42.16" y2="29.43" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="white" stopOpacity="1" />
            <Stop offset="1" stopColor="white" stopOpacity="0" />
          </SvgGradient>
          <SvgGradient id="strokeGrad3" x1="42.16" y1="0.43" x2="42.16" y2="29.43" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="white" stopOpacity="1" />
            <Stop offset="1" stopColor="white" stopOpacity="0" />
          </SvgGradient>
        </Defs>
        <Path
          d="M1.71469 27.8476C1.59002 28.3914 0.623782 28.9805 0.15625 29.207L84.1562 29.4336L83.6887 28.7539C83.377 28.3008 82.5978 28.5273 82.1303 28.0742C81.6628 27.6211 81.3511 27.168 81.1952 26.7148C81.0705 26.3523 80.416 25.8086 80.1043 25.582C79.5329 25.2044 78.2342 24.3133 77.6108 23.7695C76.9874 23.2258 76.3121 23.0898 76.0524 23.0898L75.1173 21.7305C74.6498 21.5794 73.6524 21.232 73.403 21.0508C73.0913 20.8242 72.4679 20.8242 72.0004 20.8242C71.5329 20.8242 71.6887 19.918 71.5329 19.6914C71.4082 19.5101 70.9614 19.0117 70.7537 18.7851C70.39 18.4831 69.6316 17.8336 69.5069 17.6523C69.3511 17.4258 68.1043 16.7461 67.7926 16.5195C67.5433 16.3383 66.7537 16.1419 66.39 16.0664L65.6108 14.0273L63.2731 12.8945L62.6498 13.1211L61.7147 12.8945C61.5069 12.3659 61.0602 11.2633 60.9355 11.082C60.7796 10.8555 59.6887 10.1758 59.377 9.9492L58.442 9.26952L57.0394 8.1367L56.416 7.45702L55.7926 6.55077H53.6108L52.9874 7.45702C52.7796 7.3815 52.364 7.18514 52.364 7.00389C52.364 6.82264 51.7407 6.62629 51.429 6.55077L50.6498 7.45702L50.0264 8.58983H49.5589C49.2472 8.21222 48.6238 7.4117 48.6238 7.23045C48.6238 7.00391 48.0005 6.09782 47.8446 5.87115L47.8446 5.87108C47.7199 5.68983 47.0653 5.04035 46.7537 4.73827C46.1303 4.1341 44.8835 2.88045 44.8835 2.6992C44.8835 2.51795 44.1563 1.56639 43.7926 1.11327H42.7017L41.455 0.433578L40.6757 1.11327L40.0524 2.47264H39.429L38.8056 2.92577L37.8705 4.5117L36.4679 5.64452L36.1563 5.87108L35.8446 6.77733L35.2212 7.68358C35.1173 7.91014 34.9095 8.31795 34.9095 8.1367C34.9095 7.95545 34.2861 7.60806 33.9744 7.45702L33.3511 6.77733L32.5718 5.87108L30.2342 6.3242L29.6108 6.77733L27.5848 7.91014L27.2731 8.81639L25.5589 9.04295L24.0004 9.9492L22.442 12.4414L21.5069 12.2148L21.0394 12.4414L20.416 13.1211L19.6368 14.0273L19.0134 14.9336L17.2991 15.8398L16.364 16.7461L15.429 17.6523H14.8056L14.3381 18.332L12.7796 19.918L11.8446 20.5976L10.7537 21.0508L9.66274 21.957L8.26015 22.1836L7.94846 23.543H7.32508L6.85755 24.4492L5.76664 25.1289H4.83157L4.05235 26.2617L2.33807 26.9414C2.18222 27.0169 1.83937 27.3039 1.71469 27.8476Z"
          fill="url(#fillGrad3)"
          fillOpacity="0.6"
          stroke="url(#strokeGrad3)"
          strokeWidth="0.716"
        />
      </Svg>
    </View>
  );
}

// ─── 템플릿 3 ─────────────────────────────────────────────────────────────────
// Stats 중앙 배치 (y≈72), 2열 × 3행, 그라디언트 상단 어둡게, 로고 우하단

export function Template3Overlay({ distance, calories, elevation, weather, duration, date, scale = 1 }: OverlayProps) {
  const s = scale;
  // Figma 기준 절대 좌표 (카드 x=8195.5, y=-250.5 기준)
  const col1x = s * 25;   // x=8220.5-8195.5
  const col2x = s * 77;   // x=8272.5-8195.5
  const row1y = s * 72;   // y=-178.5-(-250.5)
  const row2y = s * 106;  // y=-144.5-(-250.5)
  const row3y = s * 140;  // y=-110.5-(-250.5)

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <OverlayBackground />
      <MountainFrame3 scale={s} />

      {/* 행 1: DISTANCE | DURATION */}
      <View style={{ position: "absolute", top: row1y, left: col1x }}>
        <StatItem label="DISTANCE" value={distance} unit="km" scale={s} />
      </View>
      <View style={{ position: "absolute", top: row1y, left: col2x }}>
        <StatItem label="DURATION" value={duration} scale={s} />
      </View>

      {/* 행 2: ELEVATION | CALORIES */}
      <View style={{ position: "absolute", top: row2y, left: col1x }}>
        <StatItem label="ELEVATION" value={elevation} unit="m" scale={s} />
      </View>
      <View style={{ position: "absolute", top: row2y, left: col2x }}>
        <StatItem label="CALORIES" value={calories} unit="kcal" scale={s} />
      </View>

      {/* 행 3: WEATHER | DATE */}
      <View style={{ position: "absolute", top: row3y, left: col1x }}>
        <StatItem label="WEATHER (°C)" value={weather} scale={s} />
      </View>
      <View style={{ position: "absolute", top: row3y, left: col2x }}>
        <StatItem label="DATE" value={date} scale={s} />
      </View>

      {/* 세모산 로고 — 우하단 (x=159, y=402) */}
      <View style={{ position: "absolute", top: s * 402, left: s * 159, opacity: 0.9 }}>
        <SemosanLogoSvg width={s * 65} height={s * 8} />
      </View>
    </View>
  );
}

export const OVERLAY_COMPONENTS = [Template1Overlay, Template2Overlay, Template3Overlay];
