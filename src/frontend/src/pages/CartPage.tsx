import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetCart, useRemoveFromCart, useAddToCart } from '../hooks/useCart';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { navigate } from '../router/useHashRoute';
import { toast } from 'sonner';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import QuantityControl from '../components/QuantityControl';

export default function CartPage() {
  const { data: cart = [], isLoading } = useGetCart();
  const { identity } = useInternetIdentity();
  const removeFromCart = useRemoveFromCart();
  const addToCart = useAddToCart();

  const subtotal = cart.reduce((total, item) => {
    return total + Number(item.product.price) * Number(item.quantity);
  }, 0) / 100;

  const handleRemove = async (productId: number) => {
    try {
      await removeFromCart.mutateAsync(productId);
      toast.success('Item removed from cart');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove item');
    }
  };

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    try {
      // Remove the item first
      await removeFromCart.mutateAsync(productId);
      // Add it back with new quantity
      await addToCart.mutateAsync({ productId, quantity: BigInt(newQuantity) });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update quantity');
    }
  };

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Please Login</h2>
        <p className="text-muted-foreground mb-6">You need to be logged in to view your cart</p>
        <Button onClick={() => navigate('/')}>Go to Home</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some products to get started</p>
        <Button onClick={() => navigate('/browse')} className="gap-2">
          Start Shopping
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const price = Number(item.product.price) / 100;
            const itemTotal = price * Number(item.quantity);

            return (
              <Card key={item.product.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-3xl">📦</div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-semibold mb-1 cursor-pointer hover:text-primary transition-colors"
                        onClick={() => navigate('/product', { id: item.product.id.toString() })}
                      >
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {item.product.description}
                      </p>
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-lg font-bold text-primary">₹{price.toFixed(2)}</div>
                        <QuantityControl
                          quantity={Number(item.quantity)}
                          onIncrease={() => handleQuantityChange(item.product.id, Number(item.quantity) + 1)}
                          onDecrease={() => handleQuantityChange(item.product.id, Number(item.quantity) - 1)}
                          max={Number(item.product.inventoryCount)}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(item.product.id)}
                        disabled={removeFromCart.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                      <div className="text-lg font-bold">₹{itemTotal.toFixed(2)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal ({cart.length} items)</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-green-600">FREE</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">₹{subtotal.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => navigate('/checkout')}
                className="w-full gap-2"
                size="lg"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
