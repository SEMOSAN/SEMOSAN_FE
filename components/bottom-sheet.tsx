import { useMyMountainRecords } from '@/features/home/hooks/use-my-mountain-records';
import { useClivePhotos } from '@/features/tracking/hooks/use-clive-photos';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import BottomSheetShell from './bottom-sheet-shell';
import CourseBottomSheet, { type Course } from './course-bottom-sheet';
import { HikingStatsCard } from './hiking-stats-card';
import { InfoIcon } from './icons/info-icon';

export type Tab = '내 기록' | '큐레이션';

type MountainCard = {
  id: string;
  mountainId: number;
  name: string;
  trailNumber: number;
  daysAgo: number;
  badgeCount: number;
};

type Props = {
  cards?: MountainCard[];
  title?: string;
  titleCount?: number;
  activeTab?: Tab;
  onTabChange?: (tab: Tab) => void;
  onCardSelect?: (id: string) => void;
  showTabs?: boolean;
  scrollEnabled?: boolean;
  onDetailOpenChange?: (isOpen: boolean) => void;
  closeSelectedToken?: number;
};

const TABS: Tab[] = ['내 기록', '큐레이션'];

const MOCK_CARDS: MountainCard[] = [
  { id: '1', mountainId: 1, name: '산 이름', trailNumber: 1, daysAgo: 1, badgeCount: 1 },
  { id: '2', mountainId: 2, name: '산 이름', trailNumber: 1, daysAgo: 1, badgeCount: 1 },
  { id: '3', mountainId: 3, name: '산 이름', trailNumber: 1, daysAgo: 1, badgeCount: 1 },
  { id: '4', mountainId: 4, name: '산 이름', trailNumber: 1, daysAgo: 1, badgeCount: 1 },
];

export default function BottomSheet({
  cards = MOCK_CARDS,
  title = '타이틀',
  titleCount = 1,
  activeTab: activeTabProp,
  onTabChange,
  onCardSelect,
  showTabs = true,
  scrollEnabled = false,
  onDetailOpenChange,
  closeSelectedToken,
}: Props) {
  const router = useRouter();
  const [internalTab, setInternalTab] = useState<Tab>('내 기록');
  const activeTab = activeTabProp ?? internalTab;
  const setActiveTab = (tab: Tab) => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };
  const [selectedCard, setSelectedCard] = useState<MountainCard | null>(null);

  useEffect(() => {
    onDetailOpenChange?.(selectedCard !== null);
  }, [onDetailOpenChange, selectedCard]);

  useEffect(() => {
    if (closeSelectedToken !== undefined) {
      setSelectedCard(null);
    }
  }, [closeSelectedToken]);

  const { data: mountainRecords = [] } = useMyMountainRecords(
    selectedCard ? Number(selectedCard.id) : null
  );

  const selectedCardCourses: Course[] = mountainRecords.map((record) => ({
    id: String(record.hikingRecordId),
    name: record.courseName ?? '',
    distanceKm: record.distance ?? 0,
    durationHours: record.duration ?? 0,
    date: formatHikedAt(record.hikedAt),
    imageUris: record.imageUrls ?? [],
  }));

  if (selectedCard) {
    return (
      <BottomSheetShell
        title={selectedCard.name}
        titleCount={selectedCard.badgeCount}
      >
        <View className="pt-2.5">
          <CourseBottomSheet
            courses={selectedCardCourses}
            onCoursePress={(courseId) => {
              const record = mountainRecords.find(
                (r) => String(r.hikingRecordId) === courseId
              );
              router.push({
                pathname: '/record/[id]',
                params: {
                  id: String(record?.sessionId ?? courseId),
                  hikingRecordId: String(record?.hikingRecordId ?? ''),
                  name: selectedCard.name,
                  courseName: record?.courseName ?? '',
                  imageUri: '',
                  distance: String(record?.distance ?? ''),
                  duration: String(record?.duration ?? ''),
                },
              });
            }}
          />
        </View>
      </BottomSheetShell>
    );
  }

  const tabTitle = showTabs && activeTab === '큐레이션' ? '큐레이션' : title;
  const tabTitleCount = showTabs && activeTab === '큐레이션' ? undefined : titleCount;
  const tabTitleSuffix = showTabs && activeTab === '큐레이션' ? <InfoIcon size={16.25} /> : undefined;

  return (
    <BottomSheetShell
      title={tabTitle}
      titleCount={tabTitleCount}
      titleSuffix={tabTitleSuffix}
      scrollEnabled={scrollEnabled}
      aboveTitle={activeTab === '내 기록' ? <HikingStatsCard /> : undefined}
      header={showTabs ? (
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
      ) : undefined}
    >
      {activeTab === '내 기록' && (
        <View className="w-full gap-y-4">
          {Array.from({ length: Math.ceil(cards.length / 2) }).map((_, rowIdx) => {
            const rowCards = cards.slice(rowIdx * 2, rowIdx * 2 + 2);
            return (
              <View key={rowIdx} className="flex-row gap-x-[9px]">
                {rowCards.map((card) => (
                  <MountainCard key={card.id} card={card} onPress={() => {
                    onCardSelect?.(card.id);
                    setSelectedCard(card);
                  }} />
                ))}
                {rowCards.length === 1 && <View className="flex-1" />}
              </View>
            );
          })}
        </View>
      )}

      {activeTab === '큐레이션' && (
        <View />
      )}
    </BottomSheetShell>
  );
}

function MountainCardThumbnail({ mountainId }: { mountainId: number }) {
  const { data: records = [] } = useMyMountainRecords(mountainId);
  const sorted = [...records].sort((a, b) =>
    new Date(b.hikedAt ?? 0).getTime() - new Date(a.hikedAt ?? 0).getTime()
  );
  const latestSessionId = sorted[0]?.sessionId ?? null;
  const { data: photos = [] } = useClivePhotos(latestSessionId);

  const mainPhoto = photos[photos.length - 1];
  const bgPhoto = photos[photos.length - 2];

  return (
    <>
      {bgPhoto ? (
        <Image
          source={{ uri: bgPhoto }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          resizeMode="cover"
        />
      ) : null}
      {mainPhoto ? (
        <Image
          source={{ uri: mainPhoto }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          resizeMode="cover"
        />
      ) : (
        <View className="absolute inset-0 bg-fill-stronger items-center justify-center" />
      )}
    </>
  );
}

function MountainCard({ card, onPress }: { card: MountainCard; onPress: () => void }) {
  return (
    <TouchableOpacity className="flex-1 gap-1" onPress={onPress}>
      {/* 이미지 */}
      <View className="self-stretch h-[88px] rounded-[10px] overflow-hidden flex-col items-end p-2 gap-2.5">
        <MountainCardThumbnail mountainId={card.mountainId} />
        {/* 뱃지 */}
        <View className="w-7 h-7 rounded-full bg-label-normal items-center justify-center z-10">
          <Text className="typo-body-3-semi-bold text-common-100 text-center">{card.badgeCount}</Text>
        </View>
      </View>

      {/* 텍스트 */}
      <View className="gap-0.5 px-1">
        <Text className="typo-body-1-normal-semi-bold text-label-normal" numberOfLines={1}>
          {card.name}
        </Text>
        <Text className="typo-caption-1-medium text-label-subtler">
          {card.trailNumber}번 등산 · {card.daysAgo}일 전
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function formatHikedAt(dateStr?: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const yy = String(d.getFullYear()).slice(2);
  const mm = d.getMonth() + 1;
  const dd = d.getDate();
  return `${yy}년 ${mm}월 ${dd}일`;
}
