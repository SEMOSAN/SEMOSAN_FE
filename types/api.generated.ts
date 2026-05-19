// Auto-generated from https://lgenius.site/v3/api-docs
// Run `node scripts/generate-api-types.mjs` to regenerate
// ⚠️ Do not edit manually

// ─────────────────────────────────────────────────────────────────────────────
// Endpoints
// ─────────────────────────────────────────────────────────────────────────────
export const ENDPOINTS = {
  USERS_ONBOARDING: "/api/users/onboarding",
  OAUTH_KAKAO_LOGIN: "/api/oauth/kakao/login",
  OAUTH_APPLE_LOGIN: "/api/oauth/apple/login",
  MOUNTAINS_BY_MOUNTAINID_LIKE: (mountainId: number | string) => `/api/mountains/${mountainId}/like`,
  FCM_TOKENS: "/api/fcm/tokens",
  AUTH_TOKEN_REISSUE: "/api/auth/token/reissue",
  AUTH_TEST_LOGIN: "/api/auth/test/login",
  AUTH_LOGOUT: "/api/auth/logout",
  USERS_PROFILE: "/api/users/profile",
  USERS_NOTIFICATION_SETTINGS_VOICE: "/api/users/notification-settings/voice",
  USERS_NOTIFICATION_SETTINGS_PUSH: "/api/users/notification-settings/push",
  USERS_NOTIFICATION_SETTINGS_LIVE_ACTIVITY: "/api/users/notification-settings/live-activity",
  USERS_NOTIFICATION_SETTINGS: "/api/users/notification-settings",
  USERS_NICKNAME: "/api/users/nickname",
  MOUNTAINS: "/api/mountains",
  MOUNTAINS_BY_MOUNTAINID: (mountainId: number | string) => `/api/mountains/${mountainId}`,
  MOUNTAINS_SEARCH: "/api/mountains/search",
  MOUNTAINS_LIKES: "/api/mountains/likes",
  HIKING_RECORDS_ME: "/api/hiking-records/me",
  HIKING_RECORDS_ME_SUMMARY: "/api/hiking-records/me/summary",
  HIKING_RECORDS_ME_MOUNTAINS: "/api/hiking-records/me/mountains",
  AUTH_WITHDRAW: "/api/auth/withdraw",
  IMAGES_PRESIGNED_URL: "/api/images/presigned-url",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────
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
export type ApiResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: Record<string, unknown>;
};
export type ApiResponseVoid = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: Record<string, unknown>;
};
export type OAuthKakaoLoginRequest = {
  code?: string;
  deviceType: "IOS" | "ANDROID";
};
export type OAuthLoginResponse = {
  userId?: number;
  accessToken?: string;
  refreshToken?: string;
};
export type OAuthAppleLoginRequest = {
  identityToken?: string;
  name?: string;
  deviceType: "IOS" | "ANDROID";
};
export type FcmTokenRegisterRequest = {
  token?: string;
  deviceType: "IOS" | "ANDROID";
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
export type ApiResponseGetUserProfileResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: GetUserProfileResponse;
};
export type GetUserProfileResponse = {
  profileUrl?: string;
  nickname?: string;
  hikingLevel?: "BEGINNER" | "EXPERIENCED" | "HOBBY" | "EXPERT";
  gender?: "MALE" | "FEMALE" | "NONE";
  age?: number;
  birthDate?: string;
  height?: number;
  weight?: number;
  exerciseType?: "GYM" | "HOME_TRAINING" | "PILATES_YOGA" | "WALKING" | "RUNNING" | "HIKING" | "SPORTS" | "CROSSFIT" | "SWIMMING" | "NONE";
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
  imageUrl?: string;
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
export type CourseInfo = {
  courseId?: number;
  name?: string;
  difficulty?: "EASY" | "NORMAL" | "HARD";
  distance?: number;
  duration?: number;
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
  imageUrl?: string;
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
  imageUrl?: string;
};
export type PageResponseLikedMountainResponse = {
  content?: LikedMountainResponse[];
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  last?: boolean;
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
  imageUrl?: string;
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
export type FcmTokenDeleteRequest = {
  token?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Operations (Params / Body / Response)
// ─────────────────────────────────────────────────────────────────────────────
// POST /api/users/onboarding
export type RegisterUserOnboardingBody = RegisterOnboardingRequest;

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

// POST /api/fcm/tokens
export type RegisterBody = FcmTokenRegisterRequest;

// DELETE /api/fcm/tokens
export type DeleteBody = FcmTokenDeleteRequest;

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

// GET /api/users/nickname
export type CheckNicknameParams = {
  nickname: string;
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

// GET /api/mountains/likes
export type GetLikedMountainsParams = {
  page?: number;
  size?: number;
  sort?: string[];
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
