import { colors } from "@/constants/colors";
import Svg, { Circle, Rect } from "react-native-svg";

type Props = { size?: number; color?: string };

/** 원 + 사선 아이콘 — "코스 선택 안 함" 카드용 */
export function CircleSlashIcon({
  size = 24,
  color = colors.line.subtle,
}: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10.5} stroke={color} strokeWidth={3} />
      <Rect
        x={3}
        y={5.12134}
        width={3}
        height={22.5}
        transform="rotate(-45 3 5.12134)"
        fill={color}
      />
    </Svg>
  );
}
