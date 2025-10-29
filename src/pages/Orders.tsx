import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, Order } from '@/lib/localStorage';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Eye, ShoppingBag } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'Dispatched':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'Delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-4">
          <Package className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Orders Yet</h2>
          <p className="text-muted-foreground mb-6">
            You haven't placed any orders yet. Start shopping to see your order history here.
          </p>
          <Link to="/products">
            <Button size="lg">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Placed on {new Date(order.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="font-bold text-xl text-primary">₹{order.total.toLocaleString()}</p>
                  </div>
                  <Link to={`/order-confirmation/${order.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {order.items.slice(0, 4).map(item => (
                    <div key={item.id} className="flex-shrink-0">
                      <div className="h-16 w-16 rounded-lg overflow-hidden bg-secondary/20">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="h-16 w-16 rounded-lg bg-secondary/50 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium">+{order.items.length - 4}</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  {order.items.length} item{order.items.length > 1 ? 's' : ''} • {order.paymentMethod.toUpperCase()}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
