/**
 * [DEMO] 전시 데모용 관악산 하드코딩 데이터
 * 실제 서비스 전환 시 이 파일 import를 제거하고
 * tracking.tsx의 주석 처리된 useNearbyMountain 코드를 복원하세요.
 */

import type { NearbyMountainResponse } from '@/types/api.generated';

export const DEMO_NEARBY_DATA: NearbyMountainResponse = {
  mountain: {
    mountainId: 1,
    name: '관악산',
    address: '서울특별시 관악구 신림동',
    altitude: 632,
    latitude: 37.4449,
    longitude: 126.9636,
    imageUrls: [],
  },
  courses: [
    {
      courseId: 1,
      name: '관악산 코스 1',
      difficulty: 'EASY',
      distance: 8200,
      duration: 180,
    },
    {
      courseId: 2,
      name: '관악산 코스 2',
      difficulty: 'NORMAL',
      distance: 13950,
      duration: 330,
    },
    {
      courseId: 3,
      name: '관악산 코스 3',
      difficulty: 'HARD',
      distance: 16600,
      duration: 420,
    },
  ],
};
