import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';
import { useAddProduct } from '../hooks/useProducts';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { navigate } from '../router/useHashRoute';
import { toast } from 'sonner';
import { Store, Package, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SUSTAINABLE_LIVING_CATEGORIES } from '../constants/sustainableLivingCategories';
import { UserType } from '../types/stubs';

export default function SellerPortalPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const addProduct = useAddProduct();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [inventory, setInventory] = useState('');
  const [sku, setSku] = useState('');

  const isAuthenticated = !!identity;
  const isSeller = userProfile?.userType === UserType.seller;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !category || !price || !inventory) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const priceInPaise = BigInt(Math.round(parseFloat(price) * 100));
      const inventoryCount = BigInt(parseInt(inventory));

      await addProduct.mutateAsync({
        name,
        description,
        price: priceInPaise,
        inventoryCount,
        categoryId: category,
        fulfillmentType: 'standard',
        sellerId: identity?.getPrincipal().toString() || null,
        taxRate: null,
        shippingCharge: null,
        sku: sku || null,
      });

      toast.success('Product added successfully!');
      
      // Reset form
      setName('');
      setDescription('');
      setCategory('');
      setPrice('');
      setInventory('');
      setSku('');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              You need to be logged in to access the seller portal.
            </p>
            <Button onClick={() => navigate('/account')} className="w-full">
              Go to Account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSeller) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Only sellers can access this page. Please register as a seller from your account page.
            </p>
            <Button onClick={() => navigate('/account')} className="w-full">
              Go to Account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Store className="h-8 w-8 text-primary" />
            Seller Portal
          </h1>
          <p className="text-muted-foreground">
            Add and manage your products on Bozarhaat
          </p>
        </div>

        <Alert className="mb-6">
          <Package className="h-4 w-4" />
          <AlertDescription>
            Fill in the product details below to list your item on the marketplace.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
            <CardDescription>
              Enter the details of the product you want to sell
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUSTAINABLE_LIVING_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.emoji} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inventory">Inventory Count *</Label>
                  <Input
                    id="inventory"
                    type="number"
                    min="0"
                    value={inventory}
                    onChange={(e) => setInventory(e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU (Optional)</Label>
                <Input
                  id="sku"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="Product SKU"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={addProduct.isPending}
              >
                {addProduct.isPending ? 'Adding Product...' : 'Add Product'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
