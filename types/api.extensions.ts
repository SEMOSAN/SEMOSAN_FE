// Temporary stubs — delete once backend adds these endpoints and rerun:
// node scripts/generate-api-types.mjs

export type CourseDetailResponse = {
  courseId?: number;
  name?: string;
  difficulty?: "EASY" | "NORMAL" | "HARD";
  distance?: number;
  duration?: number;
  polyline?: string | object;
};

export type TrackingPhotoUploadRequest = {
  milestoneIndex: number;
  milestoneDistanceM: number;
  imageUrl: string;
  capturedAt: string;
  lat: number;
  lng: number;
  altitude: number;
};

export type TrackingPhotoResponse = {
  photoId?: number;
  photoUrl?: string;
};

export const ENDPOINTS_EXTENSIONS = {
  COURSES_BY_COURSEID: (courseId: number | string) =>
    `/api/courses/${courseId}`,
  TRACKING_SESSIONS_BY_SESSIONID_PHOTOS: (sessionId: number | string) =>
    `/api/tracking/sessions/${sessionId}/photos`,
} as const;
