import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetProduct } from '../hooks/useProducts';
import { useAddToCart } from '../hooks/useCart';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { navigate } from '../router/useHashRoute';
import { toast } from 'sonner';
import { ShoppingCart, Star, Truck, Shield, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import QuantityControl from '../components/QuantityControl';

interface ProductDetailsPageProps {
  productId?: number;
}

export default function ProductDetailsPage({ productId }: ProductDetailsPageProps) {
  const { data: product, isLoading } = useGetProduct(productId);
  const addToCart = useAddToCart();
  const { identity } = useInternetIdentity();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-32 bg-muted rounded"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-12 bg-muted rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Button onClick={() => navigate('/browse')}>Browse Products</Button>
      </div>
    );
  }

  const price = Number(product.price) / 100;
  const isOutOfStock = Number(product.inventoryCount) === 0;
  const maxQuantity = Math.min(Number(product.inventoryCount), 10);

  const handleAddToCart = async () => {
    if (!identity) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await addToCart.mutateAsync({ productId: product.id, quantity: BigInt(quantity) });
      toast.success(`Added ${quantity} item(s) to cart!`);
      setQuantity(1);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate('/browse')}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div>
          <div className="aspect-square bg-muted rounded-lg flex items-center justify-center sticky top-24">
            <div className="text-9xl">📦</div>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < 4 ? 'fill-amber-400 text-amber-400' : 'text-muted'}`}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">(120 reviews)</span>
              </div>
            </div>
            {product.categoryId && (
              <Badge variant="secondary">{product.categoryId}</Badge>
            )}
          </div>

          <Separator />

          <div>
            <div className="text-4xl font-bold text-primary mb-2">₹{price.toFixed(2)}</div>
            {product.taxRate && (
              <p className="text-sm text-muted-foreground">
                Inclusive of all taxes
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-5 w-5 text-primary" />
              <span>Free delivery on orders above ₹500</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-5 w-5 text-primary" />
              <span>Secure payments & buyer protection</span>
            </div>
            <div className="text-sm">
              <span className={isOutOfStock ? 'text-destructive' : 'text-green-600'}>
                {isOutOfStock ? 'Out of Stock' : `${product.inventoryCount} items in stock`}
              </span>
            </div>
          </div>

          <Separator />

          {!isOutOfStock && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Quantity</label>
                <QuantityControl
                  quantity={quantity}
                  onIncrease={() => setQuantity(q => Math.min(q + 1, maxQuantity))}
                  onDecrease={() => setQuantity(q => Math.max(q - 1, 1))}
                  max={maxQuantity}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={addToCart.isPending}
                  className="flex-1 gap-2"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/cart')}
                  size="lg"
                >
                  View Cart
                </Button>
              </div>
            </div>
          )}

          <Separator />

          <div>
            <h2 className="text-xl font-semibold mb-3">Product Description</h2>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {product.sku && (
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">SKU:</span>
                    <span className="ml-2 font-medium">{product.sku}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fulfillment:</span>
                    <span className="ml-2 font-medium">{product.fulfillmentType}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
