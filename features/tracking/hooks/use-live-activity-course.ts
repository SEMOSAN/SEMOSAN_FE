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
