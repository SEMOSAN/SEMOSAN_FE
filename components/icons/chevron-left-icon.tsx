import { Path, Svg } from 'react-native-svg';

type Props = { size?: number; color?: string };

export function ChevronLeftIcon({ size = 24, color = '#1A1B1F' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15.5 19L8.5 12L15.5 5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
