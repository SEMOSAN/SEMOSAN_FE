import { colors } from "@/constants/colors";
import Svg, { Path } from "react-native-svg";

type Props = { size?: number; color?: string };

const PEAKS_PATH =
  "M11.4033 4.18262C13.3444 4.18288 14.9693 6.73716 15.4023 10.1729C15.975 8.77308 16.8675 7.87324 17.8701 7.87305C19.5984 7.87305 20.9999 10.5465 21 13.8447C21 17.1431 19.5984 19.8174 17.8701 19.8174C16.5347 19.8171 15.3955 18.2202 14.9463 15.9727C14.2302 18.2735 12.9121 19.8172 11.4033 19.8174C9.98673 19.8174 8.73723 18.4571 7.99707 16.3867C7.68904 18.3684 6.71107 19.8174 5.5498 19.8174C4.14158 19.8173 3 17.6865 3 15.0586C3.00012 12.4309 4.14165 10.3009 5.5498 10.3008C6.22589 10.3008 6.83759 10.7934 7.29395 11.5947C7.40492 7.46569 9.20242 4.18262 11.4033 4.18262Z";

/** 봉우리 세 개 산 아이콘 — 트래킹 산 이름 칩용 */
export function MountainPeaksIcon({
  size = 24,
  color = colors.secondary.normal,
}: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d={PEAKS_PATH} fill={color} />
      <Path d={PEAKS_PATH} fill="black" fillOpacity={0.1} />
    </Svg>
  );
}
