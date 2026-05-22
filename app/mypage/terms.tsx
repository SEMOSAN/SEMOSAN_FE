import { ChevronLeftIcon } from '@/components/icons/chevron-left-icon';
import { MenuRow } from '@/features/mypage/components/menu-row';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TERMS_ITEMS = [
  {
    label: '위치 기반 서비스 이용약관',
    onPress: () => WebBrowser.openBrowserAsync('https://ringed-hosta-dcb.notion.site/semosan-person-legacy'),
  },
  {
    label: '개인정보 처리방침',
    onPress: () => WebBrowser.openBrowserAsync('https://ringed-hosta-dcb.notion.site/semosan-legacy'),
  },
  {
    label: '커뮤니티 이용약관',
    onPress: () => WebBrowser.openBrowserAsync('https://ringed-hosta-dcb.notion.site/semosan-legacy-community'),
  },
];

export default function TermsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-fill-normal">
      {/* 헤더 */}
      <View
        className="flex-row items-center bg-fill-normal"
        style={{ height: 56, paddingHorizontal: 20, gap: 8, marginTop: insets.top }}
      >
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.6}>
          <ChevronLeftIcon size={24} color="#1a1b1f" />
        </TouchableOpacity>
        <Text className="typo-headline-1-semi-bold text-label-normal">이용약관</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="bg-fill-normal">
          {TERMS_ITEMS.map((item) => (
            <MenuRow key={item.label} label={item.label} onPress={item.onPress} />
          ))}
        </View>
        <View style={{ height: insets.bottom + 16 }} />
      </ScrollView>
    </View>
  );
}
