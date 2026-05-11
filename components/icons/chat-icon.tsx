import React from "react";
import Svg, { Path } from "react-native-svg";

export function ChatIcon({
  size = 14,
  color = "#73798c",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path
        d="M12.25 6.708a5.292 5.292 0 0 1-.572 2.394A5.375 5.375 0 0 1 6.875 12a5.292 5.292 0 0 1-2.394-.572L1.75 12.25l.822-2.731A5.292 5.292 0 0 1 2 6.708 5.375 5.375 0 0 1 4.898 1.91 5.292 5.292 0 0 1 7.292 1.34H7.5a5.358 5.358 0 0 1 4.75 4.75v.618z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
