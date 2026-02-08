import { useHashRoute } from '../router/useHashRoute';
import { useGetOrder, useCancelOrder } from '../hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { navigate } from '../router/useHashRoute';
import { toast } from 'sonner';
import { Package, ArrowLeft, X } from 'lucide-react';
import { OrderStatus } from '../types/stubs';

export default function OrderDetailsPage() {
  const { params } = useHashRoute();
  const orderId = params.id ? parseInt(params.id) : undefined;
  const { data: order, isLoading } = useGetOrder(orderId);
  const cancelOrder = useCancelOrder();

  const handleCancelOrder = async () => {
    if (!orderId) return;
    
    try {
      await cancelOrder.mutateAsync(orderId);
      toast.success('Order cancelled successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel order');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist</p>
        <Button onClick={() => navigate('/orders')}>View All Orders</Button>
      </div>
    );
  }

  const getStatusVariant = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return 'secondary';
      case OrderStatus.Confirmed:
        return 'default';
      case OrderStatus.Shipped:
        return 'default';
      case OrderStatus.Delivered:
        return 'default';
      case OrderStatus.Cancelled:
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const canCancel = order.status === OrderStatus.Pending;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate('/orders')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Orders
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order #{order.id}
                </CardTitle>
                <Badge variant={getStatusVariant(order.status)}>
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.products.map((product, index) => (
                <div key={product.id} className="flex gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm">
                        Quantity: {order.quantities[index]?.toString() || '0'}
                      </span>
                      <span className="font-semibold">
                        ₹{(Number(product.price) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {order.shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{order.shippingAddress}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{(Number(order.totalPrice) / 100).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{(Number(order.totalPrice) / 100).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {canCancel && (
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleCancelOrder}
              disabled={cancelOrder.isPending}
            >
              <X className="h-4 w-4 mr-2" />
              {cancelOrder.isPending ? 'Cancelling...' : 'Cancel Order'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
