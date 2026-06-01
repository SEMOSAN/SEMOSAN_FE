import { ReactNode } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Text, View } from 'react-native';

type Props = {
  title: string;
  titleCount?: number;
  titleSuffix?: ReactNode;
  header?: ReactNode;
  aboveTitle?: ReactNode;
  children: ReactNode;
  scrollEnabled?: boolean;
};

export default function BottomSheetShell({ title, titleCount, titleSuffix, header, aboveTitle, children, scrollEnabled = false }: Props) {
  return (
    <View className="flex-1 w-full">
      {/* 탭바 등 헤더 슬롯 */}
      {header && <View className="w-full">{header}</View>}

      <ScrollView
        className="flex-1 w-full"
        contentContainerClassName="w-full px-4 pt-3 flex-grow"
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
      >
        <View className="w-full flex-col gap-2.5">
          {/* 타이틀 위 슬롯 */}
          {aboveTitle}

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
