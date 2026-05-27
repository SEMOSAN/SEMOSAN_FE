import { api } from '@/lib/api';
import { ENDPOINTS } from '@/types/api.generated';
import {
  TrackingPhotoUploadRequest,
  TrackingPhotoResponse,
  ENDPOINTS_EXTENSIONS,
} from '@/types/api.extensions';
import { useMutation } from '@tanstack/react-query';

export function useSaveTrackingPhoto() {
  return useMutation({
    mutationFn: async ({
      sessionId,
      body,
    }: {
      sessionId: number;
      body: TrackingPhotoUploadRequest;
    }): Promise<TrackingPhotoResponse> => {
      const res = await api.post<TrackingPhotoResponse>({
        path: ENDPOINTS_EXTENSIONS.TRACKING_SESSIONS_BY_SESSIONID_PHOTOS(sessionId),
        body: body as unknown as Record<string, unknown>,
      });
      return res.data;
    },
  });
}
