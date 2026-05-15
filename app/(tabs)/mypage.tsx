import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MyScreen() {
  const { top } = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-fill-stronger"
      contentContainerStyle={{ padding: 24, paddingTop: top + 24 }}>
      <Text className="typo-headline-1-semi-bold text-label-normal">마이페이지</Text>
      <View style={{ marginTop: 16 }}>
        <Text className="typo-body-2-normal-regular text-label-subtler">준비 중입니다.</Text>
      </View>
    </ScrollView>
  );
}
