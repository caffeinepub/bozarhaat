import { useEffect } from 'react';
import { useHashRoute } from './router/useHashRoute';
import MarketplaceHeader from './components/MarketplaceHeader';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import AccountPage from './pages/AccountPage';
import SellerPortalPage from './pages/SellerPortalPage';
import DeliveryPartnerOnboardingPage from './pages/DeliveryPartnerOnboardingPage';
import CompanyAccountPage from './pages/CompanyAccountPage';
import UserGuidePage from './pages/UserGuidePage';
import OnboardingModal from './components/OnboardingModal';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useUserProfile';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  const { route, params } = useHashRoute();
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showOnboarding = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Render the appropriate page based on route
  const renderPage = () => {
    switch (route) {
      case '/':
        return <HomePage />;
      case '/browse':
        return <BrowsePage />;
      case '/product':
        return <ProductDetailsPage productId={params.id ? Number(params.id) : undefined} />;
      case '/cart':
        return <CartPage />;
      case '/checkout':
        return <CheckoutPage />;
      case '/orders':
        return params.id ? <OrderDetailsPage /> : <OrdersPage />;
      case '/account':
        return <AccountPage />;
      case '/seller':
        return <SellerPortalPage />;
      case '/delivery-partner':
        return <DeliveryPartnerOnboardingPage />;
      case '/company-account':
        return <CompanyAccountPage />;
      case '/user-guide':
        return <UserGuidePage />;
      default:
        return <HomePage />;
    }
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Bozarhaat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MarketplaceHeader />
      <main className="flex-1">
        {renderPage()}
      </main>
      <footer className="bg-card border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 bozarhaat.com. Built with ❤️ using <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">caffeine.ai</a></p>
        </div>
      </footer>
      {showOnboarding && <OnboardingModal />}
      <Toaster />
    </div>
  );
}
