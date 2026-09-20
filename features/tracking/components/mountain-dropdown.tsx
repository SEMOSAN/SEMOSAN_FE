import { CheckIcon } from "@/components/icons/check-icon";
import { DropdownCaretIcon } from "@/components/icons/dropdown-caret-icon";
import { MountainPeaksIcon } from "@/components/icons/mountain-peaks-icon";
import { useState } from "react";
import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { SHADOW } from "../constants";

export type MountainOption = { mountainId: number; name: string };

type Props = {
  /** 현재 선택된 산 */
  selected?: MountainOption;
  /** 선택 가능한 산 목록(선택된 산 포함). 비어 있으면 칩만 보이고 열리지 않는다 */
  options: MountainOption[];
  onSelect: (mountainId: number) => void;
  style?: ViewStyle;
};

/** 우상단 산 선택 드롭다운 — 칩을 누르면 아래로 목록이 펼쳐진다 */
export function MountainDropdown({
  selected,
  options,
  onSelect,
  style,
}: Props) {
  const [open, setOpen] = useState(false);
  if (!selected) return null;
  const canOpen = options.length > 1;

  return (
    <>
      {/* 바깥 탭으로 닫기 */}
      {open && (
        <Pressable
          className="absolute bottom-0 left-0 right-0 top-0"
          onPress={() => setOpen(false)}
        />
      )}

      <View className="absolute right-4 items-end" style={style}>
        <TouchableOpacity
          className="flex-row items-center gap-1.5 rounded-full bg-fill-normal py-2 pl-3 pr-3"
          style={SHADOW}
          activeOpacity={canOpen ? 0.8 : 1}
          onPress={() => canOpen && setOpen((v) => !v)}
        >
          <MountainPeaksIcon size={20} />
          <Text className="typo-label-normal text-label-normal">
            {selected.name}
          </Text>
          {canOpen && <DropdownCaretIcon />}
        </TouchableOpacity>

        {open && (
          <View
            className="mt-2 min-w-[120px] overflow-hidden rounded-xl bg-fill-normal"
            style={SHADOW}
          >
            {options.map((option, index) => {
              const isSelected = option.mountainId === selected.mountainId;
              return (
                <TouchableOpacity
                  key={option.mountainId}
                  className={`flex-row items-center justify-between gap-4 px-4 py-3 ${
                    index > 0 ? "border-t border-line-subtle" : ""
                  }`}
                  onPress={() => {
                    setOpen(false);
                    if (!isSelected) onSelect(option.mountainId);
                  }}
                >
                  <Text className="typo-label-normal text-label-normal">
                    {option.name}
                  </Text>
                  {isSelected && <CheckIcon size={16} />}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </>
  );
}
