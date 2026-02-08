import { Button } from '@/components/ui/button';
import ProductGrid from '../components/ProductGrid';
import { navigate } from '../router/useHashRoute';
import { useListProducts } from '../hooks/useProducts';
import { ArrowRight } from 'lucide-react';
import { SUSTAINABLE_LIVING_CATEGORIES } from '../constants/sustainableLivingCategories';

export default function HomePage() {
  const { data: products = [], isLoading } = useListProducts();

  const featuredProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Welcome to <span className="text-primary">Bozarhaat</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Your trusted marketplace for quality products. Shop from thousands of items with fast delivery and secure payments.
              </p>
              <p className="text-xl font-medium text-primary/90">
                Simple • Sustainable • Practical for Everyday Life
              </p>
              <div className="flex gap-4">
                <Button size="lg" onClick={() => navigate('/browse')} className="gap-2">
                  Start Shopping
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/bozarhaat-hero.dim_1600x600.png"
                alt="Bozarhaat Marketplace"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {SUSTAINABLE_LIVING_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => navigate('/browse', { category: category.id })}
                className="bg-card hover:bg-accent transition-colors rounded-xl p-6 text-center group border border-border"
              >
                <div className="text-5xl mb-3">{category.emoji}</div>
                <h3 className="font-semibold group-hover:text-primary transition-colors text-sm">
                  {category.name}
                </h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Button variant="outline" onClick={() => navigate('/browse')} className="gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <ProductGrid products={featuredProducts} isLoading={isLoading} />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="text-5xl">🚚</div>
              <h3 className="text-xl font-semibold">Fast Delivery</h3>
              <p className="text-muted-foreground">Get your orders delivered quickly and safely</p>
            </div>
            <div className="text-center space-y-3">
              <div className="text-5xl">🔒</div>
              <h3 className="text-xl font-semibold">Secure Payments</h3>
              <p className="text-muted-foreground">Shop with confidence using secure payment methods</p>
            </div>
            <div className="text-center space-y-3">
              <div className="text-5xl">💯</div>
              <h3 className="text-xl font-semibold">Quality Products</h3>
              <p className="text-muted-foreground">Only the best products from trusted sellers</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
