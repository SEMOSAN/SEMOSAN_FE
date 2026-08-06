import { getLikedMountains, LIKES_KEY } from './use-mountain-bookmark';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export function useSavedMountains() {
  return useQuery({
    queryKey: LIKES_KEY,
    queryFn: getLikedMountains,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePrefetchSavedMountains() {
  const queryClient = useQueryClient();
  return useCallback(
    () =>
      queryClient.prefetchQuery({
        queryKey: LIKES_KEY,
        queryFn: getLikedMountains,
        staleTime: 5 * 60 * 1000,
      }),
    [queryClient],
  );
}
