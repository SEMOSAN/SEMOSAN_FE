import { getLikedMountains, LIKES_KEY } from './use-mountain-bookmark';
import { useQuery } from '@tanstack/react-query';

export function useSavedMountains() {
  return useQuery({
    queryKey: LIKES_KEY,
    queryFn: getLikedMountains,
  });
}
