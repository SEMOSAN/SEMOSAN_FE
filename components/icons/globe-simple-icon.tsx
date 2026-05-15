import Svg, { Circle, Path } from 'react-native-svg';

type GlobeSimpleIconProps = {
  size?: number;
  color?: string;
};

export function GlobeSimpleIcon({ size = 24, color = '#FFFFFF' }: GlobeSimpleIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.8} />
      <Path d="M3.5 12H20.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path
        d="M12 3.2C14.2 5.4 15.5 8.6 15.5 12C15.5 15.4 14.2 18.6 12 20.8"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Path
        d="M12 3.2C9.8 5.4 8.5 8.6 8.5 12C8.5 15.4 9.8 18.6 12 20.8"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}
