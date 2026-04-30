import { CheckIcon } from "@/components/icons/check-icon";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Path, Svg } from "react-native-svg";

function XIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
      <Path
        d="M11 3L3 11M3 3L11 11"
        stroke="#8b92a6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const REGIONS = [
  "서울",
  "경기",
  "인천",
  "강원",
  "대전",
  "세종",
  "충남",
  "충북",
  "부산",
  "울산",
  "경남",
  "경북",
  "대구",
  "광주",
  "전남",
  "전북",
  "제주",
];

const DISTRICTS: Record<string, string[]> = {
  서울: [
    "서울 전체",
    "강남구",
    "강동구",
    "강북구",
    "강서구",
    "관악구",
    "광진구",
    "구로구",
    "금천구",
    "노원구",
    "도봉구",
    "동대문구",
    "동작구",
    "마포구",
    "서대문구",
    "서초구",
    "성동구",
    "성북구",
    "송파구",
    "양천구",
    "영등포구",
    "용산구",
    "은평구",
    "종로구",
    "중구",
    "중랑구",
  ],
  경기: [
    "경기 전체",
    "수원시",
    "성남시",
    "고양시",
    "용인시",
    "부천시",
    "안산시",
    "안양시",
    "남양주시",
    "화성시",
    "과천시",
  ],
  인천: [
    "인천 전체",
    "중구",
    "동구",
    "미추홀구",
    "연수구",
    "남동구",
    "부평구",
    "계양구",
    "서구",
    "강화군",
    "옹진군",
  ],
  강원: [
    "강원 전체",
    "춘천시",
    "원주시",
    "강릉시",
    "동해시",
    "태백시",
    "속초시",
    "삼척시",
  ],
  대전: ["대전 전체", "동구", "중구", "서구", "유성구", "대덕구"],
  세종: ["세종 전체"],
  충남: [
    "충남 전체",
    "천안시",
    "공주시",
    "보령시",
    "아산시",
    "서산시",
    "논산시",
    "계룡시",
    "당진시",
  ],
  충북: [
    "충북 전체",
    "청주시",
    "충주시",
    "제천시",
    "보은군",
    "옥천군",
    "영동군",
  ],
  부산: [
    "부산 전체",
    "중구",
    "서구",
    "동구",
    "영도구",
    "부산진구",
    "동래구",
    "남구",
    "북구",
    "해운대구",
    "사하구",
    "금정구",
    "강서구",
    "연제구",
    "수영구",
    "사상구",
    "기장군",
  ],
  울산: ["울산 전체", "중구", "남구", "동구", "북구", "울주군"],
  경남: [
    "경남 전체",
    "창원시",
    "진주시",
    "통영시",
    "사천시",
    "김해시",
    "밀양시",
    "거제시",
    "양산시",
  ],
  경북: [
    "경북 전체",
    "포항시",
    "경주시",
    "김천시",
    "안동시",
    "구미시",
    "영주시",
    "영천시",
    "상주시",
    "문경시",
    "경산시",
  ],
  대구: [
    "대구 전체",
    "중구",
    "동구",
    "서구",
    "남구",
    "북구",
    "수성구",
    "달서구",
    "달성군",
  ],
  광주: ["광주 전체", "동구", "서구", "남구", "북구", "광산구"],
  전남: ["전남 전체", "목포시", "여수시", "순천시", "나주시", "광양시"],
  전북: [
    "전북 전체",
    "전주시",
    "군산시",
    "익산시",
    "정읍시",
    "남원시",
    "김제시",
  ],
  제주: ["제주 전체", "제주시", "서귀포시"],
};

type Selection = { region: string; district: string };

type Props = {
  onApply: (selections: Selection[]) => void;
};

function SearchIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
        stroke="#8b92a6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function RegionFilterContent({ onApply }: Props) {
  const [selectedRegion, setSelectedRegion] = useState("서울");
  const [selectedDistricts, setSelectedDistricts] = useState<Selection[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const districts = DISTRICTS[selectedRegion] ?? [];
  const listItems: Selection[] = searchQuery
    ? Object.entries(DISTRICTS).flatMap(([region, dists]) =>
        dists.filter((d) => d.includes(searchQuery)).map((d) => ({ region, district: d }))
      )
    : districts.map((d) => ({ region: selectedRegion, district: d }));

  const handleDistrictPress = (region: string, district: string) => {
    const current: Selection = { region, district };
    const isAll = district.endsWith("전체");

    setSelectedDistricts((prev) => {
      const alreadySelected = prev.some(
        (s) => s.region === region && s.district === district,
      );
      if (alreadySelected) {
        return prev.filter(
          (s) => !(s.region === region && s.district === district),
        );
      }
      if (isAll) {
        return [...prev.filter((s) => s.region !== region), current];
      }
      return [
        ...prev.filter(
          (s) => !(s.region === region && s.district.endsWith("전체")),
        ),
        current,
      ];
    });
  };

  const handleApply = () => {
    onApply(selectedDistricts);
  };

  return (
    <View className="flex-col" style={{ maxHeight: 440 }}>
      {/* 검색 */}
      <View className="px-5 pt-3">
        <View className="h-12 flex-row items-center gap-2 rounded-full bg-fill-strong px-4">
          <TextInput
            className="flex-1 text-label-normal typo-body-1-reading-regular"
            placeholder="지역명 검색"
            placeholderTextColor="#8b92a6"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <SearchIcon />
        </View>
      </View>

      {/* 시/도 탭 */}
      {!searchQuery && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="pb-2 pt-3"
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
        >
          {REGIONS.map((region) => {
            const isSelected = region === selectedRegion;
            return (
              <TouchableOpacity
                key={region}
                onPress={() => setSelectedRegion(region)}
                className={`rounded-full px-3 py-1.5 ${
                  isSelected ? "bg-primary-subtle" : "border border-line-subtle"
                }`}
              >
                <Text
                  className={`typo-body-2-normal-medium ${
                    isSelected ? "text-common-100" : "text-label-normal"
                  }`}
                >
                  {region}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* 구/군 목록 + 선택됨 플로팅 */}
      <View className="relative" style={{ height: 240 }}>
        <ScrollView
          className="pt-3"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            selectedDistricts.length > 0 ? { paddingBottom: 80 } : undefined
          }
        >
          {listItems.map((item) => {
            const isSelected = selectedDistricts.some(
              (s) => s.region === item.region && s.district === item.district,
            );
            return (
              <Pressable
                key={`${item.region}-${item.district}`}
                onPress={() => handleDistrictPress(item.region, item.district)}
                className="flex-row items-center px-5 py-3"
              >
                <View className="flex-1">
                  <Text
                    className={`typo-body-2-normal-medium ${
                      isSelected ? "text-label-normal" : "text-label-subtler"
                    }`}
                  >
                    {item.district}
                  </Text>
                  {searchQuery && (
                    <Text className="typo-body-3-medium text-label-subtler">
                      {item.region}
                    </Text>
                  )}
                </View>
                {isSelected && (
                  <View className="ml-[6px]">
                    <CheckIcon size={16} color="#00D864" />
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* 선택됨 */}
        {selectedDistricts.length > 0 && (
          <View
            className="absolute bottom-0 left-0 right-0 bg-fill-normal px-5 pb-3 pt-3"
            style={{
              zIndex: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -12 },
              shadowOpacity: 0.04,
              shadowRadius: 20,
            }}
          >
            <Text className="text-label-subtler typo-body-3-medium">
              선택됨
            </Text>
            <View className="flex-row flex-wrap gap-2 pt-3">
              {selectedDistricts.map((s) => (
                <View
                  key={`${s.region}-${s.district}`}
                  className="flex-row items-center gap-1 rounded-[4px] bg-fill-stronger px-[6px] py-[3px]"
                >
                  <Text className="text-label-subtle typo-body-3-medium">
                    {s.district}
                  </Text>
                  <Pressable
                    onPress={() =>
                      setSelectedDistricts((prev) =>
                        prev.filter(
                          (d) =>
                            !(
                              d.region === s.region && d.district === s.district
                            ),
                        ),
                      )
                    }
                  >
                    <XIcon />
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* 적용하기 버튼 */}
      <View className="px-5 pb-2 pt-4">
        <TouchableOpacity
          onPress={handleApply}
          className="h-12 items-center justify-center rounded-[10px] bg-primary-normal"
        >
          <Text className="text-common-100 typo-label-large">적용하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
