import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product, addToCart } from '@/lib/localStorage';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock > 0) {
      addToCart(product, 1);
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success(`${product.name} added to cart`);
    } else {
      toast.error('Product out of stock');
    }
  };

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="overflow-hidden product-card-hover group h-full flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-secondary/20">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {product.stock <= product.reorderLevel && product.stock > 0 && (
            <Badge className="absolute top-2 left-2" variant="secondary">
              Low Stock
            </Badge>
          )}
          {product.stock === 0 && (
            <Badge className="absolute top-2 left-2" variant="destructive">
              Out of Stock
            </Badge>
          )}
          <div className="absolute top-2 right-2">
            <span className="heritage-badge">Handcrafted</span>
          </div>
        </div>
        
        <CardContent className="flex-1 p-4">
          <div className="mb-1 text-xs text-muted-foreground">{product.subcategory}</div>
          <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.name}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">₹{product.price.toLocaleString()}</span>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full" 
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
