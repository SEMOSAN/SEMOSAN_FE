import Svg, { Path } from "react-native-svg";

export function CaretDownIcon({
  color = "#1A1B1F",
}: {
  color?: string;
}): React.JSX.Element {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path
        d="M4 6L8 10L12 6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
