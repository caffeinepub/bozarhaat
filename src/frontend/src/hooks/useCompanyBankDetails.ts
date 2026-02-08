import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { BankDetails } from '../types/stubs';

export function useGetCompanyBankDetails() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<BankDetails | null>({
    queryKey: ['companyBankDetails'],
    queryFn: async () => {
      if (!actor) return null;
      // Backend doesn't implement this yet - return null
      console.warn('Backend missing getCompanyBankDetails() method');
      return null;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useUpdateCompanyBankDetails() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (details: BankDetails) => {
      if (!actor) throw new Error('Actor not available');
      // Backend doesn't implement this yet
      console.warn('Backend missing updateCompanyBankDetails() method');
      throw new Error('Company bank details management not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyBankDetails'] });
    },
  });
}
