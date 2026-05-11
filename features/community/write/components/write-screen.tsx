import { useRouter } from "expo-router";
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
import { useWriteForm } from "../hooks/use-write-form";
import { ImageUploadButton } from "./image-upload-button";
import { WriteHeader } from "./write-header";

export function WriteScreen() {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const { title, setTitle, body, setBody, isSubmittable } = useWriteForm();

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
            className="border-b border-line-subtle py-4 text-label-normal typo-body-1-normal-semi-bold"
            style={{ lineHeight: undefined }}
          />
          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder="글을 작성해주세요."
            placeholderTextColor="#73798c"
            multiline
            textAlignVertical="top"
            className="min-h-[200px] py-4 text-label-normal typo-body-2-reading-regular"
          />
        </View>

        <View className="h-[6px] bg-fill-strong" />

        <View className="px-5 py-4">
          <ImageUploadButton />
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 bg-fill-normal px-5 pt-4"
        style={{ paddingBottom: Math.max(bottom, 20) }}
      >
        <Pressable
          disabled={!isSubmittable}
          onPress={() => router.back()}
          className={`h-14 items-center justify-center rounded-xl ${
            isSubmittable ? "bg-primary-normal" : "bg-fill-disabled"
          }`}
        >
          <Text
            className={`typo-label-large ${
              isSubmittable ? "text-common-100" : "text-label-disabled"
            }`}
          >
            완료
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
