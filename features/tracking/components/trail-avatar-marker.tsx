import { Image, ImageSourcePropType, View } from 'react-native';
import { Path, Svg } from 'react-native-svg';

/** 마커 SVG 크기 (Figma) */
const MARKER_WIDTH = 39;
const MARKER_HEIGHT = 32;
/** 마커 배경 색상 */
const MARKER_BG = '#2F323A';

/** 아바타 크기 (Figma: 24x24) */
const AVATAR_SIZE = 24;
/** 버블 내 아바타 중심: x≈25, y≈16 (버블 영역 중앙) */
const AVATAR_LEFT = (MARKER_WIDTH - AVATAR_SIZE) / 2 + 3;
const AVATAR_TOP = (MARKER_HEIGHT - AVATAR_SIZE) / 2;

type Props = {
  /** 마커 세로 중심 Y 좌표 (map 영역 기준) */
  centerY: number;
  /** 마커 왼쪽 시작 X 좌표 (그라데이션 바 오른쪽 끝에 맞춤) */
  left: number;
  /** 사용자 프로필 이미지 소스 (원격 URL 또는 로컬 require) */
  imageSource?: ImageSourcePropType;
};

export function TrailAvatarMarker({ centerY, left, imageSource }: Props) {
  return (
    <View
      style={{
        position: 'absolute',
        left,
        top: centerY - MARKER_HEIGHT / 2,
      }}
    >
      {/* 마커 말풍선 배경 (꼬리가 왼쪽을 가리킴) */}
      <Svg width={MARKER_WIDTH} height={MARKER_HEIGHT} viewBox="0 0 39 32" fill="none">
        <Path
          d="M11.3137 4.68629C17.5621 -1.5621 27.6927 -1.5621 33.9411 4.68629C40.1895 10.9347 40.1895 21.0653 33.9411 27.3137C27.6927 33.5621 17.5621 33.5621 11.3137 27.3137L0 16L11.3137 4.68629Z"
          fill={MARKER_BG}
        />
      </Svg>

      {/* 아바타: 버블 중앙에 절대 위치 */}
      <View
        style={{
          position: 'absolute',
          left: AVATAR_LEFT,
          top: AVATAR_TOP,
          width: AVATAR_SIZE,
          height: AVATAR_SIZE,
          borderRadius: 999,
          overflow: 'hidden',
          backgroundColor: '#73798C',
        }}
      >
        {imageSource ? (
          <Image
            source={imageSource}
            style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
            resizeMode="cover"
          />
        ) : (
          /* 프로필 미설정 시 회색 플레이스홀더 */
          <View style={{ flex: 1, backgroundColor: '#73798C' }} />
        )}
      </View>
    </View>
  );
}
