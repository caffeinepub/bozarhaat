import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Order } from '../types/stubs';

export function useListOrders() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      if (!actor || !identity) return [];
      // Backend doesn't implement this yet - return empty array
      console.warn('Backend missing listOrders() method');
      return [];
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useGetOrder(orderId?: number) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Order | null>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!actor || !orderId || !identity) return null;
      // Backend doesn't implement this yet - return null
      console.warn('Backend missing getOrder() method');
      return null;
    },
    enabled: !!actor && !actorFetching && !!orderId && !!identity,
  });
}

export function useCheckout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend doesn't implement this yet
      console.warn('Backend missing checkout() method');
      throw new Error('Checkout functionality not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useCancelOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: number) => {
      if (!actor) throw new Error('Actor not available');
      // Backend doesn't implement this yet
      console.warn('Backend missing cancelOrder() method');
      throw new Error('Order cancellation not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
