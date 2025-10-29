import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { getProducts } from '@/lib/localStorage';
import { ArrowRight, Award, Shield, Truck } from 'lucide-react';
import heroBanner from '@/assets/hero-banner.jpg';
import categoryTextiles from '@/assets/category-textiles.jpg';
import categoryMetal from '@/assets/category-metal.jpg';
import categoryWood from '@/assets/category-wood.jpg';
import categoryFiber from '@/assets/category-fiber.jpg';
import patternBg from '@/assets/pattern-bg.jpg';

export default function Home() {
  const products = getProducts();
  const featuredProducts = products.slice(0, 8);
  
  const categories = [
    { name: 'Textile Weaves', image: categoryTextiles, count: products.filter(p => p.category === 'Textile Weaves').length },
    { name: 'Metal Crafts', image: categoryMetal, count: products.filter(p => p.category === 'Metal Crafts').length },
    { name: 'Wood Crafts', image: categoryWood, count: products.filter(p => p.category === 'Wood Crafts').length },
    { name: 'Natural Fibers', image: categoryFiber, count: products.filter(p => p.category === 'Natural Fibers').length },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative text-primary-foreground overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <img 
            src={heroBanner} 
            alt="Traditional Indian Handicrafts" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70"></div>
        </div>
        
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl animate-fade-in">
            <div className="mb-4 flex gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-accent text-accent-foreground border border-accent/20">
                <Award className="h-3 w-3" />
                Authentic Handicrafts
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-accent text-accent-foreground border border-accent/20">
                Made in Andhra Pradesh
              </span>
            </div>
            
            <h1 className="mb-6 text-4xl md:text-6xl font-bold leading-tight">
              Experience the Art of<br />
              <span className="text-accent">Andhra Pradesh</span>
            </h1>
            
            <p className="mb-8 text-lg md:text-xl text-primary-foreground/90 max-w-2xl">
              Discover authentic handcrafted treasures from skilled artisans. Each piece tells a story of tradition, culture, and craftsmanship passed down through generations.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="lg" variant="secondary" className="group">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/products?category=Textile Weaves">
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                  Explore Kalamkari
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-b bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">100% Authentic</h3>
                <p className="text-sm text-muted-foreground">Government certified handicrafts</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Artisan Direct</h3>
                <p className="text-sm text-muted-foreground">Supporting local craftsmen</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Truck className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Secure Delivery</h3>
                <p className="text-sm text-muted-foreground">Safe packaging & tracking</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our diverse collection of traditional handicrafts from Andhra Pradesh
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="group"
              >
                <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary/20 product-card-hover">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                    <h3 className="font-semibold text-white mb-1">{category.name}</h3>
                    <p className="text-xs text-white/80">{category.count} Products</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Collection</h2>
              <p className="text-muted-foreground">Handpicked treasures from our artisans</p>
            </div>
            <Link to="/products">
              <Button variant="outline" className="hidden md:flex">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/products">
              <Button variant="outline" className="w-full">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src={patternBg} 
            alt="Pattern Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Support Traditional Artisans
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Every purchase helps preserve centuries-old craftsmanship and supports the livelihoods of skilled artisans across Andhra Pradesh
          </p>
          <Link to="/products">
            <Button size="lg">
              Start Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
