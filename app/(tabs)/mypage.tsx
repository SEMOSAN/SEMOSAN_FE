import { ScrollView, Text, View } from 'react-native';

export default function MyScreen() {
  return (
    <ScrollView
      className="flex-1 bg-fill-stronger"
      contentContainerStyle={{ padding: 24, paddingTop: 80 }}>
      <Text className="typo-headline-1-semi-bold text-label-normal">마이페이지</Text>
      <View style={{ marginTop: 16 }}>
        <Text className="typo-body-2-normal-regular text-label-subtler">준비 중입니다.</Text>
      </View>
    </ScrollView>
  );
}
