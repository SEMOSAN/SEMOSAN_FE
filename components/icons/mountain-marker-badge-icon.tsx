import { Path, Rect, Svg } from "react-native-svg";

type Props = { size?: number };

// Figma: Map Marker/Icon/Weather&Nature/Mountains — 산 이름 옆에 붙는 초록 배지
export function MountainMarkerBadgeIcon({ size = 20 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Rect width="20" height="20" rx="10" fill="#00D864" />
      <Path
        d="M12.7774 8.14514L15.7568 12.3025C16.0259 12.678 15.7575 13.2006 15.2956 13.2006H4.5567C4.12542 13.2006 3.85178 12.7385 4.0591 12.3603L7.57303 5.95046C7.83037 5.48104 8.50378 5.47844 8.76474 5.94586L10.5275 9.10332C10.5646 9.16971 10.6551 9.18159 10.7081 9.127L11.735 8.0678C12.0306 7.76293 12.5301 7.79999 12.7774 8.14514Z"
        fill="#DCFCE7"
      />
    </Svg>
  );
}
