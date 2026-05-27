import { Line, Path, Svg } from "react-native-svg";

type Props = { size?: number; color?: string };

export function ArrowDownToLineIcon({ size = 24, color = "#1A1B1F" }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3L12 17"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M6 11L12 17L18 11"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line
        x1="5"
        y1="21"
        x2="19"
        y2="21"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}
