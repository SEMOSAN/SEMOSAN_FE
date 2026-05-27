import { Path, Svg } from 'react-native-svg';

type Props = { size?: number; color?: string };

export function LockIcon({ size = 24, color = '#1A1B1F' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 10V7.5C7 4.74 9.24 2.5 12 2.5C14.76 2.5 17 4.74 17 7.5V10"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Path
        d="M6 10.5H18C19.1046 10.5 20 11.3954 20 12.5V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V12.5C4 11.3954 4.89543 10.5 6 10.5Z"
        stroke={color}
        strokeWidth={1.8}
      />
      <Path
        d="M12 14V17"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}
