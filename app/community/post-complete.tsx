import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from '@/components/icons/chevron-left-icon';
import { XIcon } from '@/components/icons/x-icon';

export default function CommunityPostCompleteScreen() {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-fill-normal">
      <View style={{ paddingTop: top }} className="bg-fill-normal">
        <View className="h-14 flex-row items-center justify-between px-5">
          <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
            <ChevronLeftIcon size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
            <XIcon size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.titleWrap}>
        <Text style={styles.title}>게시 완료</Text>
        <Text style={styles.subtitle}>커뮤니티에 내 기록이 게시되었어요</Text>
      </View>

      <View style={styles.graphicWrap}>
        <View style={styles.graphicBox}>
          <Text style={styles.graphicLabel}>그래픽 영역</Text>
        </View>
      </View>

      <View style={[styles.bottomBar, { paddingBottom: Math.max(bottom, 20) }]}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.replace('/(tabs)/community')}
        >
          <Text style={styles.ctaText}>커뮤니티 보러가기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleWrap: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 20,
  },
  title: {
    fontFamily: 'Pretendard',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28.8,
    letterSpacing: -0.6,
    color: '#1A1B1F',
  },
  subtitle: {
    fontFamily: 'Pretendard',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 27,
    letterSpacing: -0.27,
    color: '#464A57',
  },
  graphicWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 296,
  },
  graphicBox: {
    width: 287,
    height: 296,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  graphicLabel: {
    fontFamily: 'Pretendard',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28.8,
    letterSpacing: -0.6,
    color: '#898989',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  ctaButton: {
    height: 56,
    borderRadius: 12,
    backgroundColor: '#1A1B1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontFamily: 'Pretendard',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 25.5,
    letterSpacing: -0.255,
    color: '#FFFFFF',
  },
});
