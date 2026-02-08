import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star } from 'lucide-react';
import { navigate } from '../router/useHashRoute';
import { useAddToCart } from '../hooks/useCart';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import type { Product } from '../backend';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useAddToCart();
  const { identity } = useInternetIdentity();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!identity) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await addToCart.mutateAsync({ productId: product.id, quantity: BigInt(1) });
      toast.success('Added to cart!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  const isOutOfStock = Number(product.inventoryCount) === 0;
  const price = Number(product.price) / 100; // Convert from smallest unit

  return (
    <Card
      className="group cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={() => navigate('/product', { id: product.id.toString() })}
    >
      <CardContent className="p-4">
        {/* Product Image Placeholder */}
        <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center overflow-hidden">
          <div className="text-muted-foreground text-4xl">📦</div>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span>4.5</span>
            <span className="ml-1">(120)</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-primary">₹{price.toFixed(2)}</span>
          </div>

          {product.categoryId && (
            <Badge variant="secondary" className="text-xs">
              {product.categoryId}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || addToCart.isPending}
          className="w-full gap-2"
          size="sm"
        >
          {isOutOfStock ? (
            'Out of Stock'
          ) : addToCart.isPending ? (
            'Adding...'
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
