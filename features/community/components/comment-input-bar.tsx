import { PaperPlaneIcon } from "@/components/icons/paper-plane-icon";
import React, { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function CommentInputBar() {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");

  return (
    <View
      className="border-t border-line-subtle bg-fill-normal px-4 pt-4"
      style={{ paddingBottom: insets.bottom + 16 }}
    >
      <View className="flex-row items-end gap-2 rounded-[24px] bg-fill-strong py-2 pl-4 pr-[10px]">
        <TextInput
          className="flex-1 py-[3px] typo-body-1-reading-regular text-label-normal"
          placeholder="댓글을 입력하세요"
          placeholderTextColor="#8b92a6"
          multiline
          value={text}
          onChangeText={setText}
        />
        {text.length > 0 && (
          <Pressable className="size-8 rounded-full bg-primary-normal items-center justify-center">
            <PaperPlaneIcon />
          </Pressable>
        )}
      </View>
    </View>
  );
}
