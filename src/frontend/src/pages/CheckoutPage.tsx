import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useGetCart } from '../hooks/useCart';
import { useCheckout } from '../hooks/useOrders';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';
import { navigate } from '../router/useHashRoute';
import { toast } from 'sonner';
import { CreditCard, MapPin } from 'lucide-react';

export default function CheckoutPage() {
  const { data: cart = [] } = useGetCart();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const checkout = useCheckout();

  const [address, setAddress] = useState(userProfile?.shippingAddress || '');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState(userProfile?.phone || '');

  const subtotal = cart.reduce((total, item) => {
    return total + Number(item.product.price) * Number(item.quantity);
  }, 0) / 100;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address || !city || !pincode || !phone) {
      toast.error('Please fill in all delivery details');
      return;
    }

    try {
      await checkout.mutateAsync();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
    }
  };

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-2">Please Login</h2>
        <p className="text-muted-foreground mb-6">You need to be logged in to checkout</p>
        <Button onClick={() => navigate('/')}>Go to Home</Button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some products before checking out</p>
        <Button onClick={() => navigate('/browse')}>Start Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House no., Building name, Street"
                    required
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="123456"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 1234567890"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">
                    Cash on Delivery (COD) available
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pay when you receive your order
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cart.map((item) => {
                    const price = Number(item.product.price) / 100;
                    const itemTotal = price * Number(item.quantity);
                    return (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.product.name} × {Number(item.quantity)}
                        </span>
                        <span className="font-medium">₹{itemTotal.toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{subtotal.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardContent className="pt-0">
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={checkout.isPending}
                >
                  {checkout.isPending ? 'Placing Order...' : 'Place Order'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
