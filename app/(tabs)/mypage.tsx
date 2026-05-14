import { ScrollView, Text, View } from 'react-native';

export default function MyScreen() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#1A1B1F' }}
      contentContainerStyle={{ padding: 24, paddingTop: 80 }}>
      <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>마이페이지</Text>
      <View style={{ marginTop: 16 }}>
        <Text style={{ color: '#ffffff80', fontSize: 14 }}>준비 중입니다.</Text>
      </View>
    </ScrollView>
  );
}
