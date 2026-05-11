import { Circle, Svg } from 'react-native-svg';

type Props = { size?: number; color?: string };

export function DotsThreeIcon({ size = 24, color = '#1A1B1F' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="6" cy="12" r="1.8" fill={color} />
      <Circle cx="12" cy="12" r="1.8" fill={color} />
      <Circle cx="18" cy="12" r="1.8" fill={color} />
    </Svg>
  );
}
