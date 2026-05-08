import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image as ExpoImage } from 'expo-image';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Clive3Svg from '@/assets/clive3.svg';
import { ChevronLeftIcon } from '@/components/icons/chevron-left-icon';
import { MountainIcon } from '@/components/icons/mountain-icon';

export default function CommunityWriteScreen() {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const { name } = useLocalSearchParams<{ name?: string }>();
  const [content, setContent] = useState('');

  return (
    <View className="flex-1 bg-fill-normal">
      <View style={{ paddingTop: top }} className="bg-fill-normal">
        <View className="h-14 flex-row items-center justify-between px-5">
          <View className="flex-1 items-start">
            <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
              <ChevronLeftIcon size={24} />
            </TouchableOpacity>
          </View>
          <Text className="flex-1 text-center typo-headline-1-semi-bold text-label-normal">
            커뮤니티에 공유
          </Text>
          <View className="flex-1" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-2">
          <View style={styles.summaryCard}>
            <Text className="typo-body-2-normal-semi-bold text-label-normal">
              2026년 4월 27일
            </Text>

            <View className="mt-1 flex-row items-center gap-1">
              <View style={styles.badgeNeutral}>
                <Text style={styles.badgeNeutralText}>{name ?? '관악산'}</Text>
              </View>
              <View style={styles.badgeGreen}>
                <Text style={styles.badgeGreenText}>초급</Text>
              </View>
              <Text className="typo-body-2-reading-regular text-label-normal">둘레길 코스</Text>
            </View>

            <View className="mt-3 flex-row items-end gap-1">
              <View style={styles.thumbnail}>
                {typeof Clive3Svg === 'number' ? (
                  <ExpoImage source={Clive3Svg} style={styles.thumbnailImage} contentFit="cover" />
                ) : (
                  <Clive3Svg width="100%" height="100%" />
                )}
              </View>

              <View className="flex-1">
                <View className="flex-row items-end gap-1 px-2">
                  <Text style={styles.kmNumber}>6.34</Text>
                  <Text style={styles.kmUnit}>km</Text>
                </View>

                <View className="mt-1 flex-row px-2">
                  <Metric label="소요시간" value="2시간 16분" />
                  <Metric label="고도" value="15Nm" />
                  <Metric label="칼로리" value="360kcal" />
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View className="px-5 pt-4">
          <TextInput
            value={content}
            onChangeText={setContent}
            multiline
            placeholder="내용 추가..."
            placeholderTextColor="#73798C"
            style={styles.input}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: Math.max(bottom, 20) }]}>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => router.push('/community/post-complete')}
        >
          <Text style={styles.doneButtonText}>완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1">
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    padding: 12,
  },
  badgeNeutral: {
    borderRadius: 4,
    backgroundColor: '#F0F2F4',
    paddingHorizontal: 4,
  },
  badgeNeutralText: {
    fontFamily: 'Pretendard',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: '#464A57',
  },
  badgeGreen: {
    borderRadius: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 4,
  },
  badgeGreenText: {
    fontFamily: 'Pretendard',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: '#16A34A',
  },
  thumbnail: {
    width: 104,
    height: 73,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  kmNumber: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 40,
    color: '#1A1B1F',
    lineHeight: 42,
  },
  kmUnit: {
    fontFamily: 'Pretendard',
    fontSize: 22,
    fontWeight: '500',
    color: '#464A57',
    lineHeight: 30,
  },
  metricLabel: {
    fontFamily: 'Pretendard',
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 15,
    color: '#73798C',
  },
  metricValue: {
    fontFamily: 'Pretendard',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    color: '#1A1B1F',
  },
  divider: {
    height: 6,
    backgroundColor: '#F9FAFB',
    marginTop: 16,
  },
  input: {
    minHeight: 220,
    fontFamily: 'Pretendard',
    fontSize: 14,
    lineHeight: 21,
    color: '#1A1B1F',
    padding: 0,
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
  doneButton: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1B1F',
  },
  doneButtonText: {
    fontFamily: 'Pretendard',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 25.5,
    color: '#FFFFFF',
  },
});
