import React from "react";
import Svg, { Path } from "react-native-svg";

export function PaperPlaneIcon({
  size = 16,
  color = "#ffffff",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M13.8 2.2L7.2 8.8M13.8 2.2L9.4 13.8L7.2 8.8M13.8 2.2L2.2 6.6L7.2 8.8"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
