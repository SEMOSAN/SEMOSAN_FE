// Temporary stubs — delete once backend adds these endpoints and rerun:
// node scripts/generate-api-types.mjs

export const ENDPOINTS_EXTENSIONS = {
  TRACKING_SESSIONS_BY_SESSIONID_PHOTOS: (sessionId: number | string) =>
    `/api/tracking/sessions/${sessionId}/photos`,
} as const;
