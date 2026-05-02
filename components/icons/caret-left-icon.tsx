import React from "react";
import Svg, { Path } from "react-native-svg";

export function CaretLeftIcon({
  color = "#1A1B1F",
}: {
  color?: string;
}): React.JSX.Element {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
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
