import { api } from '@/lib/api';
import { ENDPOINTS, GetUserProfileResponse } from '@/types/api.generated';
import { useQuery } from '@tanstack/react-query';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get<GetUserProfileResponse>({ path: ENDPOINTS.USERS_PROFILE });
      return res.data;
    },
  });
}

// ─── 표시값 변환 ──────────────────────────────────────────────

export const HIKING_LEVEL_LABEL: Record<string, string> = {
  BEGINNER: '입문자',
  EXPERIENCED: '경험자',
  HOBBY: '취미인',
  EXPERT: '전문가',
};

export const GENDER_LABEL: Record<string, string> = {
  MALE: '남성',
  FEMALE: '여성',
  NONE: '',
};

export const EXERCISE_TYPE_LABEL: Record<string, string> = {
  GYM: '헬스',
  HOME_TRAINING: '홈트레이닝',
  PILATES_YOGA: '필라테스/요가',
  WALKING: '걷기',
  RUNNING: '러닝',
  HIKING: '등산',
  SPORTS: '구기 종목',
  CROSSFIT: '크로스핏',
  SWIMMING: '수영',
  NONE: '없음',
};
