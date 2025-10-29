import productsData from '@/data/products.json';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  subcategory: string;
  stock: number;
  reorderLevel: number;
  description: string;
  sku: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  paymentMethod: string;
  status: 'Processing' | 'Dispatched' | 'Delivered';
  date: string;
}

// Initialize data
export const initializeData = () => {
  if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(productsData));
  }
  if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
  }
  if (!localStorage.getItem('orders')) {
    localStorage.setItem('orders', JSON.stringify([]));
  }
};

// Product operations
export const getProducts = (): Product[] => {
  const products = localStorage.getItem('products');
  return products ? JSON.parse(products) : [];
};

export const getProductById = (id: number): Product | undefined => {
  const products = getProducts();
  return products.find(p => p.id === id);
};

export const updateProductStock = (id: number, newStock: number) => {
  const products = getProducts();
  const updatedProducts = products.map(p => 
    p.id === id ? { ...p, stock: newStock } : p
  );
  localStorage.setItem('products', JSON.stringify(updatedProducts));
};

// Cart operations
export const getCart = (): CartItem[] => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (product: Product, quantity: number = 1) => {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  return cart;
};

export const updateCartItemQuantity = (productId: number, quantity: number) => {
  const cart = getCart();
  const updatedCart = cart.map(item => 
    item.id === productId ? { ...item, quantity } : item
  );
  localStorage.setItem('cart', JSON.stringify(updatedCart));
  return updatedCart;
};

export const removeFromCart = (productId: number) => {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(updatedCart));
  return updatedCart;
};

export const clearCart = () => {
  localStorage.setItem('cart', JSON.stringify([]));
};

// Order operations
export const getOrders = (): Order[] => {
  const orders = localStorage.getItem('orders');
  return orders ? JSON.parse(orders) : [];
};

export const createOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>): Order => {
  const orders = getOrders();
  const newOrder: Order = {
    ...orderData,
    id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    date: new Date().toISOString(),
    status: 'Processing'
  };
  
  // Update stock for each item
  newOrder.items.forEach(item => {
    const product = getProductById(item.id);
    if (product) {
      updateProductStock(item.id, product.stock - item.quantity);
    }
  });
  
  orders.unshift(newOrder);
  localStorage.setItem('orders', JSON.stringify(orders));
  clearCart();
  
  return newOrder;
};

export const updateOrderStatus = (orderId: string, status: Order['status']) => {
  const orders = getOrders();
  const updatedOrders = orders.map(order => 
    order.id === orderId ? { ...order, status } : order
  );
  localStorage.setItem('orders', JSON.stringify(updatedOrders));
  return updatedOrders;
};

export const getOrderById = (orderId: string): Order | undefined => {
  const orders = getOrders();
  return orders.find(order => order.id === orderId);
};

// Reset all data
export const resetData = () => {
  localStorage.setItem('products', JSON.stringify(productsData));
  localStorage.setItem('cart', JSON.stringify([]));
  localStorage.setItem('orders', JSON.stringify([]));
};
