import { Path, Svg } from 'react-native-svg';

type Props = { size?: number; color?: string };

export function LinkSimpleIcon({ size = 20, color = '#1A1B1F' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M5.8 2.8H12.4C14.75 2.8 16.2 4.25 16.2 6.6V13.2C16.2 15.55 14.75 17 12.4 17H5.8C3.45 17 2 15.55 2 13.2V6.6C2 4.25 3.45 2.8 5.8 2.8Z"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.4 17V13.6C11.4 12.5 12 11.9 13.1 11.9H16.2"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
