import { CloseIcon } from "@/components/icons/close-icon";
import { FaceHappyIcon } from "@/components/icons/face-happy-icon";
import { FaceNeutralIcon } from "@/components/icons/face-neutral-icon";
import { FaceSadIcon } from "@/components/icons/face-sad-icon";
import { ENDPOINTS } from "@/types/api.generated";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Course, DIFFICULTY_BG, DIFFICULTY_TEXT_COLOR } from "../constants";

type DifficultyOption = "similar" | "easier" | "harder";

type Props = {
  visible: boolean;
  course: Course;
  mountainId?: number;
  mountainName: string;
  onClose: () => void;
  onComplete: (option: DifficultyOption | null) => void;
};

const OPTIONS: {
  key: DifficultyOption;
  label: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
}[] = [
  { key: "similar", label: "비슷해요", Icon: FaceNeutralIcon },
  { key: "easier", label: "생각보다 쉬워요", Icon: FaceHappyIcon },
  { key: "harder", label: "더 어려워요", Icon: FaceSadIcon },
];

export function DifficultyRatingModal({
  visible,
  course,
  mountainId,
  mountainName,
  onClose,
  onComplete,
}: Props) {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<DifficultyOption | null>(null);
  const insets = useSafeAreaInsets();

  const handleComplete = () => {
    queryClient.invalidateQueries({ queryKey: [ENDPOINTS.MOUNTAINS_MAP] });
    if (mountainId)
      queryClient.invalidateQueries({
        queryKey: [
          ENDPOINTS.HIKING_RECORDS_ME_MOUNTAINS_BY_MOUNTAINID(mountainId),
        ],
      });
    onComplete(selected);
    setSelected(null);
  };

  const handleClose = () => {
    setSelected(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View style={{ flex: 1, paddingTop: insets.top }}>
        {/* 닫기 버튼 */}
        <View
          style={{ alignItems: "flex-end", paddingRight: 24, paddingTop: 12 }}
        >
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={handleClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <CloseIcon size={24} color="#464A57" />
          </TouchableOpacity>
        </View>

        {/* 타이틀 — 닫기 버튼과 40px 간격 */}
        <View
          className="mt-10"
          style={{
            paddingHorizontal: 66,
            marginBottom: 12,
            alignItems: "center",
          }}
        >
          <Text
            className="text-label-normal typo-heading-1-semi-bold"
            style={{ textAlign: "center" }}
          >
            안내 난이도랑 비교해 어땠나요?
          </Text>
        </View>

        {/* 코스 정보 */}
        <View
          style={{
            paddingHorizontal: 66,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <View
            className={`rounded px-1 py-0.5 ${DIFFICULTY_BG[course.difficulty]}`}
          >
            <Text
              className={`typo-caption-1-medium ${DIFFICULTY_TEXT_COLOR[course.difficulty]}`}
            >
              {course.difficulty}
            </Text>
          </View>
          <Text className="text-label-normal typo-body-1-normal-semi-bold">
            {mountainName}
          </Text>
          <Text
            className="text-label-subtle typo-body-1-normal-regular"
            numberOfLines={1}
          >
            {course.name}
          </Text>
        </View>

        {/* 선택지 버튼들 — 코스 정보와 80px 간격 */}
        <View
          className="mt-20"
          style={{ paddingHorizontal: 46, gap: 20, alignItems: "center" }}
        >
          {OPTIONS.map(({ key, label, Icon }) => {
            const isSelected = selected === key;
            return (
              <TouchableOpacity
                key={key}
                className={`flex-row items-center justify-center gap-2 rounded-[10px] bg-fill-normal px-5 ${
                  isSelected ? "border-label-normal" : "border-line-normal"
                }`}
                style={{
                  minHeight: 48,
                  maxHeight: 48,
                  paddingVertical: 11,
                  borderWidth: isSelected ? 1.5 : 1,
                }}
                activeOpacity={0.7}
                onPress={() => setSelected(key)}
              >
                <Icon size={20} color={isSelected ? "#1a1b1f" : "#464A57"} />
                <Text
                  className={`typo-body-1-normal-semi-bold ${
                    isSelected ? "text-label-normal" : "text-label-subtle"
                  }`}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 버튼 아래 스페이서 */}
        <View style={{ flex: 1 }} />

        {/* 완료 버튼 */}
        <View
          style={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 35 }}
        >
          <TouchableOpacity
            className="items-center justify-center rounded-[10px] bg-label-normal"
            style={{ height: 52 }}
            onPress={handleComplete}
          >
            <Text className="text-common-100 typo-label-large">완료</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
