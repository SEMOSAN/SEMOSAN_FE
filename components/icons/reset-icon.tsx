import Svg, { Path } from "react-native-svg";

export function ResetIcon(): React.JSX.Element {
  return (
    <Svg width={14} height={14} viewBox="0 0 16 16" fill="none">
      <Path
        d="M2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C5.92286 2 4.07719 3.05771 3 4.66667"
        stroke="#1A1B1F"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M3 2V5H6"
        stroke="#1A1B1F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
