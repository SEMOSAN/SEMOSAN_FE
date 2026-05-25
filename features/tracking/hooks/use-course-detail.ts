import { api } from '@/lib/api';
import { CourseDetailResponse, ENDPOINTS } from '@/types/api.generated';
import { useQuery } from '@tanstack/react-query';

export function useCourseDetail(courseId: number | null) {
  return useQuery({
    queryKey: ['course-detail', courseId],
    queryFn: async (): Promise<CourseDetailResponse> => {
      const res = await api.get<CourseDetailResponse>({
        path: ENDPOINTS.COURSES_BY_COURSEID(courseId!),
      });
      return res.data;
    },
    enabled: courseId != null,
    staleTime: 1000 * 60 * 10, // 10분 캐시 (코스 데이터는 잘 안 바뀜)
  });
}
