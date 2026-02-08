import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { CartItem } from '../types/stubs';

export function useGetCart() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<CartItem[]>({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!actor || !identity) return [];
      // Backend doesn't implement this yet - return empty array
      console.warn('Backend missing getCart() method');
      return [];
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useAddToCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number; quantity: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend doesn't implement this yet
      console.warn('Backend missing addToCart() method');
      throw new Error('Cart functionality not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useRemoveFromCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: number) => {
      if (!actor) throw new Error('Actor not available');
      // Backend doesn't implement this yet
      console.warn('Backend missing removeFromCart() method');
      throw new Error('Cart functionality not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useClearCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend doesn't implement this yet
      console.warn('Backend missing clearCart() method');
      throw new Error('Cart functionality not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useCartSubtotal() {
  const { data: cart = [] } = useGetCart();
  
  return cart.reduce((total, item) => {
    return total + Number(item.product.price) * Number(item.quantity);
  }, 0);
}
