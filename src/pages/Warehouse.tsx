import { useState, useEffect } from 'react';
import { getProducts, getOrders, updateOrderStatus, resetData, Product, Order } from '@/lib/localStorage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, TrendingDown, RefreshCw, Truck, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function Warehouse() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const productsData = getProducts();
    const ordersData = getOrders();
    
    setProducts(productsData);
    setOrders(ordersData);
    
    const lowStock = productsData.filter(p => p.stock <= p.reorderLevel);
    setLowStockProducts(lowStock);
  };

  const handleDispatch = (orderId: string) => {
    updateOrderStatus(orderId, 'Dispatched');
    loadData();
    toast.success('Order marked as dispatched');
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all data to demo values?')) {
      resetData();
      loadData();
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success('All data has been reset');
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'Processing');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Warehouse Dashboard</h1>
            <p className="text-muted-foreground">Manage inventory and dispatch orders</p>
          </div>
          <Button variant="outline" onClick={handleResetData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Demo Data
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Products</span>
              <Package className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{products.length}</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Low Stock Items</span>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </div>
            <p className="text-2xl font-bold text-destructive">{lowStockProducts.length}</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Pending Orders</span>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-yellow-600">{pendingOrders.length}</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Orders</span>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{orders.length}</p>
          </Card>
        </div>

        <Tabs defaultValue="inventory" className="space-y-4">
          <TabsList>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="orders">Pending Orders</TabsTrigger>
            <TabsTrigger value="alerts">Low Stock Alerts</TabsTrigger>
          </TabsList>

          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Available Stock</TableHead>
                    <TableHead className="text-right">Reorder Level</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map(product => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-right">{product.stock}</TableCell>
                      <TableCell className="text-right">{product.reorderLevel}</TableCell>
                      <TableCell>
                        {product.stock === 0 ? (
                          <Badge variant="destructive">Out of Stock</Badge>
                        ) : product.stock <= product.reorderLevel ? (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                            Low Stock
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            In Stock
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Pending Orders Tab */}
          <TabsContent value="orders">
            <Card className="p-6">
              {pendingOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Truck className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No pending orders</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingOrders.map(order => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">Order #{order.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} items • ₹{order.total.toLocaleString()}
                          </p>
                        </div>
                        <Button size="sm" onClick={() => handleDispatch(order.id)}>
                          <Truck className="mr-2 h-4 w-4" />
                          Mark as Dispatched
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {order.items.map(item => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.name}</span>
                            <span className="text-muted-foreground">Qty: {item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm">
                          <span className="text-muted-foreground">Deliver to:</span> {order.customerName}
                        </p>
                        <p className="text-sm text-muted-foreground">{order.customerAddress}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Low Stock Alerts Tab */}
          <TabsContent value="alerts">
            <Card className="p-6">
              {lowStockProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">All products are sufficiently stocked</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm font-medium">
                      {lowStockProducts.length} product{lowStockProducts.length > 1 ? 's' : ''} need reordering
                    </span>
                  </div>

                  {lowStockProducts.map(product => (
                    <div key={product.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className="h-16 w-16 rounded-lg overflow-hidden bg-secondary/20 flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">{product.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">SKU: {product.sku}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span>
                                Current Stock: <span className="font-semibold text-destructive">{product.stock}</span>
                              </span>
                              <span className="text-muted-foreground">•</span>
                              <span>
                                Reorder Level: <span className="font-semibold">{product.reorderLevel}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="destructive">
                          {product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
