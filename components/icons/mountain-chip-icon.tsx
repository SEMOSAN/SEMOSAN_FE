import { Path, Rect, Svg } from "react-native-svg";

type Props = { size?: number };

export function MountainChipIcon({ size = 18 }: Props): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Rect width="18" height="18" rx="9" fill="#5C6170" />
      <Path
        d="M11.4998 7.33073L14.1813 11.0723C14.4235 11.4103 14.1819 11.8806 13.7661 11.8806H4.10123C3.71306 11.8806 3.46677 11.4647 3.65337 11.1243L6.81586 5.35554C7.04748 4.93304 7.65358 4.9307 7.88845 5.3514L9.4749 8.19306C9.50826 8.25282 9.58979 8.26351 9.63743 8.21437L10.5616 7.26112C10.8277 6.98673 11.2772 7.02008 11.4998 7.33073Z"
        fill="#D1D5DB"
      />
    </Svg>
  );
}
