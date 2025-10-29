import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Home, Package, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { getCart } from '@/lib/localStorage';
import { useState, useEffect } from 'react';

export function Navbar() {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = getCart();
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    };
    
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/cart', label: 'Cart', icon: ShoppingCart, badge: cartCount },
    { path: '/orders', label: 'Orders', icon: User },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">L</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none">Lepakshi</span>
            <span className="text-xs text-muted-foreground">Handicrafts</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(({ path, label, icon: Icon, badge }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary relative ${
                isActive(path) ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
              {badge && badge > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 min-w-5 px-1">
                  {badge}
                </Badge>
              )}
            </Link>
          ))}
          <Link to="/warehouse">
            <Button variant="outline" size="sm">
              Warehouse
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <div className="flex flex-col gap-4 mt-8">
              {navLinks.map(({ path, label, icon: Icon, badge }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 text-base font-medium transition-colors hover:text-primary p-2 rounded-lg ${
                    isActive(path) ? 'bg-secondary text-primary' : 'text-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                  {badge && badge > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {badge}
                    </Badge>
                  )}
                </Link>
              ))}
              <Link
                to="/warehouse"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 text-base font-medium text-foreground hover:text-primary p-2 rounded-lg"
              >
                <Package className="h-5 w-5" />
                Warehouse
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
