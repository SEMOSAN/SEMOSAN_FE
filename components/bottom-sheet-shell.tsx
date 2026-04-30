import { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';

type Props = {
  title: string;
  titleCount?: number;
  titleSuffix?: ReactNode;
  header?: ReactNode;
  children: ReactNode;
};

export default function BottomSheetShell({ title, titleCount, titleSuffix, header, children }: Props) {
  return (
    <View className="flex-1 w-full">
      {/* 드래그 핸들 */}
      <View className="items-center pt-3 pb-2">
        <View className="w-10 h-1 rounded-full bg-fill-neutral" />
      </View>

      {/* 탭바 등 헤더 슬롯 */}
      {header && <View className="w-full">{header}</View>}

      <ScrollView
        className="flex-1 w-full"
        contentContainerClassName="w-full px-4 pt-3 flex-grow"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full flex-col gap-2.5">
          {/* 섹션 타이틀 */}
          <View className="flex-row items-center gap-1">
            <Text className="typo-headline-1-semi-bold text-label-normal">{title}</Text>
            {titleCount !== undefined && (
              <Text className="typo-headline-1-semi-bold text-secondary-normal">{titleCount}</Text>
            )}
            {titleSuffix}
          </View>

          {children}
        </View>
      </ScrollView>
    </View>
  );
}
