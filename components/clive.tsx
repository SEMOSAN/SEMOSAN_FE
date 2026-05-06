import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

export type ClivePhoto = {
  id: string;
  distance: string;
  isTop?: boolean;
};

type Props = {
  photos: ClivePhoto[];
  hasReachedSummit?: boolean;
};

const CLIVE_HEIGHT = 596;
const CARD_OVERLAP = 24;
const CARD_WIDTH = 329;
const BAR_WIDTH = 6;

function cardHeight(n: number): number {
  return Math.round((CLIVE_HEIGHT + (n - 1) * CARD_OVERLAP) / n);
}

export function Clive({ photos, hasReachedSummit }: Props) {
  const reachedSummit = hasReachedSummit ?? photos.some((p) => p.isTop);
  const n = photos.length;
  const h = cardHeight(n);
  const fadeHeight = Math.max(Math.round(h * 0.1), 16);

  return (
    <View style={styles.container}>
      {/* 좌측 진행 바 */}
      <View style={styles.barContainer}>
        <LinearGradient
          colors={
            reachedSummit
              ? ['#507EF4', '#4ADE80', '#FFD40D', '#FF5249']
              : ['#507EF4', '#4ADE80', '#FFD40D']
          }
          locations={reachedSummit ? [0, 0.33, 0.66, 1] : [0, 0.5, 1]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.bar}
        />
      </View>

      {/* 이미지 카드 스택 */}
      <View style={styles.cardsContainer}>
        {photos.map((photo, index) => {
          const isStart = index === photos.length - 1;
          const isTopOrStart = index === 0 || isStart;
          const overlayBottom = isTopOrStart ? 76 : 96;

          return (
            <View
              key={photo.id}
              style={[
                styles.card,
                { height: h },
                index > 0 && { marginTop: -CARD_OVERLAP },
              ]}
            >
              {/* 배경 이미지 (현재 회색 플레이스홀더) */}
              <View style={styles.imagePlaceholder} />

              {/* 하단 페이드 (시작 카드 제외) */}
              {!isStart && (
                <LinearGradient
                  colors={['transparent', 'rgba(217,217,217,1)']}
                  style={[styles.cardFade, { height: fadeHeight }]}
                />
              )}

              {/* 오버레이: 정상 칩 + 거리 */}
              <View style={[styles.overlay, { bottom: overlayBottom }]}>
                {photo.isTop && (
                  <View style={styles.topChip}>
                    <Text style={styles.topChipText}>정상</Text>
                  </View>
                )}
                <Text style={styles.distance}>{photo.distance}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 335,
    height: CLIVE_HEIGHT,
    alignSelf: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  barContainer: {
    width: BAR_WIDTH,
    height: CLIVE_HEIGHT,
  },
  bar: {
    width: BAR_WIDTH,
    height: CLIVE_HEIGHT,
  },
  cardsContainer: {
    width: CARD_WIDTH,
    height: CLIVE_HEIGHT,
    overflow: 'hidden',
  },
  card: {
    width: CARD_WIDTH,
    position: 'relative',
    overflow: 'hidden',
  },
  imagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#D9D9D9',
  },
  cardFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    left: 24,
    right: 24,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
  },
  topChip: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  topChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  distance: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 13,
  },
});
