import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

export function useIsAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor || !identity) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error: any) {
        console.error('Error checking admin status:', error);
        return false;
      }
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isAdmin: query.data ?? false,
  };
}
