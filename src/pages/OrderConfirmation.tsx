import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getOrderById, updateOrderStatus, Order } from '@/lib/localStorage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Package, Truck, Home, ArrowRight } from 'lucide-react';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      const orderData = getOrderById(orderId);
      setOrder(orderData || null);
    }
  }, [orderId]);

  const handleUpdateStatus = (newStatus: Order['status']) => {
    if (order) {
      updateOrderStatus(order.id, newStatus);
      setOrder({ ...order, status: newStatus });
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Order not found</p>
          <Link to="/orders">
            <Button variant="outline">View All Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusSteps = [
    { status: 'Processing', icon: Package, label: 'Processing' },
    { status: 'Dispatched', icon: Truck, label: 'Dispatched' },
    { status: 'Delivered', icon: Home, label: 'Delivered' },
  ];

  const currentStepIndex = statusSteps.findIndex(step => step.status === order.status);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 mb-4">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your order. Your order ID is{' '}
              <span className="font-mono font-semibold text-primary">{order.id}</span>
            </p>
          </div>

          {/* Order Status */}
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6">Order Status</h2>
            
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-6 left-6 right-6 h-0.5 bg-border">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                />
              </div>

              {/* Status Steps */}
              <div className="relative flex justify-between">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index <= currentStepIndex;
                  
                  return (
                    <div key={step.status} className="flex flex-col items-center">
                      <div
                        className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors ${
                          isCompleted
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'bg-background border-border text-muted-foreground'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className={`mt-2 text-sm font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status Update Buttons (Demo) */}
            {order.status !== 'Delivered' && (
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-3">Simulate status update:</p>
                <div className="flex gap-2">
                  {order.status === 'Processing' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus('Dispatched')}
                    >
                      Mark as Dispatched
                    </Button>
                  )}
                  {order.status === 'Dispatched' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus('Delivered')}
                    >
                      Mark as Delivered
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* Order Details */}
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            
            <div className="space-y-4">
              {order.items.map(item => (
                <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="h-16 w-16 rounded-lg overflow-hidden bg-secondary/20 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium mb-1 line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}

              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{(order.total / 1.18).toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (GST 18%)</span>
                  <span>₹{(order.total - order.total / 1.18).toFixed(0)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-xl text-primary">₹{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Customer Details */}
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <span className="ml-2 font-medium">{order.customerName}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Phone:</span>
                <span className="ml-2 font-medium">{order.customerPhone}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Address:</span>
                <p className="mt-1 font-medium">{order.customerAddress}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="ml-2 font-medium capitalize">{order.paymentMethod}</span>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Link to="/products" className="flex-1">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
            <Link to="/orders" className="flex-1">
              <Button className="w-full">
                View All Orders
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
