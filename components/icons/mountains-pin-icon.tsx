import { Path, Rect, Svg } from 'react-native-svg';

type Props = { size?: number; circleColor?: string };

export function MountainsPinIcon({ size = 18, circleColor = '#A4ABC0' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Rect width="18" height="18" rx="9" fill={circleColor} />
      <Path
        d="M11.4998 7.33092L14.1813 11.0725C14.4235 11.4105 14.1819 11.8808 13.7661 11.8808H4.10123C3.71306 11.8808 3.46677 11.4649 3.65337 11.1245L6.81586 5.35572C7.04748 4.93322 7.65358 4.93089 7.88845 5.35159L9.4749 8.19324C9.50826 8.253 9.58979 8.26369 9.63743 8.21455L10.5616 7.26131C10.8277 6.98691 11.2772 7.02026 11.4998 7.33092Z"
        fill="#F0F2F4"
      />
    </Svg>
  );
}
