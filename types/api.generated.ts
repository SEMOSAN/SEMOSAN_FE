// Auto-generated from https://lgenius.site/v3/api-docs
// Run `node scripts/generate-api-types.mjs` to regenerate
// ⚠️ Do not edit manually

// ─────────────────────────────────────────────────────────────────────────────
// Endpoints
// ─────────────────────────────────────────────────────────────────────────────
export const ENDPOINTS = {
  OAUTH_KAKAO_LOGIN: "/api/oauth/kakao/login",
  OAUTH_APPLE_LOGIN: "/api/oauth/apple/login",
  FCM_TOKENS: "/api/fcm/tokens",
  AUTH_TOKEN_REISSUE: "/api/auth/token/reissue",
  AUTH_TEST_LOGIN: "/api/auth/test/login",
  MOUNTAINS: "/api/mountains",
  MOUNTAINS_BY_MOUNTAINID: "/api/mountains/{mountainId}",
  MOUNTAINS_SEARCH: "/api/mountains/search",
  AUTH_WITHDRAW: "/api/auth/withdraw",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────
export type OAuthKakaoLoginRequest = {
  code?: string;
  deviceType: "IOS" | "ANDROID";
};
export type OAuthLoginResponse = {
  userId?: number;
  accessToken?: string;
  refreshToken?: string;
};
export type ApiResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: Record<string, unknown>;
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
export type ApiResponseVoid = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  data?: Record<string, unknown>;
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
  amenities?: Record<string, unknown>;
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
  publicTransport?: Record<string, unknown>;
  parking?: Record<string, unknown>;
};
export type TransportationItem = {
  transportationId?: number;
  type?: "SUBWAY" | "BUS" | "PARKING";
  name?: string;
  description?: string;
};
export type FcmTokenDeleteRequest = {
  token?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Operations (Params / Body / Response)
// ─────────────────────────────────────────────────────────────────────────────
// POST /api/oauth/kakao/login
export type KakaoLoginBody = OAuthKakaoLoginRequest;

// POST /api/oauth/apple/login
export type AppleLoginBody = OAuthAppleLoginRequest;

// POST /api/fcm/tokens
export type RegisterBody = FcmTokenRegisterRequest;

// DELETE /api/fcm/tokens
export type DeleteBody = FcmTokenDeleteRequest;

// POST /api/auth/test/login
export type LoginBody = LoginRequest;

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
