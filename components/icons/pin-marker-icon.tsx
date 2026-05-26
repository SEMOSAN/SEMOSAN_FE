import { Path, Svg } from 'react-native-svg';
import { Text, View } from 'react-native';

type Props = {
  fill: string;
  stroke: string;
  label?: string;
  width?: number;
  height?: number;
};

export function PinMarkerIcon({ fill, stroke, label, width = 34, height = 45 }: Props) {
  return (
    <View collapsable={false} style={{ width, height }}>
      <Svg width={width} height={height} viewBox="0 0 34 45" fill="none">
        <Path
          d="M3.21403 25.6233L14.9955 43.2955C15.7872 44.483 17.5321 44.483 18.3237 43.2955L30.1052 25.6233C34.0087 19.768 33.6742 12.0598 29.2781 6.56476C22.809 -1.52159 10.5102 -1.52159 4.04111 6.56476C-0.354955 12.0598 -0.689467 19.768 3.21403 25.6233Z"
          fill={fill}
          stroke={stroke}
        />
      </Svg>
      {label && (
        <Text
          className="typo-caption-1-semi-bold text-common-100"
          style={{
            position: 'absolute',
            width,
            // 핀의 원형 바디 영역(상단 ~30px) 중앙
            top: 0,
            height: 30,
            textAlign: 'center',
            textAlignVertical: 'center',
            lineHeight: 30,
          }}
        >
          {label}
        </Text>
      )}
    </View>
  );
}
