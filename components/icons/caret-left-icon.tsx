import React from "react";
import Svg, { Path } from "react-native-svg";

export function CaretLeftIcon({
  size = 24,
  color = "#1A1B1F",
}: {
  size?: number;
  color?: string;
}): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 18L9 12L15 6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
