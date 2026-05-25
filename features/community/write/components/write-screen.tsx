import { IOSKeyboardAccessoryToolbar } from "@/components/ios-keyboard-accessory-toolbar";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCreatePost } from "../hooks/use-create-post";
import { useWriteForm } from "../hooks/use-write-form";
import { ImageUploadButton } from "./image-upload-button";
import { WriteHeader } from "./write-header";

const TITLE_TOOLBAR_ID = "write-title-toolbar";
const BODY_TOOLBAR_ID = "write-body-toolbar";

export function WriteScreen() {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const { title, setTitle, body, setBody, isSubmittable } = useWriteForm();
  const { mutateAsync: createPost, isPending } = useCreatePost();
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  async function handleSubmit(): Promise<void> {
    await createPost({
      title: title.trim(),
      content: body.trim(),
      imageUrls,
      mainImageIndex: imageUrls.length > 0 ? 0 : undefined,
    });
    router.back();
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-fill-normal"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={{ paddingTop: top }}>
        <WriteHeader />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-5">
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="제목"
            placeholderTextColor="#73798c"
            autoCorrect={false}
            spellCheck={false}
            inputAccessoryViewID={TITLE_TOOLBAR_ID}
            className="border-b border-line-subtle py-4 text-label-normal typo-body-1-normal-semi-bold"
            style={{ lineHeight: undefined }}
          />
          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder="글을 작성해주세요."
            placeholderTextColor="#73798c"
            autoCorrect={false}
            spellCheck={false}
            inputAccessoryViewID={BODY_TOOLBAR_ID}
            multiline
            textAlignVertical="top"
            className="min-h-[200px] py-4 text-label-normal typo-body-2-reading-regular"
          />
        </View>

        <View className="h-[6px] bg-fill-strong" />

        <View className="px-5 py-4">
          <ImageUploadButton value={imageUrls} onChange={setImageUrls} />
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 bg-fill-normal px-5 pt-4"
        style={{ paddingBottom: Math.max(bottom, 20) }}
      >
        <Pressable
          disabled={!isSubmittable || isPending}
          onPress={handleSubmit}
          className={`h-14 items-center justify-center rounded-xl ${
            isSubmittable && !isPending ? "bg-primary-normal" : "bg-fill-disabled"
          }`}
        >
          <Text
            className={`typo-label-large ${
              isSubmittable && !isPending ? "text-common-100" : "text-label-disabled"
            }`}
          >
            완료
          </Text>
        </Pressable>
      </View>

      {Platform.OS === "ios" && (
        <IOSKeyboardAccessoryToolbar nativeID={TITLE_TOOLBAR_ID} />
      )}
      {Platform.OS === "ios" && (
        <IOSKeyboardAccessoryToolbar nativeID={BODY_TOOLBAR_ID} />
      )}
    </KeyboardAvoidingView>
  );
}
