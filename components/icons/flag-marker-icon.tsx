import { Path, Svg } from "react-native-svg";

type FlagMarkerIconProps = {
  width?: number;
  height?: number;
};

export function FlagMarkerIcon({ width = 20, height = 28 }: FlagMarkerIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 28" fill="none">
      <Path
        d="M5.45363 1.19922C5.78754 1.19922 6.10019 1.28848 6.37079 1.44299L6.37561 1.4454L16.5066 7.2947C17.3303 7.77029 17.3302 8.95981 16.5066 9.43553L7.30725 14.7466V24.0606C7.30717 25.0842 6.47731 25.9142 5.45363 25.9142C4.42995 25.9142 3.60009 25.0842 3.60001 24.0606V3.05284C3.60001 2.02911 4.4299 1.19922 5.45363 1.19922Z"
        fill="#4ADE80"
        stroke="#16A34A"
        strokeWidth={0.8}
      />
    </Svg>
  );
}
