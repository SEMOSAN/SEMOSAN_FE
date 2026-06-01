import { useMyMountainRecords } from "@/features/home/hooks/use-my-mountain-records";
import { useClivePhotos } from "@/features/tracking/hooks/use-clive-photos";
import { GetUserHikingMountainRecordResponse } from "@/types/api.generated";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import BottomSheetShell from "./bottom-sheet-shell";
import CourseBottomSheet from "./course-bottom-sheet";
import { HikingStatsCard } from "./hiking-stats-card";
import { InfoIcon } from "./icons/info-icon";

export type Tab = "내 기록" | "큐레이션";

type Props = {
  cards?: GetUserHikingMountainRecordResponse[];
  title?: string;
  titleCount?: number;
  activeTab?: Tab;
  onTabChange?: (tab: Tab) => void;
  onCardSelect?: (id: number) => void;
  showTabs?: boolean;
  scrollEnabled?: boolean;
  onDetailOpenChange?: (isOpen: boolean) => void;
  closeSelectedToken?: number;
};

const TABS: Tab[] = ["내 기록", "큐레이션"];

export default function BottomSheet({
  cards,
  title = "타이틀",
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
  const [internalTab, setInternalTab] = useState<Tab>("내 기록");
  const activeTab = activeTabProp ?? internalTab;
  const setActiveTab = (tab: Tab) => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };
  const [selectedCard, setSelectedCard] =
    useState<GetUserHikingMountainRecordResponse | null>(null);

  useEffect(() => {
    onDetailOpenChange?.(selectedCard !== null);
  }, [onDetailOpenChange, selectedCard]);

  useEffect(() => {
    if (closeSelectedToken !== undefined) {
      setSelectedCard(null);
    }
  }, [closeSelectedToken]);

  const {
    data: mountainRecords,
    isPending,
    isError,
  } = useMyMountainRecords(selectedCard?.mountainId);

  if (isPending) return null;
  if (isError) return null;
  if (!cards) return null;

  if (selectedCard) {
    return (
      <BottomSheetShell
        title={selectedCard.mountainName}
        titleCount={selectedCard.hikingCount}
      >
        <View className="pt-2.5">
          <CourseBottomSheet
            courses={mountainRecords}
            onCoursePress={(courseId) => {
              const record = mountainRecords.find(
                (r) => r.hikingRecordId === courseId,
              );
              router.push({
                pathname: "/record/[id]",
                params: {
                  id: String(record?.sessionId ?? courseId),
                  hikingRecordId: String(record?.hikingRecordId ?? ""),
                  name: selectedCard.mountainName,
                  courseName: record?.courseName ?? "",
                  imageUri: "",
                  distance: String(record?.distance ?? ""),
                  duration: String(record?.duration ?? ""),
                },
              });
            }}
          />
        </View>
      </BottomSheetShell>
    );
  }

  const tabTitle = showTabs && activeTab === "큐레이션" ? "큐레이션" : title;
  const tabTitleCount =
    showTabs && activeTab === "큐레이션" ? undefined : titleCount;
  const tabTitleSuffix =
    showTabs && activeTab === "큐레이션" ? (
      <InfoIcon size={16.25} />
    ) : undefined;

  return (
    <BottomSheetShell
      title={tabTitle}
      titleCount={tabTitleCount}
      titleSuffix={tabTitleSuffix}
      scrollEnabled={scrollEnabled}
      aboveTitle={activeTab === "내 기록" ? <HikingStatsCard /> : undefined}
      header={
        showTabs ? (
          <View className="mx-4 mb-4 flex-row items-center gap-1 rounded-[10px] bg-fill-stronger p-1">
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                className={`flex-1 items-center rounded-[10px] py-2 ${
                  activeTab === tab ? "bg-fill-normal" : ""
                }`}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  className={`typo-label-medium ${
                    activeTab === tab
                      ? "text-label-normal"
                      : "text-label-subtler"
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : undefined
      }
    >
      {activeTab === "내 기록" && (
        <View className="w-full gap-y-4">
          {Array.from({ length: Math.ceil(cards.length / 2) }).map(
            (_, rowIdx) => {
              const rowCards = cards.slice(rowIdx * 2, rowIdx * 2 + 2);
              return (
                <View key={rowIdx} className="flex-row gap-x-[9px]">
                  {rowCards.map((card) => (
                    <MountainCard
                      key={card.mountainId}
                      card={card}
                      onPress={() => {
                        onCardSelect?.(card.mountainId ?? 0);
                        setSelectedCard(card);
                      }}
                    />
                  ))}
                  {rowCards.length === 1 && <View className="flex-1" />}
                </View>
              );
            },
          )}
        </View>
      )}

      {activeTab === "큐레이션" && <View />}
    </BottomSheetShell>
  );
}

function MountainCardThumbnail({ mountainId }: { mountainId?: number }) {
  const { data: records = [] } = useMyMountainRecords(mountainId);
  const sorted = [...records].sort(
    (a, b) =>
      new Date(b.hikedAt ?? 0).getTime() - new Date(a.hikedAt ?? 0).getTime(),
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
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          resizeMode="cover"
        />
      ) : null}
      {mainPhoto ? (
        <Image
          source={{ uri: mainPhoto }}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          resizeMode="cover"
        />
      ) : (
        <View className="absolute inset-0 items-center justify-center bg-fill-stronger" />
      )}
    </>
  );
}

function MountainCard({
  card,
  onPress,
}: {
  card: GetUserHikingMountainRecordResponse;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity className="flex-1 gap-1" onPress={onPress}>
      {/* 이미지 */}
      <View className="h-[88px] flex-col items-end gap-2.5 self-stretch overflow-hidden rounded-[10px] p-2">
        <MountainCardThumbnail mountainId={card.mountainId} />
        {/* 뱃지 */}
        <View className="z-10 h-7 w-7 items-center justify-center rounded-full bg-label-normal">
          <Text className="text-center text-common-100 typo-body-3-semi-bold">
            {card.hikingCount}
          </Text>
        </View>
      </View>

      {/* 텍스트 */}
      <View className="gap-0.5 px-1">
        <Text
          className="text-label-normal typo-body-1-normal-semi-bold"
          numberOfLines={1}
        >
          {card.mountainName}
        </Text>
        <Text className="text-label-subtler typo-caption-1-medium">
          {card.hikingCount}번 등산 · {card.lastHikedAt}일 전
        </Text>
      </View>
    </TouchableOpacity>
  );
}
