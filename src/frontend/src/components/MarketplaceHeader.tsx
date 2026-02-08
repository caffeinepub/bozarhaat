import { ShoppingCart, Search, User, Menu, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { navigate } from '../router/useHashRoute';
import { useGetCart } from '../hooks/useCart';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';
import AuthButton from './AuthButton';
import { useState } from 'react';
import { SUSTAINABLE_LIVING_CATEGORIES } from '../constants/sustainableLivingCategories';

export default function MarketplaceHeader() {
  const { data: cart = [] } = useGetCart();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemCount = cart.reduce((total, item) => total + Number(item.quantity), 0);
  const isAuthenticated = !!identity;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/browse', { search: searchQuery });
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      {/* Top bar */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img
              src="/assets/generated/bozarhaat-logo.dim_512x192.png"
              alt="Bozarhaat"
              className="h-10 w-auto"
            />
          </button>

          {/* Search bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 h-11 bg-background"
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 h-11"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* User Guide - Desktop */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/user-guide')}
              className="hidden lg:flex items-center gap-2"
            >
              <BookOpen className="h-5 w-5" />
              <span className="text-sm">User Guide</span>
            </Button>

            {/* Account */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/account')}
              className="hidden sm:flex items-center gap-2"
            >
              <User className="h-5 w-5" />
              <span className="text-sm">
                {isAuthenticated ? (userProfile?.name || 'Account') : 'Sign In'}
              </span>
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/cart')}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* Auth Button */}
            <AuthButton />

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <nav className="flex flex-col gap-4 mt-8">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/user-guide')}
                    className="justify-start"
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    User Guide
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/account')}
                    className="justify-start"
                  >
                    <User className="h-5 w-5 mr-2" />
                    {isAuthenticated ? (userProfile?.name || 'Account') : 'Sign In'}
                  </Button>
                  {SUSTAINABLE_LIVING_CATEGORIES.map((category) => (
                    <Button
                      key={category.id}
                      variant="ghost"
                      onClick={() => navigate('/browse', { category: category.id })}
                      className="justify-start"
                    >
                      <span className="mr-2">{category.emoji}</span>
                      {category.name}
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Search bar - Mobile */}
        <form onSubmit={handleSearch} className="md:hidden mt-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 bg-background"
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>

      {/* Categories bar - Desktop */}
      <div className="hidden md:block border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-2 overflow-x-auto">
            {SUSTAINABLE_LIVING_CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                size="sm"
                onClick={() => navigate('/browse', { category: category.id })}
                className="whitespace-nowrap"
              >
                <span className="mr-1.5">{category.emoji}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
