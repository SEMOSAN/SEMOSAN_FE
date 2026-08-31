import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

type Coordinate = {
  latitude: number;
  longitude: number;
};

export type LiveActivityCourseData = {
  courseId: number;
  coordinates: Coordinate[];
  totalDistance: number;
  estimatedTime: number;
  /**
   * 출발점 → 정상 누적 거리(m). 마일스톤 푸시가 오는 지점과 같은 값이다.
   * 정상 좌표가 없어 계산할 수 없는 코스는 null이며, 이때는 기존 방식
   * (코스 전체의 절반)으로 폴백한다.
   */
  summitDistance?: number | null;
  /** 출발점 → 정상 예상 시간(분). summitDistance와 같은 조건으로 null일 수 있다. */
  summitEstimatedTime?: number | null;
};

async function getLiveActivityCourse(courseId: string): Promise<LiveActivityCourseData> {
  const res = await api.get<LiveActivityCourseData>({
    path: `/api/tracking/live-activity/courses/${courseId}`,
  });
  return res.data;
}

export function useLiveActivityCourse(courseId: string | null) {
  return useQuery({
    queryKey: ["tracking/live-activity/courses", courseId],
    queryFn: () => getLiveActivityCourse(courseId!),
    enabled: courseId !== null,
  });
}
