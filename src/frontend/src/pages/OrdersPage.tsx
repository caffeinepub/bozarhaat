import { useListOrders } from '../hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { navigate } from '../router/useHashRoute';
import { Package, ShoppingBag } from 'lucide-react';
import { OrderStatus } from '../types/stubs';

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useListOrders();

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

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">No Orders Yet</h2>
        <p className="text-muted-foreground mb-6">
          You haven't placed any orders. Start shopping to see your orders here.
        </p>
        <Button onClick={() => navigate('/browse')}>Start Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">View and manage your orders</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5" />
                  Order #{order.id}
                </CardTitle>
                <Badge variant={getStatusVariant(order.status)}>
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {order.products.length} item(s)
                  </p>
                  <p className="font-semibold">
                    Total: ₹{(Number(order.totalPrice) / 100).toFixed(2)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
