import { Path, Rect, Svg } from 'react-native-svg';

type Props = { size?: number; color?: string };

export function ImagePlaceholderIcon({ size = 20, color = '#D1D5DB' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Rect x="2.25" y="2.25" width="15.5" height="15.5" rx="3" stroke={color} strokeWidth="1.5" />
      <Path
        d="M6 13.8L8.3 11.3C8.65 10.92 9.25 10.92 9.6 11.3L10.25 12L11.95 10.2C12.3 9.83 12.9 9.83 13.25 10.2L14.8 11.9"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Rect x="6.1" y="6.1" width="2.2" height="2.2" rx="1.1" fill={color} />
    </Svg>
  );
}
