import { ModalSheet } from "@/components/modal-sheet";
import { FreePostReportRequest } from "@/types/api.generated";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Reason = NonNullable<FreePostReportRequest["reason"]>;

const REASONS: { label: string; value: Reason }[] = [
  { label: "스팸", value: "SPAM" },
  { label: "욕설/혐오", value: "ABUSE" },
  { label: "음란/부적절", value: "OBSCENE" },
  { label: "허위정보", value: "FALSE_INFO" },
  { label: "기타", value: "ETC" },
];

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (reason: Reason) => void;
};

export function ReportReasonSheet({ visible, onDismiss, onSubmit }: Props) {
  const [selected, setSelected] = useState<Reason | null>(null);

  useEffect(() => {
    if (!visible) setSelected(null);
  }, [visible]);

  return (
    <ModalSheet visible={visible} onDismiss={onDismiss}>
      <View className="gap-6 px-5 pt-4">
        <View className="gap-2">
          <Text className="text-label-normal typo-heading-1-semi-bold">
            신고 사유를 선택해주세요
          </Text>
          <Text className="text-label-subtle typo-body-2-normal-regular">
            신고된 게시글은 커뮤니티 가이드라인에 따라 모니터링 및 조치될
            예정이에요.
          </Text>
        </View>

        <View className="gap-2">
          {REASONS.map(({ label, value }) => {
            const isSelected = selected === value;
            return (
              <TouchableOpacity
                key={value}
                className={`rounded-xl border p-4 ${
                  isSelected
                    ? "border-line-primary bg-interaction-subtle"
                    : "border-line-subtle bg-fill-normal"
                }`}
                activeOpacity={0.7}
                onPress={() => setSelected(value)}
              >
                <Text
                  className={`typo-body-1-normal-medium ${
                    isSelected ? "text-label-normal" : "text-label-subtle"
                  }`}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View className="flex-row gap-2 px-5 pb-6 pt-8">
        <TouchableOpacity
          className="h-12 flex-1 items-center justify-center rounded-[10px] bg-fill-stronger"
          activeOpacity={0.8}
          onPress={onDismiss}
        >
          <Text className="text-label-subtle typo-label-large">취소</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`h-12 flex-1 items-center justify-center rounded-[10px] ${
            selected ? "bg-status-negative-normal" : "bg-fill-disabled"
          }`}
          activeOpacity={0.8}
          disabled={!selected}
          onPress={() => selected && onSubmit(selected)}
        >
          <Text
            className={`typo-label-large ${
              selected ? "text-label-normal-inverse" : "text-label-disabled"
            }`}
          >
            신고하기
          </Text>
        </TouchableOpacity>
      </View>
    </ModalSheet>
  );
}
