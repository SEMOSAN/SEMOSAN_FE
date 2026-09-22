// Auto-generated from https://lgenius.site/v3/api-docs
// Run `node scripts/generate-api-types.mjs` to regenerate
// ⚠️ Do not edit manually

// ─────────────────────────────────────────────────────────────────────────────
// Endpoints
// ─────────────────────────────────────────────────────────────────────────────
export const ENDPOINTS = {
  COMMUNITY_FREE_POSTS_BY_POSTID: (postId: number | string) => `/api/community/free-posts/${postId}`,
  APP_VERSION: "/api/app-version",
  ADMIN_TRANSPORTATIONS_BY_TRANSPORTATIONID: (transportationId: number | string) => `/api/admin/transportations/${transportationId}`,
  ADMIN_RESTAURANTS_BY_RESTAURANTID: (restaurantId: number | string) => `/api/admin/restaurants/${restaurantId}`,
  ADMIN_RESTAURANT_SECTIONS_BY_SECTIONID: (sectionId: number | string) => `/api/admin/restaurant-sections/${sectionId}`,
  ADMIN_MOUNTAINS_BY_MOUNTAINID: (mountainId: number | string) => `/api/admin/mountains/${mountainId}`,
  USERS_ONBOARDING: "/api/users/onboarding",
  TRACKING_SESSIONS: "/api/tracking/sessions",
  TRACKING_SESSIONS_BY_SESSIONID_RESUME: (sessionId: number | string) => `/api/tracking/sessions/${sessionId}/resume`,
  TRACKING_SESSIONS_BY_SESSIONID_PHOTOS: (sessionId: number | string) => `/api/tracking/sessions/${sessionId}/photos`,
  TRACKING_SESSIONS_BY_SESSIONID_PAUSE: (sessionId: number | string) => `/api/tracking/sessions/${sessionId}/pause`,
  TRACKING_SESSIONS_BY_SESSIONID_COMPLETE: (sessionId: number | string) => `/api/tracking/sessions/${sessionId}/complete`,
  TRACKING_SESSIONS_BY_SESSIONID_ABANDON: (sessionId: number | string) => `/api/tracking/sessions/${sessionId}/abandon`,
  SEMOFEED: "/api/semofeed",
  SEMOFEED_BY_SEMOFEEDID_EMOJIS: (semoFeedId: number | string) => `/api/semofeed/${semoFeedId}/emojis`,
  OAUTH_KAKAO_LOGIN: "/api/oauth/kakao/login",
  OAUTH_APPLE_LOGIN: "/api/oauth/apple/login",
  NOTIFICATIONS_TEST: "/api/notifications/test",
  MOUNTAINS_BY_MOUNTAINID_LIKE: (mountainId: number | string) => `/api/mountains/${mountainId}/like`,
  HIKING_RECORDS_BY_HIKINGRECORDID_DIFFICULTY_FEEDBACK: (hikingRecordId: number | string) => `/api/hiking-records/${hikingRecordId}/difficulty-feedback`,
  FCM_TOKENS: "/api/fcm/tokens",
  COURSES_BY_COURSEID_LIKE: (courseId: number | string) => `/api/courses/${courseId}/like`,
  COMMUNITY_RECORD_POSTS: "/api/community/record-posts",
  COMMUNITY_POSTS_BY_POSTID_LIKES: (postId: number | string) => `/api/community/posts/${postId}/likes`,
  COMMUNITY_POSTS_BY_POSTID_COMMENTS: (postId: number | string) => `/api/community/posts/${postId}/comments`,
  COMMUNITY_POSTS_BY_POSTID_COMMENTS_REPLIES: (postId: number | string) => `/api/community/posts/${postId}/comments/replies`,
  COMMUNITY_FREE_POSTS: "/api/community/free-posts",
  COMMUNITY_FREE_POSTS_BY_POSTID_REPORTS: (postId: number | string) => `/api/community/free-posts/${postId}/reports`,
  COMMUNITY_FREE_POSTS_BY_POSTID_BLOCKS: (postId: number | string) => `/api/community/free-posts/${postId}/blocks`,
  COMMUNITY_COMMENTS_BY_COMMENTID_BLOCKS: (commentId: number | string) => `/api/community/comments/${commentId}/blocks`,
  AUTH_TOKEN_REISSUE: "/api/auth/token/reissue",
  AUTH_TEST_LOGIN: "/api/auth/test/login",
  AUTH_LOGOUT: "/api/auth/logout",
  ADMIN_USERS_BY_USERID_SUSPEND: (userId: number | string) => `/api/admin/users/${userId}/suspend`,
  ADMIN_SEMOFEED: "/api/admin/semofeed",
  ADMIN_RESTAURANT_SECTIONS_BY_SECTIONID_RESTAURANTS: (sectionId: number | string) => `/api/admin/restaurant-sections/${sectionId}/restaurants`,
  ADMIN_MOUNTAINS_BY_MOUNTAINID_TRANSPORTATIONS: (mountainId: number | string) => `/api/admin/mountains/${mountainId}/transportations`,
  ADMIN_MOUNTAINS_BY_MOUNTAINID_RESTAURANT_SECTIONS: (mountainId: number | string) => `/api/admin/mountains/${mountainId}/restaurant-sections`,
  ADMIN_LOGIN: "/api/admin/login",
  USERS_PROFILE: "/api/users/profile",
  USERS_NOTIFICATION_SETTINGS_VOICE: "/api/users/notification-settings/voice",
  USERS_NOTIFICATION_SETTINGS_PUSH: "/api/users/notification-settings/push",
  USERS_NOTIFICATION_SETTINGS_LIVE_ACTIVITY: "/api/users/notification-settings/live-activity",
  SEMOFEED_BY_SEMOFEEDID_PUBLIC: (semoFeedId: number | string) => `/api/semofeed/${semoFeedId}/public`,
  NOTIFICATIONS_BY_NOTIFICATIONID_READ: (notificationId: number | string) => `/api/notifications/${notificationId}/read`,
  NOTIFICATIONS_READ_ALL: "/api/notifications/read-all",
  ADMIN_SEMOFEED_BY_SEMOFEEDID_VISIBILITY: (semoFeedId: number | string) => `/api/admin/semofeed/${semoFeedId}/visibility`,
  ADMIN_MOUNTAINS_BY_MOUNTAINID_VISIBILITY: (mountainId: number | string) => `/api/admin/mountains/${mountainId}/visibility`,
  ADMIN_COURSES_BY_COURSEID_SUMMIT: (courseId: number | string) => `/api/admin/courses/${courseId}/summit`,
  USERS_NOTIFICATION_SETTINGS: "/api/users/notification-settings",
  USERS_NICKNAME: "/api/users/nickname",
  TRACKING_SESSIONS_BY_SESSIONID: (sessionId: number | string) => `/api/tracking/sessions/${sessionId}`,
  TRACKING_SESSIONS_BY_SESSIONID_TRACK: (sessionId: number | string) => `/api/tracking/sessions/${sessionId}/track`,
  TRACKING_SESSIONS_BY_SESSIONID_RESTORE: (sessionId: number | string) => `/api/tracking/sessions/${sessionId}/restore`,
  TRACKING_SESSIONS_ME_ACTIVE: "/api/tracking/sessions/me/active",
  TRACKING_NEARBY_MOUNTAIN: "/api/tracking/nearby-mountain",
  TRACKING_LIVE_ACTIVITY_COURSES_BY_COURSEID: (courseId: number | string) => `/api/tracking/live-activity/courses/${courseId}`,
  SEMOFEED_BY_SEMOFEEDID: (semoFeedId: number | string) => `/api/semofeed/${semoFeedId}`,
  SEMOFEED_ME: "/api/semofeed/me",
  NOTIFICATIONS: "/api/notifications",
  NOTIFICATIONS_UNREAD_COUNT: "/api/notifications/unread-count",
  MOUNTAINS: "/api/mountains",
  MOUNTAINS_BY_MOUNTAINID: (mountainId: number | string) => `/api/mountains/${mountainId}`,
  MOUNTAINS_SEARCH: "/api/mountains/search",
  MOUNTAINS_RECOMMENDATIONS: "/api/mountains/recommendations",
  MOUNTAINS_MAP: "/api/mountains/map",
  MOUNTAINS_LIKES: "/api/mountains/likes",
  IMAGES_PRESIGNED_URL: "/api/images/presigned-url",
  HIKING_RECORDS_BY_HIKINGRECORDID: (hikingRecordId: number | string) => `/api/hiking-records/${hikingRecordId}`,
  HIKING_RECORDS_ME: "/api/hiking-records/me",
  HIKING_RECORDS_ME_SUMMARY: "/api/hiking-records/me/summary",
  HIKING_RECORDS_ME_MOUNTAINS: "/api/hiking-records/me/mountains",
  HIKING_RECORDS_ME_MOUNTAINS_BY_MOUNTAINID: (mountainId: number | string) => `/api/hiking-records/me/mountains/${mountainId}`,
  COURSES_BY_COURSEID: (courseId: number | string) => `/api/courses/${courseId}`,
  COMMUNITY_RECORD_POSTS_BY_POSTID: (postId: number | string) => `/api/community/record-posts/${postId}`,
  COMMUNITY_RECORD_POSTS_ME: "/api/community/record-posts/me",
  COMMUNITY_POSTS_BY_POSTID_LIKES_COUNT: (postId: number | string) => `/api/community/posts/${postId}/likes/count`,
  COMMUNITY_FREE_POSTS_SEARCH: "/api/community/free-posts/search",
  COMMUNITY_FREE_POSTS_ME: "/api/community/free-posts/me",
  COMMUNITY_COMMENTS_BY_COMMENTID_REPLIES: (commentId: number | string) => `/api/community/comments/${commentId}/replies`,
  ADMIN_TEST_ERROR500: "/api/admin/test/error500",
  ADMIN_MOUNTAINS: "/api/admin/mountains",
  ADMIN_MOUNTAINS_BY_MOUNTAINID_WAYPOINTS: (mountainId: number | string) => `/api/admin/mountains/${mountainId}/waypoints`,
  ADMIN_COMMUNITY_REPORTED_POSTS: "/api/admin/community/reported-posts",
  COMMUNITY_COMMENTS_BY_COMMENTID: (commentId: number | string) => `/api/community/comments/${commentId}`,
  AUTH_WITHDRAW: "/api/auth/withdraw",
  ADMIN_SEMOFEED_BY_SEMOFEEDID: (semoFeedId: number | string) => `/api/admin/semofeed/${semoFeedId}`,
  ADMIN_COMMUNITY_POSTS_BY_POSTID: (postId: number | string) => `/api/admin/community/posts/${postId}`,
  ADMIN_COMMUNITY_COMMENTS_BY_COMMENTID: (commentId: number | string) => `/api/admin/community/comments/${commentId}`,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────
export type FreePostUpdateRequest = {
  title: string;
  content: string;
  imageUrls?: string[];
  mainImageIndex?: number;
};
export type ApiResponseFreePostDetailResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: FreePostDetailResponse;
};
export type AuthorResponse = {
  id?: number;
  nickname?: string;
  profileUrl?: string;
  isDeleted?: boolean;
};
export type FreePostDetailResponse = {
  id?: number;
  author?: AuthorResponse;
  title?: string;
  content?: string;
  images?: PostImageResponse[];
  viewCount?: number;
  likeCount?: number;
  likedByMe?: boolean;
  commentCount?: number;
  createdAt?: string;
};
export type PostImageResponse = {
  id?: number;
  imageUrl?: string;
  sortOrder?: number;
  main?: boolean;
};
export type PlatformVersionRequest = {
  latestVersion: string;
  minimumVersion: string;
  forceUpdate?: boolean;
  storeUrl?: string;
  releaseNotes?: string;
  maintenanceMode?: boolean;
  maintenanceMessage?: string;
};
export type UpdateAppVersionRequest = {
  ios: PlatformVersionRequest;
  android: PlatformVersionRequest;
};
export type ApiResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: unknown;
};
export type ApiResponseAppVersionResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: AppVersionResponse;
};
export type AppVersionResponse = {
  ios?: PlatformVersion;
  android?: PlatformVersion;
  updatedAt?: string;
};
export type PlatformVersion = {
  latestVersion?: string;
  minimumVersion?: string;
  forceUpdate?: boolean;
  storeUrl?: string;
  releaseNotes?: string;
  maintenanceMode?: boolean;
  maintenanceMessage?: string;
};
export type AdminTransportationRequest = {
  type: "SUBWAY" | "BUS" | "PARKING";
  direction: string;
  name: string;
  description?: string;
};
export type ApiResponseVoid = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: unknown;
};
export type AdminRestaurantRequest = {
  name: string;
  category?: string;
  menu?: string;
  description?: string;
  imageUrl?: string;
  mapUrl?: string;
  blogUrl?: string;
};
export type AdminRestaurantSectionRequest = {
  title: string;
};
export type AdminMountainUpdateRequest = {
  name: string;
  address: string;
  altitude: number;
  difficulty: "EASY" | "NORMAL" | "HARD";
  duration?: number;
  imageUrls?: string[];
};
export type RegisterOnboardingRequest = {
  nickname: string;
  profileUrl?: string;
  birthDate: string;
  gender: "MALE" | "FEMALE" | "NONE";
  height: number;
  weight: number;
  pushNotificationEnabled: boolean;
  liveActivityEnabled: boolean;
  voiceEnabled: boolean;
  hikingLevel: "BEGINNER" | "EXPERIENCED" | "HOBBY" | "EXPERT";
  exerciseType: "GYM" | "HOME_TRAINING" | "PILATES_YOGA" | "WALKING" | "RUNNING" | "HIKING" | "SPORTS" | "CROSSFIT" | "SWIMMING" | "NONE";
  exerciseFrequency?: "DAILY" | "WEEK_3_4" | "WEEK_1_2" | "MONTH_1_2" | "LESS_THAN_MONTH_1";
  exerciseDuration?: "OVER_4H" | "HOUR_2_4" | "HOUR_1_2" | "UNDER_1H";
};
export type CreateTrackingSessionRequest = {
  mountainId: number;
  courseId?: number;
  isFreeRecording: boolean;
};
export type ApiResponseTrackingSessionResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: TrackingSessionResponse;
};
export type TrackingSessionResponse = {
  sessionId?: number;
  userId?: number;
  mountainId?: number;
  mountainName?: string;
  courseId?: number;
  courseName?: string;
  isFreeRecording?: boolean;
  status?: "IN_PROGRESS" | "PAUSED" | "COMPLETED" | "ABANDONED";
  startedAt?: string;
  endedAt?: string;
  pausedAt?: string;
  pausedSecondsTotal?: number;
  hikingRecordId?: number;
};
export type TrackingPhotoUploadRequest = {
  milestoneIndex: number;
  milestoneDistanceM: number;
  imageUrl: string;
  capturedAt: string;
  lat: number;
  lng: number;
  altitude?: number;
};
export type ApiResponseTrackingPhotoResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: TrackingPhotoResponse;
};
export type TrackingPhotoResponse = {
  photoId?: number;
  trackingSessionId?: number;
  milestoneIndex?: number;
  milestoneDistanceM?: number;
  imageUrl?: string;
  capturedAt?: string;
  lat?: number;
  lng?: number;
  altitude?: number;
};
export type CompleteTrackingSessionRequest = {
  name?: string;
};
export type SemoFeedCreateRequest = {
  imageUrl: string;
};
export type SemoFeedResponse = {
  id?: number;
  userId?: number;
  profileUrl?: string;
  nickname?: string;
  imageUrl?: string;
  isPublic?: boolean;
  emojiCounts?: Record<string, number>;
  reactedByMe?: Record<string, boolean>;
  mine?: boolean;
};
export type SemoFeedEmojiRequest = {
  emojiType: "FIRE" | "HEART" | "CONGRATS" | "LAUGH";
};
export type SemoFeedEmojiToggleResponse = {
  emojiType?: "FIRE" | "HEART" | "CONGRATS" | "LAUGH";
  reacted?: boolean;
  count?: number;
};
export type OAuthKakaoLoginRequest = {
  accessToken: string;
  deviceType: "IOS" | "ANDROID";
};
export type OAuthLoginResponse = {
  userId?: number;
  accessToken?: string;
  refreshToken?: string;
  onboardingCompleted?: boolean;
};
export type OAuthAppleLoginRequest = {
  identityToken: string;
  name?: string;
  deviceType: "IOS" | "ANDROID";
};
export type NotificationTestRequest = {
  receiverId: number;
  type: "COMMUNITY_COMMENT" | "COMMUNITY_REPLY" | "COMMUNITY_POST_LIKE" | "SEMOFEED_EMOJI" | "TRACKING_PHOTO_MILESTONE" | "TRACKING_SUMMIT_REACHED";
  params?: Record<string, unknown>;
};
export type ApiResponseMountainLikeToggleResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: MountainLikeToggleResponse;
};
export type MountainLikeToggleResponse = {
  liked?: boolean;
};
export type CreateCourseDifficultyFeedbackRequest = {
  comparison: "SIMILAR" | "EASIER" | "HARDER";
};
export type ApiResponseCourseDifficultyFeedbackResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: CourseDifficultyFeedbackResponse;
};
export type CourseDifficultyFeedbackResponse = {
  feedbackId?: number;
  hikingRecordId?: number;
  mountainId?: number;
  mountainName?: string;
  courseId?: number;
  courseName?: string;
  guideDifficulty?: "EASY" | "NORMAL" | "HARD";
  comparison?: "SIMILAR" | "EASIER" | "HARDER";
};
export type FcmTokenRegisterRequest = {
  token: string;
  deviceType: "IOS" | "ANDROID";
};
export type ApiResponseCourseLikeToggleResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: CourseLikeToggleResponse;
};
export type CourseLikeToggleResponse = {
  liked?: boolean;
};
export type RecordPostCreateRequest = {
  hikingRecordId: number;
  content?: string;
};
export type ApiResponseRecordPostResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: RecordPostResponse;
};
export type HikingRecordSummaryResponse = {
  id?: number;
  mountainName?: string;
  courseName?: string;
  duration?: number;
  altitude?: number;
  calories?: number;
  cliveImageUrl?: string;
  photoReportImageUrl?: string;
};
export type RecordPostResponse = {
  id?: number;
  author?: AuthorResponse;
  content?: string;
  hikingRecord?: HikingRecordSummaryResponse;
  viewCount?: number;
  createdAt?: string;
};
export type ApiResponsePostLikeToggleResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: PostLikeToggleResponse;
};
export type PostLikeToggleResponse = {
  liked?: boolean;
  count?: number;
};
export type CommentCreateRequest = {
  content: string;
};
export type ApiResponseCommentResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: CommentResponse;
};
export type CommentResponse = {
  id?: number;
  author?: AuthorResponse;
  content?: string;
  parentId?: number;
  mentionedUser?: AuthorResponse;
  createdAt?: string;
  isDeleted?: boolean;
  isBlocked?: boolean;
};
export type CommentReplyRequest = {
  parentId: number;
  mentionedUserId?: number;
  content: string;
};
export type FreePostCreateRequest = {
  title: string;
  content: string;
  imageUrls?: string[];
  mainImageIndex?: number;
};
export type FreePostReportRequest = {
  reason: "SPAM" | "ABUSE" | "OBSCENE" | "FALSE_INFO" | "ETC";
};
export type ReissueResponse = {
  accessToken?: string;
  refreshToken?: string;
};
export type LoginRequest = {
  testUserId: string;
  deviceType: "IOS" | "ANDROID";
  secretKey: string;
};
export type LoginResponse = {
  userId?: number;
  accessToken?: string;
  refreshToken?: string;
  onboardingCompleted?: boolean;
};
export type AdminUserSuspendRequest = {
  suspendedUntil: string;
};
export type AdminSemoFeedResponse = {
  semoFeedId?: number;
  imageUrl?: string;
  authorId?: number;
  authorNickname?: string;
  isPublic?: boolean;
  createdAt?: string;
};
export type ApiResponseAdminSemoFeedResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: AdminSemoFeedResponse;
};
export type ApiResponseLong = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: number;
};
export type AdminLoginRequest = {
  username: string;
  password: string;
};
export type AdminLoginResponse = {
  adminId?: number;
  name?: string;
  accessToken?: string;
};
export type ApiResponseAdminLoginResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: AdminLoginResponse;
};
export type UpdateUserProfileRequest = {
  profileUrl?: string;
  nickname?: string;
  gender?: "MALE" | "FEMALE" | "NONE";
  birthDate?: string;
  height?: number;
  weight?: number;
  hikingLevel?: "BEGINNER" | "EXPERIENCED" | "HOBBY" | "EXPERT";
  exerciseType?: "GYM" | "HOME_TRAINING" | "PILATES_YOGA" | "WALKING" | "RUNNING" | "HIKING" | "SPORTS" | "CROSSFIT" | "SWIMMING" | "NONE";
};
export type UpdateNotificationSettingRequest = {
  enabled: boolean;
};
export type ApiResponseBoolean = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: boolean;
};
export type AdminSemoFeedVisibilityRequest = {
  isPublic: boolean;
};
export type AdminMountainVisibilityRequest = {
  isPublic: boolean;
};
export type AdminCourseSummitRequest = {
  latitude: number;
  longitude: number;
  altitude?: number;
};
export type ApiResponseGetUserProfileResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: GetUserProfileResponse;
};
export type GetUserProfileResponse = {
  userId?: number;
  profileUrl?: string;
  nickname?: string;
  hikingLevel?: "BEGINNER" | "EXPERIENCED" | "HOBBY" | "EXPERT";
  gender?: "MALE" | "FEMALE" | "NONE";
  age?: number;
  height?: number;
  weight?: number;
  exerciseType?: "GYM" | "HOME_TRAINING" | "PILATES_YOGA" | "WALKING" | "RUNNING" | "HIKING" | "SPORTS" | "CROSSFIT" | "SWIMMING" | "NONE";
  birthDate?: string;
  email?: string;
};
export type ApiResponseGetNotificationSettingResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: GetNotificationSettingResponse;
};
export type GetNotificationSettingResponse = {
  pushNotificationEnabled?: boolean;
  liveActivityEnabled?: boolean;
  voiceEnabled?: boolean;
};
export type ApiResponseTrackingTrackResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: TrackingTrackResponse;
};
export type TrackingTrackResponse = {
  sessionId?: number;
  track?: string;
  altitudes?: string;
};
export type ApiResponseTrackingRestoreResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: TrackingRestoreResponse;
};
export type PhotoMilestone = {
  milestones?: number[];
  openedIndexes?: number[];
  closedIndexes?: number[];
  summitNotified?: boolean;
};
export type Stats = {
  distanceMeters?: number;
  ascentMeters?: number;
  descentMeters?: number;
  maxAltitudeMeters?: number;
  pointCount?: number;
};
export type TrackingRestoreResponse = {
  session?: TrackingSessionResponse;
  elapsedSeconds?: number;
  stats?: Stats;
  photoMilestone?: PhotoMilestone;
};
export type ApiResponseListTrackingPhotoResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: TrackingPhotoResponse[];
};
export type ApiResponseNearbyMountainResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: NearbyMountainResponse;
};
export type NearbyMountainCourseInfo = {
  courseId?: number;
  name?: string;
  difficulty?: "EASY" | "NORMAL" | "HARD";
  distance?: number;
  duration?: number;
};
export type NearbyMountainInfo = {
  mountainId?: number;
  name?: string;
  address?: string;
  altitude?: number;
  latitude?: number;
  longitude?: number;
  imageUrls?: string[];
};
export type NearbyMountainResponse = {
  mountain?: NearbyMountainInfo;
  courses?: NearbyMountainCourseInfo[];
};
export type ApiResponseLiveActivityCourseResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: LiveActivityCourseResponse;
};
export type CoordinateInfo = {
  latitude?: number;
  longitude?: number;
};
export type LiveActivityCourseResponse = {
  courseId?: number;
  coordinates?: CoordinateInfo[];
  totalDistance?: number;
  estimatedTime?: number;
  summitDistance?: number;
  summitEstimatedTime?: number;
};
export type ApiResponsePageResponseSemoFeedResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: PageResponseSemoFeedResponse;
};
export type PageResponseSemoFeedResponse = {
  content?: SemoFeedResponse[];
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  last?: boolean;
};
export type ApiResponseListSemoFeedResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: SemoFeedResponse[];
};
export type NotificationResponse = {
  notificationId?: number;
  type?: "COMMUNITY_COMMENT" | "COMMUNITY_REPLY" | "COMMUNITY_POST_LIKE" | "SEMOFEED_EMOJI" | "TRACKING_PHOTO_MILESTONE" | "TRACKING_SUMMIT_REACHED";
  title?: string;
  body?: string;
  targetType?: "NONE" | "SEMOFEED" | "COMMUNITY_POST";
  targetId?: number;
  isRead?: boolean;
  createdAt?: string;
};
export type ApiResponsePageResponseMountainListResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: PageResponseMountainListResponse;
};
export type MountainListResponse = {
  mountainId?: number;
  name?: string;
  address?: string;
  altitude?: number;
  difficulty?: "EASY" | "NORMAL" | "HARD";
  duration?: number;
  imageUrls?: string[];
  latitude?: number;
  longitude?: number;
};
export type PageResponseMountainListResponse = {
  content?: MountainListResponse[];
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  last?: boolean;
};
export type ApiResponseMountainDetailResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: MountainDetailResponse;
};
export type MountainDetailCourseInfo = {
  courseId?: number;
  name?: string;
  difficulty?: "EASY" | "NORMAL" | "HARD";
  distance?: number;
  duration?: number;
  startName?: string;
  endName?: string;
};
export type MountainDetailResponse = {
  mountain?: MountainInfo;
  courses?: MountainDetailCourseInfo[];
  transportations?: TransportationGroup;
  amenities?: Record<string, ("RESTROOM" | "INFORMATION" | "SHELTER" | "PARKING" | "STORE")[]>;
  restaurantSections?: RestaurantSectionInfo[];
  reviews?: ReviewInfo[];
};
export type MountainInfo = {
  mountainId?: number;
  name?: string;
  address?: string;
  altitude?: number;
  difficulty?: "EASY" | "NORMAL" | "HARD";
  duration?: number;
  imageUrls?: string[];
  latitude?: number;
  longitude?: number;
};
export type RestaurantInfo = {
  restaurantId?: number;
  name?: string;
  category?: string;
  imageUrl?: string;
  mapUrl?: string;
};
export type RestaurantSectionInfo = {
  sectionId?: number;
  title?: string;
  restaurants?: RestaurantInfo[];
};
export type ReviewInfo = {
  reviewId?: number;
  imageUrl?: string;
  authorName?: string;
  content?: string;
  difficulty?: "EASY" | "NORMAL" | "HARD";
  courseName?: string;
};
export type TransportationGroup = {
  publicTransport?: Record<string, TransportationItem[]>;
  parking?: Record<string, TransportationItem[]>;
};
export type TransportationItem = {
  transportationId?: number;
  type?: "SUBWAY" | "BUS" | "PARKING";
  name?: string;
  description?: string;
};
export type ApiResponseListMountainRecommendationResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: MountainRecommendationResponse[];
};
export type MountainRecommendationResponse = {
  mountainId?: number;
  name?: string;
  imageUrl?: string;
  difficultyLabel?: string;
  mountainHeightM?: number;
  address?: string;
};
export type ApiResponseMountainMapListResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: MountainMapListResponse;
};
export type MountainMapListResponse = {
  hasHikingRecord?: boolean;
  mountains?: MountainMapResponse[];
};
export type MountainMapResponse = {
  id?: number;
  name?: string;
  latitude?: number;
  longitude?: number;
  visited?: boolean;
  visitCount?: number;
  imageUrl?: string;
};
export type ApiResponsePageResponseLikedMountainResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: PageResponseLikedMountainResponse;
};
export type LikedMountainResponse = {
  mountainId?: number;
  name?: string;
  address?: string;
  altitude?: number;
  difficulty?: "EASY" | "NORMAL" | "HARD";
  imageUrls?: string[];
};
export type PageResponseLikedMountainResponse = {
  content?: LikedMountainResponse[];
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  last?: boolean;
};
export type ApiResponsePresignedUrlResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: PresignedUrlResponse;
};
export type PresignedUrlResponse = {
  uploadUrl?: string;
  imageUrl?: string;
  contentType?: string;
};
export type ApiResponseHikingRecordDetailResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: HikingRecordDetailResponse;
};
export type CourseSummary = {
  id?: number;
  name?: string;
  startName?: string;
  endName?: string;
};
export type HikingRecordDetailResponse = {
  hikingRecordId?: number;
  mountain?: MountainSummary;
  course?: CourseSummary;
  recordName?: string;
  distanceMeters?: number;
  durationSeconds?: number;
  maxAltitudeMeters?: number;
  ascentMeters?: number;
  descentMeters?: number;
  calories?: number;
  temperature?: number;
  startedAt?: string;
  endedAt?: string;
  track?: string;
  altitudes?: string;
  photos?: PhotoMarker[];
};
export type MountainSummary = {
  id?: number;
  name?: string;
};
export type PhotoMarker = {
  milestoneIndex?: number;
  lat?: number;
  lng?: number;
  imageUrl?: string;
  capturedAt?: string;
};
export type ApiResponsePageResponseGetUserHikingRecordResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: PageResponseGetUserHikingRecordResponse;
};
export type GetUserHikingRecordResponse = {
  hikingRecordId?: number;
  sessionId?: number;
  mountainId?: number;
  mountainName?: string;
  courseId?: number;
  courseName?: string;
  recordName?: string;
  imageUrls?: string[];
  distance?: number;
  duration?: number;
  hikedAt?: string;
};
export type PageResponseGetUserHikingRecordResponse = {
  content?: GetUserHikingRecordResponse[];
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  last?: boolean;
};
export type ApiResponseGetUserHikingRecordSummaryResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: GetUserHikingRecordSummaryResponse;
};
export type GetUserHikingRecordSummaryResponse = {
  totalHikingCount?: number;
  conqueredMountainCount?: number;
  totalAltitude?: number;
};
export type ApiResponsePageResponseGetUserHikingMountainRecordResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: PageResponseGetUserHikingMountainRecordResponse;
};
export type GetUserHikingMountainRecordResponse = {
  mountainId?: number;
  mountainName?: string;
  imageUrls?: string[];
  hikingCount?: number;
  lastHikedAt?: string;
};
export type PageResponseGetUserHikingMountainRecordResponse = {
  content?: GetUserHikingMountainRecordResponse[];
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  last?: boolean;
};
export type ApiResponseCourseDetailResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: CourseDetailResponse;
};
export type CourseDetailResponse = {
  id?: number;
  mountainId?: number;
  name?: string;
  difficulty?: "EASY" | "NORMAL" | "HARD";
  distance?: number;
  duration?: number;
  startName?: string;
  endName?: string;
  ascent?: number;
  descent?: number;
  maxAltitude?: number;
  likedByMe?: boolean;
  polyline?: string;
  altitudes?: string;
  segments?: SlopeSegmentResponse[];
};
export type SlopeSegmentResponse = {
  startIdx?: number;
  endIdx?: number;
  grade?: "STEEP_DOWN" | "MILD_DOWN" | "FLAT" | "MILD_UP" | "STEEP_UP";
};
export type ApiResponsePageResponseRecordPostResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: PageResponseRecordPostResponse;
};
export type PageResponseRecordPostResponse = {
  content?: RecordPostResponse[];
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  last?: boolean;
};
export type ApiResponsePageResponseCommentResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: PageResponseCommentResponse;
};
export type PageResponseCommentResponse = {
  content?: CommentResponse[];
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  last?: boolean;
};
export type ApiResponsePageResponseFreePostListResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: PageResponseFreePostListResponse;
};
export type FreePostListResponse = {
  id?: number;
  author?: AuthorResponse;
  title?: string;
  contentPreview?: string;
  thumbnailUrl?: string;
  extraImageCount?: number;
  likeCount?: number;
  commentCount?: number;
  createdAt?: string;
};
export type PageResponseFreePostListResponse = {
  content?: FreePostListResponse[];
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  last?: boolean;
};
export type ApiResponseListCommentResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: CommentResponse[];
};
export type ApiResponsePageResponseAdminSemoFeedResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: PageResponseAdminSemoFeedResponse;
};
export type PageResponseAdminSemoFeedResponse = {
  content?: AdminSemoFeedResponse[];
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  last?: boolean;
};
export type AdminMountainListResponse = {
  mountainId?: number;
  name?: string;
  address?: string;
  altitude?: number;
  difficulty?: "EASY" | "NORMAL" | "HARD";
  duration?: number;
  imageUrls?: string[];
  latitude?: number;
  longitude?: number;
  isPublic?: boolean;
  courseCount?: number;
};
export type ApiResponsePageResponseAdminMountainListResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: PageResponseAdminMountainListResponse;
};
export type PageResponseAdminMountainListResponse = {
  content?: AdminMountainListResponse[];
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  last?: boolean;
};
export type AdminCourseWaypointsResponse = {
  courseId?: number;
  courseName?: string;
  summitLat?: number;
  summitLng?: number;
  summitEle?: number;
  waypoints?: WaypointInfo[];
};
export type ApiResponseListAdminCourseWaypointsResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: AdminCourseWaypointsResponse[];
};
export type WaypointInfo = {
  lat?: number;
  lng?: number;
  ele?: number;
  name?: string;
  category?: string;
};
export type AdminReportedPostResponse = {
  postId?: number;
  title?: string;
  content?: string;
  authorId?: number;
  authorNickname?: string;
  reportCount?: number;
  deleted?: boolean;
  createdAt?: string;
};
export type ApiResponsePageResponseAdminReportedPostResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: PageResponseAdminReportedPostResponse;
};
export type PageResponseAdminReportedPostResponse = {
  content?: AdminReportedPostResponse[];
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  last?: boolean;
};
export type FcmTokenDeleteRequest = {
  token: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Operations (Params / Body / Response)
// ─────────────────────────────────────────────────────────────────────────────
// GET /api/community/free-posts/{postId}
export type GetDetailParams = {
  postId: number;
};
export type GetDetailResponse = ApiResponseFreePostDetailResponse;

// PUT /api/community/free-posts/{postId}
export type UpdateParams = {
  postId: number;
};
export type UpdateBody = FreePostUpdateRequest;
export type UpdateResponse = ApiResponseFreePostDetailResponse;

// DELETE /api/community/free-posts/{postId}
export type DeleteParams = {
  postId: number;
};
export type DeleteResponse = ApiResponseVoid;

// GET /api/app-version
export type GetAppVersionResponse = ApiResponseAppVersionResponse;

// PUT /api/app-version
export type UpdateAppVersionBody = UpdateAppVersionRequest;
export type UpdateAppVersionResponse = ApiResponseAppVersionResponse;

// PUT /api/admin/transportations/{transportationId}
export type UpdateTransportationParams = {
  transportationId: number;
};
export type UpdateTransportationBody = AdminTransportationRequest;
export type UpdateTransportationResponse = ApiResponseVoid;

// DELETE /api/admin/transportations/{transportationId}
export type DeleteTransportationParams = {
  transportationId: number;
};
export type DeleteTransportationResponse = ApiResponseVoid;

// PUT /api/admin/restaurants/{restaurantId}
export type UpdateRestaurantParams = {
  restaurantId: number;
};
export type UpdateRestaurantBody = AdminRestaurantRequest;
export type UpdateRestaurantResponse = ApiResponseVoid;

// DELETE /api/admin/restaurants/{restaurantId}
export type DeleteRestaurantParams = {
  restaurantId: number;
};
export type DeleteRestaurantResponse = ApiResponseVoid;

// PUT /api/admin/restaurant-sections/{sectionId}
export type UpdateRestaurantSectionParams = {
  sectionId: number;
};
export type UpdateRestaurantSectionBody = AdminRestaurantSectionRequest;
export type UpdateRestaurantSectionResponse = ApiResponseVoid;

// DELETE /api/admin/restaurant-sections/{sectionId}
export type DeleteRestaurantSectionParams = {
  sectionId: number;
};
export type DeleteRestaurantSectionResponse = ApiResponseVoid;

// GET /api/admin/mountains/{mountainId}
export type GetMountainDetailParams = {
  mountainId: number;
};
export type GetMountainDetailResponse = ApiResponseMountainDetailResponse;

// PUT /api/admin/mountains/{mountainId}
export type UpdateMountainParams = {
  mountainId: number;
};
export type UpdateMountainBody = AdminMountainUpdateRequest;
export type UpdateMountainResponse = ApiResponseVoid;

// POST /api/users/onboarding
export type RegisterUserOnboardingBody = RegisterOnboardingRequest;
export type RegisterUserOnboardingResponse = ApiResponseVoid;

// POST /api/tracking/sessions
export type CreateSessionBody = CreateTrackingSessionRequest;
export type CreateSessionResponse = ApiResponseTrackingSessionResponse;

// POST /api/tracking/sessions/{sessionId}/resume
export type ResumeSessionParams = {
  sessionId: number;
};
export type ResumeSessionResponse = ApiResponseTrackingSessionResponse;

// GET /api/tracking/sessions/{sessionId}/photos
export type ListParams = {
  sessionId: number;
};
export type ListResponse = ApiResponseListTrackingPhotoResponse;

// POST /api/tracking/sessions/{sessionId}/photos
export type UploadParams = {
  sessionId: number;
};
export type UploadBody = TrackingPhotoUploadRequest;
export type UploadResponse = ApiResponseTrackingPhotoResponse;

// POST /api/tracking/sessions/{sessionId}/pause
export type PauseSessionParams = {
  sessionId: number;
};
export type PauseSessionResponse = ApiResponseTrackingSessionResponse;

// POST /api/tracking/sessions/{sessionId}/complete
export type CompleteSessionParams = {
  sessionId: number;
};
export type CompleteSessionBody = CompleteTrackingSessionRequest;
export type CompleteSessionResponse = ApiResponseTrackingSessionResponse;

// POST /api/tracking/sessions/{sessionId}/abandon
export type AbandonSessionParams = {
  sessionId: number;
};
export type AbandonSessionResponse = ApiResponseTrackingSessionResponse;

// GET /api/semofeed
export type ListPublicParams = {
  page?: number;
  size?: number;
  sort?: string[];
};
export type ListPublicResponse = ApiResponsePageResponseSemoFeedResponse;

// POST /api/semofeed
export type CreateBody = SemoFeedCreateRequest;
export type CreateResponse = SemoFeedResponse;

// POST /api/semofeed/{semoFeedId}/emojis
export type ToggleEmojiParams = {
  semoFeedId: number;
};
export type ToggleEmojiBody = SemoFeedEmojiRequest;
export type ToggleEmojiResponse = SemoFeedEmojiToggleResponse;

// POST /api/oauth/kakao/login
export type KakaoLoginBody = OAuthKakaoLoginRequest;
export type KakaoLoginResponse = OAuthLoginResponse;

// POST /api/oauth/apple/login
export type AppleLoginBody = OAuthAppleLoginRequest;
export type AppleLoginResponse = OAuthLoginResponse;

// POST /api/notifications/test
export type SendBody = NotificationTestRequest;
export type SendResponse = ApiResponseVoid;

// POST /api/mountains/{mountainId}/like
export type ToggleMountainLikeParams = {
  mountainId: number;
};
export type ToggleMountainLikeResponse = ApiResponseMountainLikeToggleResponse;

// POST /api/hiking-records/{hikingRecordId}/difficulty-feedback
export type CreateCourseDifficultyFeedbackParams = {
  hikingRecordId: number;
};
export type CreateCourseDifficultyFeedbackBody = CreateCourseDifficultyFeedbackRequest;
export type CreateCourseDifficultyFeedbackResponse = ApiResponseCourseDifficultyFeedbackResponse;

// POST /api/fcm/tokens
export type RegisterBody = FcmTokenRegisterRequest;
export type RegisterResponse = ApiResponseVoid;

// DELETE /api/fcm/tokens
export type Delete1Body = FcmTokenDeleteRequest;
export type Delete1Response = ApiResponseVoid;

// POST /api/courses/{courseId}/like
export type ToggleCourseLikeParams = {
  courseId: number;
};
export type ToggleCourseLikeResponse = ApiResponseCourseLikeToggleResponse;

// GET /api/community/record-posts
export type GetListParams = {
  page?: number;
  size?: number;
  sort?: string[];
};
export type GetListResponse = ApiResponsePageResponseRecordPostResponse;

// POST /api/community/record-posts
export type Create1Body = RecordPostCreateRequest;
export type Create1Response = ApiResponseRecordPostResponse;

// POST /api/community/posts/{postId}/likes
export type ToggleParams = {
  postId: number;
};
export type ToggleResponse = ApiResponsePostLikeToggleResponse;

// GET /api/community/posts/{postId}/comments
export type GetCommentsParams = {
  postId: number;
  page?: number;
  size?: number;
  sort?: string[];
};
export type GetCommentsResponse = ApiResponsePageResponseCommentResponse;

// POST /api/community/posts/{postId}/comments
export type Create2Params = {
  postId: number;
};
export type Create2Body = CommentCreateRequest;
export type Create2Response = ApiResponseCommentResponse;

// POST /api/community/posts/{postId}/comments/replies
export type ReplyParams = {
  postId: number;
};
export type ReplyBody = CommentReplyRequest;
export type ReplyResponse = ApiResponseCommentResponse;

// GET /api/community/free-posts
export type GetList1Params = {
  page?: number;
  size?: number;
  sort?: string[];
};
export type GetList1Response = ApiResponsePageResponseFreePostListResponse;

// POST /api/community/free-posts
export type Create3Body = FreePostCreateRequest;
export type Create3Response = ApiResponseFreePostDetailResponse;

// POST /api/community/free-posts/{postId}/reports
export type ReportParams = {
  postId: number;
};
export type ReportBody = FreePostReportRequest;
export type ReportResponse = ApiResponseVoid;

// POST /api/community/free-posts/{postId}/blocks
export type BlockParams = {
  postId: number;
};
export type BlockResponse = ApiResponseVoid;

// POST /api/community/comments/{commentId}/blocks
export type Block1Params = {
  commentId: number;
};
export type Block1Response = ApiResponseVoid;

// POST /api/auth/test/login
export type LoginBody = LoginRequest;

// POST /api/auth/logout
export type LogoutResponse = ApiResponseVoid;

// POST /api/admin/users/{userId}/suspend
export type SuspendUserParams = {
  userId: number;
};
export type SuspendUserBody = AdminUserSuspendRequest;
export type SuspendUserResponse = ApiResponseVoid;

// DELETE /api/admin/users/{userId}/suspend
export type UnsuspendUserParams = {
  userId: number;
};
export type UnsuspendUserResponse = ApiResponseVoid;

// GET /api/admin/semofeed
export type GetFeedsParams = {
  page?: number;
  size?: number;
  sort?: string[];
};
export type GetFeedsResponse = ApiResponsePageResponseAdminSemoFeedResponse;

// POST /api/admin/semofeed
export type Create4Body = SemoFeedCreateRequest;
export type Create4Response = ApiResponseAdminSemoFeedResponse;

// POST /api/admin/restaurant-sections/{sectionId}/restaurants
export type CreateRestaurantParams = {
  sectionId: number;
};
export type CreateRestaurantBody = AdminRestaurantRequest;
export type CreateRestaurantResponse = ApiResponseLong;

// POST /api/admin/mountains/{mountainId}/transportations
export type CreateTransportationParams = {
  mountainId: number;
};
export type CreateTransportationBody = AdminTransportationRequest;
export type CreateTransportationResponse = ApiResponseLong;

// POST /api/admin/mountains/{mountainId}/restaurant-sections
export type CreateRestaurantSectionParams = {
  mountainId: number;
};
export type CreateRestaurantSectionBody = AdminRestaurantSectionRequest;
export type CreateRestaurantSectionResponse = ApiResponseLong;

// POST /api/admin/login
export type Login1Body = AdminLoginRequest;
export type Login1Response = ApiResponseAdminLoginResponse;

// GET /api/users/profile
export type GetUserProfileResponseAlias = ApiResponseGetUserProfileResponse;

// PATCH /api/users/profile
export type UpdateUserProfileBody = UpdateUserProfileRequest;
export type UpdateUserProfileResponse = ApiResponseVoid;

// PATCH /api/users/notification-settings/voice
export type UpdateVoiceSettingBody = UpdateNotificationSettingRequest;
export type UpdateVoiceSettingResponse = ApiResponseVoid;

// PATCH /api/users/notification-settings/push
export type UpdatePushNotificationSettingBody = UpdateNotificationSettingRequest;
export type UpdatePushNotificationSettingResponse = ApiResponseVoid;

// PATCH /api/users/notification-settings/live-activity
export type UpdateLiveActivitySettingBody = UpdateNotificationSettingRequest;
export type UpdateLiveActivitySettingResponse = ApiResponseVoid;

// PATCH /api/semofeed/{semoFeedId}/public
export type TogglePublicParams = {
  semoFeedId: number;
};
export type TogglePublicResponse = ApiResponseBoolean;

// PATCH /api/notifications/{notificationId}/read
export type MarkAsReadParams = {
  notificationId: number;
};
export type MarkAsReadResponse = ApiResponseVoid;

// PATCH /api/notifications/read-all
export type MarkAllAsReadResponse = ApiResponseVoid;

// PATCH /api/admin/semofeed/{semoFeedId}/visibility
export type UpdateVisibilityParams = {
  semoFeedId: number;
};
export type UpdateVisibilityBody = AdminSemoFeedVisibilityRequest;
export type UpdateVisibilityResponse = ApiResponseVoid;

// PATCH /api/admin/mountains/{mountainId}/visibility
export type UpdateVisibility1Params = {
  mountainId: number;
};
export type UpdateVisibility1Body = AdminMountainVisibilityRequest;
export type UpdateVisibility1Response = ApiResponseVoid;

// PATCH /api/admin/courses/{courseId}/summit
export type UpdateSummitParams = {
  courseId: number;
};
export type UpdateSummitBody = AdminCourseSummitRequest;
export type UpdateSummitResponse = ApiResponseVoid;

// GET /api/users/notification-settings
export type GetNotificationSettingResponseAlias = ApiResponseGetNotificationSettingResponse;

// GET /api/users/nickname
export type CheckNicknameParams = {
  nickname: string;
};
export type CheckNicknameResponse = ApiResponseVoid;

// GET /api/tracking/sessions/{sessionId}
export type GetSessionParams = {
  sessionId: number;
};
export type GetSessionResponse = ApiResponseTrackingSessionResponse;

// GET /api/tracking/sessions/{sessionId}/track
export type GetSessionTrackParams = {
  sessionId: number;
};
export type GetSessionTrackResponse = ApiResponseTrackingTrackResponse;

// GET /api/tracking/sessions/{sessionId}/restore
export type RestoreSessionParams = {
  sessionId: number;
};
export type RestoreSessionResponse = ApiResponseTrackingRestoreResponse;

// GET /api/tracking/sessions/me/active
export type GetActiveSessionResponse = ApiResponseTrackingSessionResponse;

// GET /api/tracking/nearby-mountain
export type GetNearbyMountainParams = {
  lat: number;
  lng: number;
};
export type GetNearbyMountainResponse = ApiResponseNearbyMountainResponse;

// GET /api/tracking/live-activity/courses/{courseId}
export type GetLiveActivityCourseParams = {
  courseId: number;
};
export type GetLiveActivityCourseResponse = ApiResponseLiveActivityCourseResponse;

// GET /api/semofeed/{semoFeedId}
export type GetParams = {
  semoFeedId: number;
};
export type GetResponse = SemoFeedResponse;

// DELETE /api/semofeed/{semoFeedId}
export type Delete2Params = {
  semoFeedId: number;
};
export type Delete2Response = ApiResponseVoid;

// GET /api/semofeed/me
export type ListMineResponse = ApiResponseListSemoFeedResponse;

// GET /api/notifications
export type GetNotificationsParams = {
  page?: number;
  size?: number;
  sort?: string[];
};
export type GetNotificationsResponse = NotificationResponse;

// GET /api/notifications/unread-count
export type GetUnreadCountResponse = ApiResponseLong;

// GET /api/mountains
export type GetMountainsParams = {
  page?: number;
  size?: number;
  sort?: string[];
};
export type GetMountainsResponse = ApiResponsePageResponseMountainListResponse;

// GET /api/mountains/{mountainId}
export type GetMountainDetail1Params = {
  mountainId: number;
};
export type GetMountainDetail1Response = ApiResponseMountainDetailResponse;

// GET /api/mountains/search
export type SearchMountainsParams = {
  keyword: string;
  page?: number;
  size?: number;
  sort?: string[];
};
export type SearchMountainsResponse = ApiResponsePageResponseMountainListResponse;

// GET /api/mountains/recommendations
export type GetRecommendedMountainsParams = {
  lat: number;
  lng: number;
};
export type GetRecommendedMountainsResponse = ApiResponseListMountainRecommendationResponse;

// GET /api/mountains/map
export type GetMountainsForMapParams = {
  swLat?: number;
  swLng?: number;
  neLat?: number;
  neLng?: number;
};
export type GetMountainsForMapResponse = ApiResponseMountainMapListResponse;

// GET /api/mountains/likes
export type GetLikedMountainsParams = {
  page?: number;
  size?: number;
  sort?: string[];
};
export type GetLikedMountainsResponse = ApiResponsePageResponseLikedMountainResponse;

// GET /api/images/presigned-url
export type GetPresignedUrlParams = {
  bucket: string;
  filename: string;
};
export type GetPresignedUrlResponse = ApiResponsePresignedUrlResponse;

// GET /api/hiking-records/{hikingRecordId}
export type GetHikingRecordDetailParams = {
  hikingRecordId: number;
};
export type GetHikingRecordDetailResponse = ApiResponseHikingRecordDetailResponse;

// GET /api/hiking-records/me
export type GetUserHikingRecordsParams = {
  page?: number;
  size?: number;
  sort?: string[];
};
export type GetUserHikingRecordsResponse = ApiResponsePageResponseGetUserHikingRecordResponse;

// GET /api/hiking-records/me/summary
export type GetUserHikingRecordSummaryResponseAlias = ApiResponseGetUserHikingRecordSummaryResponse;

// GET /api/hiking-records/me/mountains
export type GetUserHikingMountainRecordsParams = {
  page?: number;
  size?: number;
  sort?: string[];
};
export type GetUserHikingMountainRecordsResponse = ApiResponsePageResponseGetUserHikingMountainRecordResponse;

// GET /api/hiking-records/me/mountains/{mountainId}
export type GetUserHikingRecordsByMountainIdParams = {
  mountainId: number;
  page?: number;
  size?: number;
  sort?: string[];
};
export type GetUserHikingRecordsByMountainIdResponse = ApiResponsePageResponseGetUserHikingRecordResponse;

// GET /api/courses/{courseId}
export type GetCourseDetailParams = {
  courseId: number;
};
export type GetCourseDetailResponse = ApiResponseCourseDetailResponse;

// GET /api/community/record-posts/{postId}
export type GetDetail1Params = {
  postId: number;
};
export type GetDetail1Response = ApiResponseRecordPostResponse;

// DELETE /api/community/record-posts/{postId}
export type Delete3Params = {
  postId: number;
};
export type Delete3Response = ApiResponseVoid;

// GET /api/community/record-posts/me
export type GetMyListParams = {
  page?: number;
  size?: number;
  sort?: string[];
};
export type GetMyListResponse = ApiResponsePageResponseRecordPostResponse;

// GET /api/community/posts/{postId}/likes/count
export type GetCountParams = {
  postId: number;
};
export type GetCountResponse = ApiResponseLong;

// GET /api/community/free-posts/search
export type SearchParams = {
  keyword: string;
  page?: number;
  size?: number;
  sort?: string[];
};
export type SearchResponse = ApiResponsePageResponseFreePostListResponse;

// GET /api/community/free-posts/me
export type GetMyList1Params = {
  page?: number;
  size?: number;
  sort?: string[];
};
export type GetMyList1Response = ApiResponsePageResponseFreePostListResponse;

// GET /api/community/comments/{commentId}/replies
export type GetRepliesParams = {
  commentId: number;
};
export type GetRepliesResponse = ApiResponseListCommentResponse;

// GET /api/admin/mountains
export type GetMountains1Params = {
  keyword?: string;
  visibility?: string;
  page?: number;
  size?: number;
  sort?: string[];
};
export type GetMountains1Response = ApiResponsePageResponseAdminMountainListResponse;

// GET /api/admin/mountains/{mountainId}/waypoints
export type GetWaypointsParams = {
  mountainId: number;
};
export type GetWaypointsResponse = ApiResponseListAdminCourseWaypointsResponse;

// GET /api/admin/community/reported-posts
export type GetReportedPostsParams = {
  page?: number;
  size?: number;
  sort?: string[];
};
export type GetReportedPostsResponse = ApiResponsePageResponseAdminReportedPostResponse;

// DELETE /api/community/comments/{commentId}
export type Delete4Params = {
  commentId: number;
};
export type Delete4Response = ApiResponseVoid;

// DELETE /api/auth/withdraw
export type WithdrawResponse = ApiResponseVoid;

// DELETE /api/admin/semofeed/{semoFeedId}
export type Delete5Params = {
  semoFeedId: number;
};
export type Delete5Response = ApiResponseVoid;

// DELETE /api/admin/community/posts/{postId}
export type DeletePostParams = {
  postId: number;
};
export type DeletePostResponse = ApiResponseVoid;

// DELETE /api/admin/community/comments/{commentId}
export type DeleteCommentParams = {
  commentId: number;
};
export type DeleteCommentResponse = ApiResponseVoid;
