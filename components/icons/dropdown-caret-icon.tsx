import { colors } from "@/constants/colors";
import Svg, { Path } from "react-native-svg";

type Props = { width?: number; color?: string };

/** 아래로 향한 작은 삼각형 — 드롭다운 칩용. 원본 비율 8:6 */
export function DropdownCaretIcon({
  width = 8,
  color = colors.label.subtle,
}: Props) {
  return (
    <Svg width={width} height={(width * 6) / 8} viewBox="0 0 8 6" fill="none">
      <Path
        d="M6.63215 0H0.500665C0.101317 0 -0.136879 0.445072 0.0846393 0.77735L3.15038 5.37596C3.34829 5.67283 3.78452 5.67283 3.98243 5.37596L7.04817 0.77735C7.26969 0.445073 7.0315 0 6.63215 0Z"
        fill={color}
      />
    </Svg>
  );
}
