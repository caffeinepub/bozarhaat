import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product } from '../backend';

export function useListProducts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProducts();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetProduct(productId?: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Product | null>({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!actor || !productId) return null;
      return actor.getProduct(productId);
    },
    enabled: !!actor && !actorFetching && !!productId,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: {
      name: string;
      description: string;
      price: bigint;
      inventoryCount: bigint;
      categoryId: string | null;
      fulfillmentType: string;
      sellerId: string | null;
      taxRate: bigint | null;
      shippingCharge: bigint | null;
      sku: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend doesn't implement this yet
      console.warn('Backend missing addProduct() method');
      throw new Error('Product creation not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
