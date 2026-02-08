import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Store, Search, ShoppingCart, Package, CreditCard, Plus, Upload, TrendingUp, Shield, Building2, Lock, Settings } from 'lucide-react';
import { useIsAdmin } from '../hooks/useAdminStatus';

export default function UserGuidePage() {
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3">User Guide</h1>
        <p className="text-lg text-muted-foreground">
          Learn how to use Bozarhaat as a buyer{isAdmin ? ', seller, or admin' : ' or seller'}
        </p>
      </div>

      <Tabs defaultValue="buyer" className="w-full">
        <TabsList className={`grid w-full max-w-md mx-auto ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'} mb-8`}>
          <TabsTrigger value="buyer" className="text-base">
            <ShoppingBag className="h-4 w-4 mr-2" />
            For Buyers
          </TabsTrigger>
          <TabsTrigger value="seller" className="text-base">
            <Store className="h-4 w-4 mr-2" />
            For Sellers
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="admin" className="text-base">
              <Shield className="h-4 w-4 mr-2" />
              For Admins
            </TabsTrigger>
          )}
        </TabsList>

        {/* Buyer Guide */}
        <TabsContent value="buyer" className="space-y-6">
          <div className="rounded-lg overflow-hidden border border-border bg-card">
            <img
              src="/assets/generated/bozarhaat-user-guide-buyer.dim_1600x900.png"
              alt="Buyer guide illustration showing the steps to browse, search, add to cart, and checkout on Bozarhaat"
              className="w-full h-auto"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Step 1: Browse & Search</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Use the search bar at the top to find products, or click on any category to explore sustainable living products. Browse through Food & Nutrition, Clothing, Energy Solutions, and more.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Step 2: View Product Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Click on any product to see full details including description, price, stock availability, and seller information. Check product ratings and reviews from other buyers.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Step 3: Add to Cart</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Select the quantity you want and click "Add to Cart". You can continue shopping or go to your cart to review items. Update quantities or remove items anytime.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Step 4: Checkout & Order</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Enter your delivery address and payment details. Review your order summary and place your order. Track your order status from the Orders page in your account.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-accent/50">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Make sure you are logged in to add items to cart and place orders. Click the "Login" button in the top right corner to get started. Your cart and order history will be saved to your account.
              </CardDescription>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seller Guide */}
        <TabsContent value="seller" className="space-y-6">
          <div className="rounded-lg overflow-hidden border border-border bg-card">
            <img
              src="/assets/generated/bozarhaat-user-guide-seller.dim_1600x900.png"
              alt="Seller guide illustration showing the steps to register as a seller, add products, and manage your business on Bozarhaat"
              className="w-full h-auto"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Step 1: Register as Seller</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Login to your account and complete the onboarding process. Select "I want to sell products" to register as a seller. Provide your business name and GST details if applicable.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Step 2: Access Seller Portal</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Once registered, access the Seller Portal from your account menu. This is where you can add new products, manage inventory, and view your sales performance.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Step 3: Add Products</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Fill in product details including name, description, price, and inventory count. Select the appropriate category from Sustainable Living options. Upload product images to attract buyers.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Step 4: Manage & Grow</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Monitor your product listings and update inventory as needed. Respond to customer orders promptly. Use the portal to track sales and grow your sustainable business on Bozarhaat.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-accent/50">
            <CardHeader>
              <CardTitle>Seller Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Provide clear product descriptions and accurate pricing. Keep your inventory updated to avoid overselling. Focus on sustainable and eco-friendly products that align with Bozarhaat's mission of promoting simple, sustainable, and practical everyday living.
              </CardDescription>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Guide */}
        {isAdmin && (
          <TabsContent value="admin" className="space-y-6">
            <div className="rounded-lg overflow-hidden border border-border bg-card">
              <img
                src="/assets/generated/bozarhaat-user-guide-admin.dim_1600x900.png"
                alt="Admin guide illustration showing administrative dashboard, company account management, and access control features on Bozarhaat"
                className="w-full h-auto"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>Step 1: Access Admin Areas</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    As an admin, you have access to special administrative features. Navigate to your account menu to find admin-only options like Company Account management. These options are only visible to authenticated administrators.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>Step 2: Manage Company Account</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Access the Company Account page to view and update your organization's bank details. Enter the bank name, account number, IFSC code, and account holder name. This information is used for payment processing and financial transactions.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>Step 3: Update Bank Details</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    On the Company Account page, you can edit existing bank details or add new ones if none exist. Make sure all information is accurate before saving. Changes are saved securely and can be updated anytime by authorized admins.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Lock className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>Step 4: Understand Access Control</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Admin-only pages are protected by role-based access control. Non-admin users who attempt to access restricted pages will see an access denied screen. Only authenticated administrators can view and modify sensitive company information and settings.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-accent/50">
              <CardHeader>
                <CardTitle>Admin Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  As an administrator, you have elevated privileges and access to sensitive company data. Always ensure bank details and financial information are accurate and up-to-date. Protect your login credentials and log out when finished. Admin access is restricted to authorized personnel only to maintain security and data integrity.
                </CardDescription>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
