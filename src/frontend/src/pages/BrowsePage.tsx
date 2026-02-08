import { useState, useMemo, useEffect } from 'react';
import { useHashRoute } from '../router/useHashRoute';
import ProductGrid from '../components/ProductGrid';
import { useListProducts } from '../hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SUSTAINABLE_LIVING_CATEGORIES, getCategoryName } from '../constants/sustainableLivingCategories';

export default function BrowsePage() {
  const { query } = useHashRoute();
  const { data: products = [], isLoading } = useListProducts();
  
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Initialize category from query parameter
  useEffect(() => {
    if (query.category) {
      const categoryExists = SUSTAINABLE_LIVING_CATEGORIES.some(cat => cat.id === query.category);
      if (categoryExists) {
        setSelectedCategory(query.category);
      }
    }
  }, [query.category]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by search query
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.categoryId === selectedCategory);
    }

    // Filter by price range
    filtered = filtered.filter(p => {
      const price = Number(p.price) / 100;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // featured - keep original order
        break;
    }

    return filtered;
  }, [products, query.search, selectedCategory, priceRange, sortBy]);

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold mb-3 block">Category</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {SUSTAINABLE_LIVING_CATEGORIES.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.emoji} {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-base font-semibold mb-3 block">
          Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
        </Label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={10000}
          step={100}
          className="mt-2"
        />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {query.search ? `Search results for "${query.search}"` : 'Browse Products'}
        </h1>
        <p className="text-muted-foreground">
          {filteredAndSortedProducts.length} products found
          {selectedCategory !== 'all' && ` in ${getCategoryName(selectedCategory)}`}
        </p>
      </div>

      <div className="flex gap-6">
        {/* Filters - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FilterPanel />
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Sort and Mobile Filter */}
          <div className="flex items-center justify-between mb-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="mt-8">
                  <FilterPanel />
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2 ml-auto">
              <Label className="text-sm text-muted-foreground">Sort by:</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          <ProductGrid products={filteredAndSortedProducts} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
