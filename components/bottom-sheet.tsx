import { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import BottomSheetShell from './bottom-sheet-shell';
import CourseBottomSheet from './course-bottom-sheet';
import { InfoIcon } from './icons/info-icon';
import { TrendingCardList } from './trending-card';

export type Tab = '내 기록' | '지금 뜨는' | '큐레이션';

type MountainCard = {
  id: string;
  name: string;
  trailNumber: number;
  daysAgo: number;
  badgeCount: number;
  imageUri?: string;
};

type Props = {
  cards?: MountainCard[];
  title?: string;
  titleCount?: number;
  activeTab?: Tab;
  onTabChange?: (tab: Tab) => void;
  onCardSelect?: (id: string) => void;
};

const TABS: Tab[] = ['내 기록', '지금 뜨는', '큐레이션'];

const MOCK_CARDS: MountainCard[] = [
  { id: '1', name: '산 이름', trailNumber: 1, daysAgo: 1, badgeCount: 1 },
  { id: '2', name: '산 이름', trailNumber: 1, daysAgo: 1, badgeCount: 1 },
  { id: '3', name: '산 이름', trailNumber: 1, daysAgo: 1, badgeCount: 1 },
  { id: '4', name: '산 이름', trailNumber: 1, daysAgo: 1, badgeCount: 1 },
];

export default function BottomSheet({
  cards = MOCK_CARDS,
  title = '타이틀',
  titleCount = 1,
  activeTab: activeTabProp,
  onTabChange,
  onCardSelect,
}: Props) {
  const [internalTab, setInternalTab] = useState<Tab>('내 기록');
  const activeTab = activeTabProp ?? internalTab;
  const setActiveTab = (tab: Tab) => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };
  const [selectedCard, setSelectedCard] = useState<MountainCard | null>(null);

  if (selectedCard) {
    return (
      <BottomSheetShell
        title={selectedCard.name}
        titleCount={selectedCard.badgeCount}
      >
        <CourseBottomSheet />
      </BottomSheetShell>
    );
  }

  // 탭별 타이틀 설정
  const tabTitle =
    activeTab === '내 기록' ? title :
    activeTab === '지금 뜨는' ? '지금 뜨는 산' :
    '큐레이션';
  const tabTitleCount = activeTab === '내 기록' ? titleCount : undefined;
  const tabTitleSuffix = activeTab === '지금 뜨는' || activeTab === '큐레이션'
    ? <InfoIcon size={16.25} />
    : undefined;

  return (
    <BottomSheetShell
      title={tabTitle}
      titleCount={tabTitleCount}
      titleSuffix={tabTitleSuffix}
      header={
        <View className="flex-row items-center bg-fill-stronger rounded-[10px] p-1 gap-1 mx-4 mb-4">
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              className={`flex-1 items-center py-2 rounded-[10px] ${
                activeTab === tab ? 'bg-fill-normal' : ''
              }`}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                className={`typo-label-medium ${
                  activeTab === tab ? 'text-label-normal' : 'text-label-subtler'
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      }
    >
      {activeTab === '내 기록' && (
        /* 카드 그리드 */
        <View className="w-full gap-y-4">
          {Array.from({ length: Math.ceil(cards.length / 2) }).map((_, rowIdx) => (
            <View key={rowIdx} className="flex-row gap-x-[9px]">
              {cards.slice(rowIdx * 2, rowIdx * 2 + 2).map((card) => (
                <MountainCard key={card.id} card={card} onPress={() => { setSelectedCard(card); onCardSelect?.(card.id); }} />
              ))}
            </View>
          ))}
        </View>
      )}

      {activeTab === '지금 뜨는' && (
        <TrendingCardList />
      )}

      {activeTab === '큐레이션' && (
        <View />
      )}
    </BottomSheetShell>
  );
}

function MountainCard({ card, onPress }: { card: MountainCard; onPress: () => void }) {
  return (
    <TouchableOpacity className="flex-1 gap-1" onPress={onPress}>
      {/* 이미지 */}
      <View className="self-stretch h-[88px] rounded-[10px] overflow-hidden flex-col items-end p-2 gap-2.5">
        {card.imageUri ? (
          <Image
            source={{ uri: card.imageUri }}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="absolute inset-0 bg-fill-stronger items-center justify-center">
          </View>
        )}
        {/* 뱃지 */}
        <View className="w-6 h-6 rounded-full bg-label-normal items-center justify-center z-10">
          <Text className="typo-body-3-semi-bold text-common-100 text-center">{card.badgeCount}</Text>
        </View>
      </View>

      {/* 텍스트 */}
      <Text className="typo-body-1-normal-semi-bold text-label-normal" numberOfLines={1}>
        {card.name}
      </Text>
      <Text className="typo-caption-1-medium text-label-subtler">
        {card.trailNumber}번 등산 · {card.daysAgo}일 전
      </Text>
    </TouchableOpacity>
  );
}
