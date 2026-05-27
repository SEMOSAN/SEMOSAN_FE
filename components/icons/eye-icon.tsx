import React from "react";
import Svg, { Path } from "react-native-svg";

export function EyeIcon({
  size = 14,
  color = "#73798c",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path
        d="M1 7s2.25-4 6-4 6 4 6 4-2.25 4-6 4-6-4-6-4z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
