import { IOSKeyboardAccessoryToolbar } from "@/components/ios-keyboard-accessory-toolbar";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useFreePostDetail } from "@/features/community/hooks/use-free-post-detail";
import { toast } from "@/store/toast.store";
import { ENDPOINTS, FreePostDetailResponse } from "@/types/api.generated";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { useUpdatePost } from "../hooks/use-update-post";
import { useWriteForm } from "../hooks/use-write-form";
import { ImageUploadButton } from "./image-upload-button";
import { WriteHeader } from "./write-header";

const TITLE_TOOLBAR_ID = "write-title-toolbar";
const BODY_TOOLBAR_ID = "write-body-toolbar";

/** 상세 응답의 images[] → 폼용 imageUrls[] (정렬 + 대표 이미지 맨 앞) */
function toInitialImageUrls(post: FreePostDetailResponse): string[] {
  const sorted = [...(post.images ?? [])].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );
  const mainIdx = sorted.findIndex((img) => img.main);
  if (mainIdx > 0) {
    const [main] = sorted.splice(mainIdx, 1);
    sorted.unshift(main);
  }
  return sorted
    .map((img) => img.imageUrl)
    .filter((url): url is string => !!url);
}

export function WriteScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  // id가 유효한 양의 정수일 때만 수정 모드 — NaN/빈 값/비정상 id는 작성 모드로 처리
  const parsedId = id ? Number(id) : NaN;
  const postId =
    Number.isInteger(parsedId) && parsedId > 0 ? parsedId : undefined;

  if (postId != null) {
    return <EditLoader postId={postId} />;
  }
  return <WriteForm mode="create" />;
}

/** 수정 모드 — 게시글 상세를 불러와 폼에 프리필 */
function EditLoader({ postId }: { postId: number }) {
  const { data: post, isPending, isError } = useFreePostDetail(postId);

  if (isPending) return <LoadingSpinner fullScreen />;
  if (isError || !post) return null;

  return (
    <WriteForm
      mode="edit"
      postId={postId}
      initialTitle={post.title ?? ""}
      initialBody={post.content ?? ""}
      initialImageUrls={toInitialImageUrls(post)}
    />
  );
}

type WriteFormProps = {
  mode: "create" | "edit";
  postId?: number;
  initialTitle?: string;
  initialBody?: string;
  initialImageUrls?: string[];
};

function WriteForm({
  mode,
  postId,
  initialTitle = "",
  initialBody = "",
  initialImageUrls = [],
}: WriteFormProps) {
  const isEdit = mode === "edit";
  const queryClient = useQueryClient();
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const { title, setTitle, body, setBody, isSubmittable } = useWriteForm(
    initialTitle,
    initialBody,
  );
  const { mutateAsync: createPost, isPending: isCreating } = useCreatePost();
  const { mutateAsync: updatePost, isPending: isUpdating } = useUpdatePost(
    postId ?? 0,
  );
  const [imageUrls, setImageUrls] = useState<string[]>(initialImageUrls);
  const isPending = isCreating || isUpdating;

  async function handleSubmit(): Promise<void> {
    const payload = {
      title: title.trim(),
      content: body.trim(),
      imageUrls,
      mainImageIndex: imageUrls.length > 0 ? 0 : undefined,
    };

    if (isEdit) {
      await updatePost(payload);
      toast.show("게시글을 수정했어요.");
    } else {
      await createPost(payload);
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.COMMUNITY_FREE_POSTS],
      });
      toast.show("게시글을 업로드했어요.");
    }
    router.back();
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-fill-normal"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={{ paddingTop: top }}>
        <WriteHeader title={isEdit ? "게시글 수정하기" : "게시글 작성하기"} />
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

        <View className="px-5 pb-4">
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
            isSubmittable && !isPending
              ? "bg-primary-normal"
              : "bg-fill-disabled"
          }`}
        >
          <Text
            className={`typo-label-large ${
              isSubmittable && !isPending
                ? "text-common-100"
                : "text-label-disabled"
            }`}
          >
            {isEdit ? "저장하기" : "완료"}
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
