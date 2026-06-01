import * as Sentry from "@sentry/react-native";
import { ChevronLeftIcon } from '@/components/icons/chevron-left-icon';
import { MenuChevronIcon } from '@/features/mypage/components/menu-chevron-icon';
import { MenuRow } from '@/features/mypage/components/menu-row';
import { BirthDateBottomSheet } from '@/features/mypage/components/birth-date-bottom-sheet';
import { ExerciseBottomSheet, type ExerciseData } from '@/features/mypage/components/exercise-bottom-sheet';
import { HeightBottomSheet } from '@/features/mypage/components/height-bottom-sheet';
import { WeightBottomSheet } from '@/features/mypage/components/weight-bottom-sheet';
import { GenderBottomSheet } from '@/features/mypage/components/gender-bottom-sheet';
import { NicknameBottomSheet } from '@/features/mypage/components/nickname-bottom-sheet';
import { ProfileAvatar } from '@/features/mypage/components/profile-avatar';
import { GENDER_LABEL, useProfile } from '@/features/mypage/hooks/use-profile';
import { useUpdateProfile } from '@/features/mypage/hooks/use-update-profile';
import { uploadImage } from "@/hooks/use-upload-image";
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Path, Svg } from 'react-native-svg';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 표시값 → API 값 변환
const GENDER_TO_API: Record<string, 'MALE' | 'FEMALE' | 'NONE'> = {
  '남성': 'MALE',
  '여성': 'FEMALE',
};

// 바텀시트 옵션 기준 매핑
const EXERCISE_TYPE_TO_API: Record<string, string> = {
  '걷기': 'WALKING',
  '등산': 'HIKING',
  '러닝': 'RUNNING',
  '헬스': 'GYM',
  '수영': 'SWIMMING',
  '홈트레이닝': 'HOME_TRAINING',
  '필라테스/요가': 'PILATES_YOGA',
  '스포츠 (배드민턴, 테니스, 축구 등)': 'SPORTS',
  '크로스핏': 'CROSSFIT',
  '운동 안 함': 'NONE',
};

const EXERCISE_TYPE_FROM_API: Record<string, string> = Object.fromEntries(
  Object.entries(EXERCISE_TYPE_TO_API).map(([display, api]) => [api, display])
);

export default function MyPageInfoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: profile } = useProfile();
  const { mutate: updateProfile } = useUpdateProfile();

  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [nicknameSheetVisible, setNicknameSheetVisible] = useState(false);
  const [nickname, setNickname] = useState('');
  const [genderSheetVisible, setGenderSheetVisible] = useState(false);
  const [gender, setGender] = useState('');
  const [birthDateSheetVisible, setBirthDateSheetVisible] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [heightSheetVisible, setHeightSheetVisible] = useState(false);
  const [height, setHeight] = useState('');
  const [weightSheetVisible, setWeightSheetVisible] = useState(false);
  const [weight, setWeight] = useState('');
  const [exerciseSheetVisible, setExerciseSheetVisible] = useState(false);
  const [exercise, setExercise] = useState<ExerciseData>({
    type: '',
    frequency: '',
    duration: '',
  });

  // 프로필 데이터로 초기화
  useEffect(() => {
    if (!profile) return;
    const url = profile.profileUrl;
    setProfileUrl(url?.startsWith('http') ? url : null);
    setNickname(profile.nickname ?? '');
    setGender(GENDER_LABEL[profile.gender ?? ''] ?? '');
    setBirthDate(profile.birthDate ?? '');
    setHeight(profile.height ? `${profile.height}cm` : '');
    setWeight(profile.weight ? `${profile.weight}kg` : '');
    setExercise((prev) => ({
      ...prev,
      type: EXERCISE_TYPE_FROM_API[profile.exerciseType ?? ''] ?? '',
    }));
  }, [profile]);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    const filename = asset.uri.split('/').pop() ?? 'photo.jpg';

    try {
      setImageUploading(true);
      const imageUrl = await uploadImage(asset.uri, filename);
      setProfileUrl(imageUrl);
      updateProfile({ profileUrl: imageUrl });
    } catch (e) {
      console.error('[Upload] 실패:', e);
      Sentry.captureException(new Error("ProfileImageUploadFailed"));
    } finally {
      setImageUploading(false);
    }
  };

  const profileItems = [
    { label: '성별', value: gender, onPress: () => setGenderSheetVisible(true) },
    { label: '나이', value: birthDate, onPress: () => setBirthDateSheetVisible(true) },
    { label: '키', value: height, onPress: () => setHeightSheetVisible(true) },
    { label: '체중', value: weight, onPress: () => setWeightSheetVisible(true) },
    { label: '운동 경험', value: exercise.type, onPress: () => setExerciseSheetVisible(true) },
  ];

  return (
    <View className="flex-1 bg-fill-normal">
      {/* 헤더 */}
      <View
        className="flex-row items-center justify-between bg-fill-normal"
        style={{ height: 56, paddingHorizontal: 20, marginTop: insets.top }}
      >
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.6}>
          <ChevronLeftIcon size={24} color="#1a1b1f" />
        </TouchableOpacity>
        <Text className="typo-headline-1-semi-bold text-label-normal text-center">내 정보</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 프로필 아바타 */}
        <View className="items-center pt-8 pb-8">
          <TouchableOpacity activeOpacity={0.8} onPress={handlePickImage} disabled={imageUploading}>
            <View>
              {profileUrl ? (
                <Image
                  source={{ uri: profileUrl }}
                  style={{ width: 100, height: 100, borderRadius: 50 }}
                />
              ) : (
                <ProfileAvatar url={profile?.profileUrl} />
              )}
              {/* + 버튼 */}
              <View
                className="absolute bg-label-normal rounded-full items-center justify-center"
                style={{ width: 32, height: 32, bottom: 0, right: 0 }}
              >
                {imageUploading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                    <Path
                      d="M14 8C14 8.13261 13.9473 8.25979 13.8536 8.35355C13.7598 8.44732 13.6326 8.5 13.5 8.5H8.5V13.5C8.5 13.6326 8.44732 13.7598 8.35355 13.8536C8.25979 13.9473 8.13261 14 8 14C7.86739 14 7.74021 13.9473 7.64645 13.8536C7.55268 13.7598 7.5 13.6326 7.5 13.5V8.5H2.5C2.36739 8.5 2.24021 8.44732 2.14645 8.35355C2.05268 8.25979 2 8.13261 2 8C2 7.86739 2.05268 7.74021 2.14645 7.64645C2.24021 7.55268 2.36739 7.5 2.5 7.5H7.5V2.5C7.5 2.36739 7.55268 2.24021 7.64645 2.14645C7.74021 2.05268 7.86739 2 8 2C8.13261 2 8.25979 2.05268 8.35355 2.14645C8.44732 2.24021 8.5 2.36739 8.5 2.5V7.5H13.5C13.6326 7.5 13.7598 7.55268 13.8536 7.64645C13.9473 7.74021 14 7.86739 14 8Z"
                      fill="white"
                    />
                  </Svg>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* 닉네임 */}
        <View className="px-5">
          <TouchableOpacity
            className="flex-row items-center justify-between bg-fill-strong"
            style={{ paddingVertical: 16, paddingHorizontal: 20, borderRadius: 16 }}
            activeOpacity={0.6}
            onPress={() => setNicknameSheetVisible(true)}
          >
            <Text className="typo-body-1-normal-medium text-label-normal" style={{ letterSpacing: -0.16 }}>
              닉네임
            </Text>
            <View className="flex-row items-center gap-1">
              <Text className="typo-body-1-normal-regular text-label-alternative">
                {nickname}
              </Text>
              <MenuChevronIcon />
            </View>
          </TouchableOpacity>
        </View>

        <ExerciseBottomSheet
          visible={exerciseSheetVisible}
          initialValue={exercise}
          onClose={() => setExerciseSheetVisible(false)}
          onSave={(value) => {
            setExercise(value);
            const exerciseTypeApi = EXERCISE_TYPE_TO_API[value.type];
            if (exerciseTypeApi) updateProfile({ exerciseType: exerciseTypeApi as any });
          }}
        />
        <WeightBottomSheet
          visible={weightSheetVisible}
          initialValue={weight}
          onClose={() => setWeightSheetVisible(false)}
          onSave={(value) => {
            setWeight(value);
            const num = parseFloat(value);
            if (!isNaN(num)) updateProfile({ weight: num });
          }}
        />
        <HeightBottomSheet
          visible={heightSheetVisible}
          initialValue={height}
          onClose={() => setHeightSheetVisible(false)}
          onSave={(value) => {
            setHeight(value);
            const num = parseFloat(value);
            if (!isNaN(num)) updateProfile({ height: num });
          }}
        />
        <BirthDateBottomSheet
          visible={birthDateSheetVisible}
          initialValue={birthDate}
          onClose={() => setBirthDateSheetVisible(false)}
          onSave={(value) => {
            setBirthDate(value);
            updateProfile({ birthDate: value });
          }}
        />
        <GenderBottomSheet
          visible={genderSheetVisible}
          initialValue={gender}
          onClose={() => setGenderSheetVisible(false)}
          onSave={(value) => {
            setGender(value);
            const genderApi = GENDER_TO_API[value];
            if (genderApi) updateProfile({ gender: genderApi });
          }}
        />
        <NicknameBottomSheet
          visible={nicknameSheetVisible}
          initialValue={nickname}
          onClose={() => setNicknameSheetVisible(false)}
          onSave={(value) => {
            setNickname(value);
            updateProfile({ nickname: value });
          }}
        />

        {/* 프로필 정보 */}
        <View className="px-5 pt-3">
          <View className="bg-fill-strong rounded-2xl overflow-hidden">
            {profileItems.map((item) => (
              <MenuRow
                key={item.label}
                label={item.label}
                value={item.value}
                onPress={item.onPress ?? (() => {})}
              />
            ))}
          </View>
        </View>

        <View style={{ height: insets.bottom + 16 }} />
      </ScrollView>
    </View>
  );
}
