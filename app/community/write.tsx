import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image as ExpoImage } from 'expo-image';
import {
  ScrollView,
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
          <View className="rounded-xl border border-line-subtle bg-fill-normal p-3">
            <Text className="typo-body-2-normal-semi-bold text-label-normal">
              2026년 4월 27일
            </Text>

            <View className="mt-1 flex-row items-center gap-1">
              <View className="rounded bg-fill-stronger px-1">
                <Text className="typo-body-2-normal-medium text-label-subtle">{name ?? '관악산'}</Text>
              </View>
              <View className="rounded bg-green-50 px-1">
                <Text className="typo-body-2-normal-medium text-secondary-strong">초급</Text>
              </View>
              <Text className="typo-body-2-reading-regular text-label-normal">둘레길 코스</Text>
            </View>

            <View className="mt-3 flex-row items-end gap-1">
              <View className="w-[104px] h-[73px] rounded-lg border border-line-normal overflow-hidden">
                {typeof Clive3Svg === 'number' ? (
                  <ExpoImage source={Clive3Svg} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                ) : (
                  <Clive3Svg width="100%" height="100%" />
                )}
              </View>

              <View className="flex-1">
                <View className="flex-row items-end gap-1 px-2">
                  <Text style={{ fontFamily: 'Lexend_700Bold', fontSize: 40, color: '#1A1B1F', lineHeight: 42 }}>6.34</Text>
                  <Text style={{ fontFamily: 'Pretendard', fontSize: 22, fontWeight: '500', color: '#464A57', lineHeight: 30 }}>km</Text>
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

        <View className="h-[6px] bg-fill-strong mt-4" />

        <View className="px-5 pt-4">
          <TextInput
            value={content}
            onChangeText={setContent}
            multiline
            placeholder="내용 추가..."
            placeholderTextColor="#73798C"
            className="min-h-[220px] typo-body-2-normal-regular text-label-normal p-0"
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      <View
        className="absolute left-0 right-0 bottom-0 bg-fill-normal pt-4 px-5"
        style={{ paddingBottom: Math.max(bottom, 20) }}
      >
        <TouchableOpacity
          className="h-14 rounded-xl items-center justify-center bg-primary-normal"
          onPress={() => router.push('/community/post-complete')}
        >
          <Text className="typo-label-large text-common-100">완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1">
      <Text style={{ fontFamily: 'Pretendard', fontSize: 10, fontWeight: '400', lineHeight: 15, color: '#73798C' }}>{label}</Text>
      <Text style={{ fontFamily: 'Pretendard', fontSize: 12, fontWeight: '500', lineHeight: 16, color: '#1A1B1F' }}>{value}</Text>
    </View>
  );
}
