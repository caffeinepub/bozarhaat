import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile, BuyerProfile, SellerProfile, DeliveryPartnerProfile } from '../types/stubs';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor || !identity) return null;
      // Backend doesn't implement this yet - return null
      console.warn('Backend missing getCallerUserProfile() method');
      return null;
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      // Backend doesn't implement this yet
      console.warn('Backend missing saveCallerUserProfile() method');
      throw new Error('Profile management not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useRegisterBuyerProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: BuyerProfile) => {
      if (!actor) throw new Error('Actor not available');
      // Backend doesn't implement this yet
      console.warn('Backend missing registerBuyerProfile() method');
      throw new Error('Buyer registration not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useRegisterSellerProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: SellerProfile) => {
      if (!actor) throw new Error('Actor not available');
      // Backend doesn't implement this yet
      console.warn('Backend missing registerSellerProfile() method');
      throw new Error('Seller registration not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useRegisterDeliveryPartnerProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: DeliveryPartnerProfile) => {
      if (!actor) throw new Error('Actor not available');
      // Backend doesn't implement this yet
      console.warn('Backend missing registerDeliveryPartnerProfile() method');
      throw new Error('Delivery partner registration not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
