import { api } from "@/lib/api";
import { CourseDetailResponse, ENDPOINTS } from "@/types/api.generated";
import { useQuery } from "@tanstack/react-query";

async function getCourseDetail(courseId: number): Promise<CourseDetailResponse> {
  const res = await api.get<CourseDetailResponse>({
    path: ENDPOINTS.COURSES_BY_COURSEID(courseId),
  });
  return res.data;
}

export function useCourseDetail(courseId: number) {
  return useQuery({
    queryKey: [ENDPOINTS.COURSES_BY_COURSEID(courseId)],
    queryFn: () => getCourseDetail(courseId),
    enabled: !isNaN(courseId) && courseId > 0,
  });
}
