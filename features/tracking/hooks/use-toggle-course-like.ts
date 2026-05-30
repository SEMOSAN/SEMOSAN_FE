import { api } from "@/lib/api";
import { ENDPOINTS } from "@/types/api.generated";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useToggleCourseLike(courseId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      api.post({ path: ENDPOINTS.COURSES_BY_COURSEID_LIKE(courseId) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-detail", courseId] });
    },
  });
}
