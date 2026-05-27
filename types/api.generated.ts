// Auto-generated from https://lgenius.site/v3/api-docs
// Run `node scripts/generate-api-types.mjs` to regenerate
// ⚠️ Do not edit manually

// ─────────────────────────────────────────────────────────────────────────────
// Endpoints
// ─────────────────────────────────────────────────────────────────────────────
export const ENDPOINTS = {
  APP_VERSION: "/api/app-version",
  USERS_ONBOARDING: "/api/users/onboarding",
  TRACKING_SESSIONS: "/api/tracking/sessions",
  TRACKING_SESSIONS_BY_SESSIONID_RESUME: (sessionId: number | string) => `/api/tracking/sessions/${sessionId}/resume`,
  TRACKING_SESSIONS_BY_SESSIONID_PHOTOS: (sessionId: number | string) => `/api/tracking/sessions/${sessionId}/photos`,
  TRACKING_SESSIONS_BY_SESSIONID_PAUSE: (sessionId: number | string) => `/api/tracking/sessions/${sessionId}/pause`,
  TRACKING_SESSIONS_BY_SESSIONID_COMPLETE: (sessionId: number | string) => `/api/tracking/sessions/${sessionId}/complete`,
  TRACKING_SESSIONS_BY_SESSIONID_ABANDON: (sessionId: number | string) => `/api/tracking/sessions/${sessionId}/abandon`,
  SEMOFEED: "/api/semofeed",
  OAUTH_KAKAO_LOGIN: "/api/oauth/kakao/login",
  OAUTH_APPLE_LOGIN: "/api/oauth/apple/login",
  MOUNTAINS_BY_MOUNTAINID_LIKE: (mountainId: number | string) => `/api/mountains/${mountainId}/like`,
  HIKING_RECORDS_BY_HIKINGRECORDID_DIFFICULTY_FEEDBACK: (hikingRecordId: number | string) => `/api/hiking-records/${hikingRecordId}/difficulty-feedback`,
  FCM_TOKENS: "/api/fcm/tokens",
  COMMUNITY_RECORD_POSTS: "/api/community/record-posts",
  COMMUNITY_POSTS_BY_POSTID_LIKES: (postId: number | string) => `/api/community/posts/${postId}/likes`,
  COMMUNITY_POSTS_BY_POSTID_COMMENTS: (postId: number | string) => `/api/community/posts/${postId}/comments`,
  COMMUNITY_POSTS_BY_POSTID_COMMENTS_REPLIES: (postId: number | string) => `/api/community/posts/${postId}/comments/replies`,
  COMMUNITY_FREE_POSTS: "/api/community/free-posts",
  COMMUNITY_FREE_POSTS_BY_POSTID_REPORTS: (postId: number | string) => `/api/community/free-posts/${postId}/reports`,
  COMMUNITY_FREE_POSTS_BY_POSTID_BLOCKS: (postId: number | string) => `/api/community/free-posts/${postId}/blocks`,
  AUTH_TOKEN_REISSUE: "/api/auth/token/reissue",
  AUTH_TEST_LOGIN: "/api/auth/test/login",
  AUTH_LOGOUT: "/api/auth/logout",
  USERS_PROFILE: "/api/users/profile",
  USERS_NOTIFICATION_SETTINGS_VOICE: "/api/users/notification-settings/voice",
  USERS_NOTIFICATION_SETTINGS_PUSH: "/api/users/notification-settings/push",
  USERS_NOTIFICATION_SETTINGS_LIVE_ACTIVITY: "/api/users/notification-settings/live-activity",
  SEMOFEED_BY_SEMOFEEDID_PUBLIC: (semoFeedId: number | string) => `/api/semofeed/${semoFeedId}/public`,
  USERS_NOTIFICATION_SETTINGS: "/api/users/notification-settings",
  USERS_NICKNAME: "/api/users/nickname",
  TRACKING_SESSIONS_BY_SESSIONID: (sessionId: number | string) => `/api/tracking/sessions/${sessionId}`,
  TRACKING_SESSIONS_ME_ACTIVE: "/api/tracking/sessions/me/active",
  TRACKING_NEARBY_MOUNTAIN: "/api/tracking/nearby-mountain",
  TRACKING_LIVE_ACTIVITY_COURSES_BY_COURSEID: (courseId: number | string) => `/api/tracking/live-activity/courses/${courseId}`,
  SEMOFEED_ME: "/api/semofeed/me",
  MOUNTAINS: "/api/mountains",
  MOUNTAINS_BY_MOUNTAINID: (mountainId: number | string) => `/api/mountains/${mountainId}`,
  MOUNTAINS_SEARCH: "/api/mountains/search",
  MOUNTAINS_RECOMMENDATIONS: "/api/mountains/recommendations",
  MOUNTAINS_MAP: "/api/mountains/map",
  MOUNTAINS_LIKES: "/api/mountains/likes",
  IMAGES_PRESIGNED_URL: "/api/images/presigned-url",
  HIKING_RECORDS_ME: "/api/hiking-records/me",
  HIKING_RECORDS_ME_SUMMARY: "/api/hiking-records/me/summary",
  HIKING_RECORDS_ME_MOUNTAINS: "/api/hiking-records/me/mountains",
  HIKING_RECORDS_ME_MOUNTAINS_BY_MOUNTAINID: (mountainId: number | string) => `/api/hiking-records/me/mountains/${mountainId}`,
  COURSES_BY_COURSEID: (courseId: number | string) => `/api/courses/${courseId}`,
  COMMUNITY_RECORD_POSTS_BY_POSTID: (postId: number | string) => `/api/community/record-posts/${postId}`,
  COMMUNITY_RECORD_POSTS_ME: "/api/community/record-posts/me",
  COMMUNITY_POSTS_BY_POSTID_LIKES_COUNT: (postId: number | string) => `/api/community/posts/${postId}/likes/count`,
  COMMUNITY_FREE_POSTS_BY_POSTID: (postId: number | string) => `/api/community/free-posts/${postId}`,
  COMMUNITY_FREE_POSTS_SEARCH: "/api/community/free-posts/search",
  COMMUNITY_FREE_POSTS_ME: "/api/community/free-posts/me",
  COMMUNITY_COMMENTS_BY_COMMENTID_REPLIES: (commentId: number | string) => `/api/community/comments/${commentId}/replies`,
  SEMOFEED_BY_SEMOFEEDID: (semoFeedId: number | string) => `/api/semofeed/${semoFeedId}`,
  COMMUNITY_COMMENTS_BY_COMMENTID: (commentId: number | string) => `/api/community/comments/${commentId}`,
  AUTH_WITHDRAW: "/api/auth/withdraw",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────
export type PlatformVersionRequest = {
  latestVersion?: string;
  minimumVersion?: string;
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
  data?: Record<string, unknown>;
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
export type RegisterOnboardingRequest = {
  nickname?: string;
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
export type ApiResponseVoid = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: Record<string, unknown>;
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
  imageUrl?: string;
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
export type SemoFeedResponse = {
  id?: number;
  imageUrl?: string;
  isPublic?: boolean;
};
export type OAuthKakaoLoginRequest = {
  accessToken?: string;
  deviceType: "IOS" | "ANDROID";
};
export type OAuthLoginResponse = {
  userId?: number;
  accessToken?: string;
  refreshToken?: string;
  onboardingCompleted?: boolean;
};
export type OAuthAppleLoginRequest = {
  identityToken?: string;
  name?: string;
  deviceType: "IOS" | "ANDROID";
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
  token?: string;
  deviceType: "IOS" | "ANDROID";
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
export type AuthorResponse = {
  id?: number;
  nickname?: string;
  profileUrl?: string;
  isDeleted?: boolean;
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
  content?: string;
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
  content?: string;
};
export type FreePostCreateRequest = {
  title?: string;
  content?: string;
  imageUrls?: string[];
  mainImageIndex?: number;
};
export type ApiResponseFreePostDetailResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: FreePostDetailResponse;
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
export type FreePostReportRequest = {
  reason: "SPAM" | "ABUSE" | "OBSCENE" | "FALSE_INFO" | "ETC";
};
export type ReissueResponse = {
  accessToken?: string;
  refreshToken?: string;
};
export type LoginRequest = {
  testUserId?: string;
  deviceType: "IOS" | "ANDROID";
  secretKey?: string;
};
export type LoginResponse = {
  userId?: number;
  accessToken?: string;
  refreshToken?: string;
  onboardingCompleted?: boolean;
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
export type CourseInfo = {
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
  courses?: CourseInfo[];
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
export type MountainDetailResponse = {
  mountain?: MountainInfo;
  courses?: CourseInfo[];
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
};
export type RestaurantSectionInfo = {
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
};
export type ApiResponsePageResponseGetUserHikingRecordResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: PageResponseGetUserHikingRecordResponse;
};
export type GetUserHikingRecordResponse = {
  hikingRecordId?: number;
  mountainId?: number;
  mountainName?: string;
  courseId?: number;
  courseName?: string;
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
  imageUrl?: string;
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
  name?: string;
  difficulty?: "EASY" | "NORMAL" | "HARD";
  distance?: number;
  duration?: number;
  startName?: string;
  endName?: string;
  ascent?: number;
  descent?: number;
  maxAltitude?: number;
  polyline?: string;
  altitudes?: string;
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
export type ApiResponseLong = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: number;
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
export type FcmTokenDeleteRequest = {
  token?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Operations (Params / Body / Response)
// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/app-version
export type UpdateAppVersionBody = UpdateAppVersionRequest;

// POST /api/users/onboarding
export type RegisterUserOnboardingBody = RegisterOnboardingRequest;

// POST /api/tracking/sessions
export type CreateSessionBody = CreateTrackingSessionRequest;

// POST /api/tracking/sessions/{sessionId}/resume
export type ResumeSessionParams = {
  sessionId: number;
};

// GET /api/tracking/sessions/{sessionId}/photos
export type ListParams = {
  sessionId: number;
};

// POST /api/tracking/sessions/{sessionId}/photos
export type UploadParams = {
  sessionId: number;
};
export type UploadBody = TrackingPhotoUploadRequest;

// POST /api/tracking/sessions/{sessionId}/pause
export type PauseSessionParams = {
  sessionId: number;
};

// POST /api/tracking/sessions/{sessionId}/complete
export type CompleteSessionParams = {
  sessionId: number;
};

// POST /api/tracking/sessions/{sessionId}/abandon
export type AbandonSessionParams = {
  sessionId: number;
};

// GET /api/semofeed
export type ListPublicParams = {
  page?: number;
  size?: number;
  sort?: string[];
};

// POST /api/semofeed
export type CreateBody = string;

// POST /api/oauth/kakao/login
export type KakaoLoginBody = OAuthKakaoLoginRequest;

// POST /api/oauth/apple/login
export type AppleLoginBody = OAuthAppleLoginRequest;

// POST /api/mountains/{mountainId}/like
export type LikeMountainParams = {
  mountainId: number;
};

// DELETE /api/mountains/{mountainId}/like
export type UnlikeMountainParams = {
  mountainId: number;
};

// POST /api/hiking-records/{hikingRecordId}/difficulty-feedback
export type CreateCourseDifficultyFeedbackParams = {
  hikingRecordId: number;
};
export type CreateCourseDifficultyFeedbackBody = CreateCourseDifficultyFeedbackRequest;

// POST /api/fcm/tokens
export type RegisterBody = FcmTokenRegisterRequest;

// DELETE /api/fcm/tokens
export type DeleteBody = FcmTokenDeleteRequest;

// GET /api/community/record-posts
export type GetListParams = {
  page?: number;
  size?: number;
  sort?: string[];
};

// POST /api/community/record-posts
export type Create1Body = RecordPostCreateRequest;

// POST /api/community/posts/{postId}/likes
export type ToggleParams = {
  postId: number;
};

// GET /api/community/posts/{postId}/comments
export type GetCommentsParams = {
  postId: number;
  page?: number;
  size?: number;
  sort?: string[];
};

// POST /api/community/posts/{postId}/comments
export type Create2Params = {
  postId: number;
};
export type Create2Body = CommentCreateRequest;

// POST /api/community/posts/{postId}/comments/replies
export type ReplyParams = {
  postId: number;
};
export type ReplyBody = CommentReplyRequest;

// GET /api/community/free-posts
export type GetList1Params = {
  page?: number;
  size?: number;
  sort?: string[];
};

// POST /api/community/free-posts
export type Create3Body = FreePostCreateRequest;

// POST /api/community/free-posts/{postId}/reports
export type ReportParams = {
  postId: number;
};
export type ReportBody = FreePostReportRequest;

// POST /api/community/free-posts/{postId}/blocks
export type BlockParams = {
  postId: number;
};

// POST /api/auth/test/login
export type LoginBody = LoginRequest;

// PATCH /api/users/profile
export type UpdateUserProfileBody = UpdateUserProfileRequest;

// PATCH /api/users/notification-settings/voice
export type UpdateVoiceSettingBody = UpdateNotificationSettingRequest;

// PATCH /api/users/notification-settings/push
export type UpdatePushNotificationSettingBody = UpdateNotificationSettingRequest;

// PATCH /api/users/notification-settings/live-activity
export type UpdateLiveActivitySettingBody = UpdateNotificationSettingRequest;

// PATCH /api/semofeed/{semoFeedId}/public
export type TogglePublicParams = {
  semoFeedId: number;
};

// GET /api/users/nickname
export type CheckNicknameParams = {
  nickname: string;
};

// GET /api/tracking/sessions/{sessionId}
export type GetSessionParams = {
  sessionId: number;
};

// GET /api/tracking/nearby-mountain
export type GetNearbyMountainParams = {
  lat: number;
  lng: number;
};

// GET /api/tracking/live-activity/courses/{courseId}
export type GetLiveActivityCourseParams = {
  courseId: number;
};

// GET /api/mountains
export type GetMountainsParams = {
  page?: number;
  size?: number;
  sort?: string[];
};

// GET /api/mountains/{mountainId}
export type GetMountainDetailParams = {
  mountainId: number;
};

// GET /api/mountains/search
export type SearchMountainsParams = {
  keyword: string;
  page?: number;
  size?: number;
  sort?: string[];
};

// GET /api/mountains/recommendations
export type GetRecommendedMountainsParams = {
  lat: number;
  lng: number;
};

// GET /api/mountains/map
export type GetMountainsForMapParams = {
  swLat?: number;
  swLng?: number;
  neLat?: number;
  neLng?: number;
};

// GET /api/mountains/likes
export type GetLikedMountainsParams = {
  page?: number;
  size?: number;
  sort?: string[];
};

// GET /api/images/presigned-url
export type GetPresignedUrlParams = {
  bucket: string;
  filename: string;
};

// GET /api/hiking-records/me
export type GetUserHikingRecordsParams = {
  page?: number;
  size?: number;
  sort?: string[];
};

// GET /api/hiking-records/me/mountains
export type GetUserHikingMountainRecordsParams = {
  page?: number;
  size?: number;
  sort?: string[];
};

// GET /api/hiking-records/me/mountains/{mountainId}
export type GetUserHikingRecordsByMountainIdParams = {
  mountainId: number;
  page?: number;
  size?: number;
  sort?: string[];
};

// GET /api/courses/{courseId}
export type GetCourseDetailParams = {
  courseId: number;
};

// GET /api/community/record-posts/{postId}
export type GetDetailParams = {
  postId: number;
};

// DELETE /api/community/record-posts/{postId}
export type Delete1Params = {
  postId: number;
};

// GET /api/community/record-posts/me
export type GetMyListParams = {
  page?: number;
  size?: number;
  sort?: string[];
};

// GET /api/community/posts/{postId}/likes/count
export type GetCountParams = {
  postId: number;
};

// GET /api/community/free-posts/{postId}
export type GetDetail1Params = {
  postId: number;
};

// DELETE /api/community/free-posts/{postId}
export type Delete2Params = {
  postId: number;
};

// GET /api/community/free-posts/search
export type SearchParams = {
  keyword: string;
  page?: number;
  size?: number;
  sort?: string[];
};

// GET /api/community/free-posts/me
export type GetMyList1Params = {
  page?: number;
  size?: number;
  sort?: string[];
};

// GET /api/community/comments/{commentId}/replies
export type GetRepliesParams = {
  commentId: number;
};

// DELETE /api/semofeed/{semoFeedId}
export type Delete3Params = {
  semoFeedId: number;
};

// DELETE /api/community/comments/{commentId}
export type Delete4Params = {
  commentId: number;
};
