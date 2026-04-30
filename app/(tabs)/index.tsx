import BottomSheet from '@/components/bottom-sheet';
import { View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 w-full bg-fill-stronger">
      {/* 지도 자리 */}
      <View className="flex-1" />

      {/* 바텀시트 */}
      <View className="w-full h-[302px] rounded-tl-3xl rounded-tr-3xl bg-fill-normal">
        <BottomSheet title="다녀온 산" titleCount={4} />
      </View>
    </View>
  );
}
