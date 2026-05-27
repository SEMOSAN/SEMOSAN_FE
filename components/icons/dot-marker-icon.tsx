import { Circle, Svg } from "react-native-svg";

type DotMarkerIconProps = {
  fill?: string;
  stroke?: string;
  width?: number;
  height?: number;
};

export function DotMarkerIcon({
  fill = "#FF5249",
  stroke = "#DC2626",
  width = 10,
  height = 10,
}: DotMarkerIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 10 10" fill="none">
      <Circle cx={5} cy={5} r={4.5} fill={fill} stroke={stroke} />
    </Svg>
  );
}
