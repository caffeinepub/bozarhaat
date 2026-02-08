import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useUserProfile';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsAdmin } from '../hooks/useAdminStatus';
import { navigate } from '../router/useHashRoute';
import { toast } from 'sonner';
import { User, MapPin, Package, ShoppingBag, Store, Truck, Building2 } from 'lucide-react';
import { UserType } from '../types/stubs';

export default function AccountPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const { isAdmin } = useIsAdmin();
  const saveProfile = useSaveCallerUserProfile();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Update form when profile loads
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setEmail(userProfile.email || '');
      setPhone(userProfile.phone || '');
      setShippingAddress(userProfile.shippingAddress || '');
    }
  }, [userProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!userProfile) return;

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        shippingAddress: shippingAddress.trim() || undefined,
        userType: userProfile.userType,
      });
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Please Login</h2>
        <p className="text-muted-foreground mb-6">You need to be logged in to view your account</p>
        <Button onClick={() => navigate('/')}>Go to Home</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const isSeller = userProfile?.userType === UserType.seller;
  const isDeliveryPartner = userProfile?.userType === UserType.deliveryPartner;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Account</h1>
        {userProfile && (
          <div className="flex items-center gap-2">
            <Badge variant={isSeller ? 'default' : isDeliveryPartner ? 'outline' : 'secondary'}>
              {isSeller ? (
                <>
                  <Store className="h-3 w-3 mr-1" />
                  Seller Account
                </>
              ) : isDeliveryPartner ? (
                <>
                  <Truck className="h-3 w-3 mr-1" />
                  Delivery Partner
                </>
              ) : (
                <>
                  <ShoppingBag className="h-3 w-3 mr-1" />
                  Buyer Account
                </>
              )}
            </Badge>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Shipping Address
                  </Label>
                  <Textarea
                    id="address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    placeholder="Enter your delivery address"
                  />
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          if (userProfile) {
                            setName(userProfile.name);
                            setEmail(userProfile.email || '');
                            setPhone(userProfile.phone || '');
                            setShippingAddress(userProfile.shippingAddress || '');
                          }
                        }}
                        disabled={saveProfile.isPending}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={saveProfile.isPending}>
                        {saveProfile.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </>
                  ) : (
                    <Button type="button" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/orders')}
              >
                <Package className="h-4 w-4 mr-2" />
                My Orders
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/cart')}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Shopping Cart
              </Button>
              {isSeller && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/seller')}
                >
                  <Store className="h-4 w-4 mr-2" />
                  Seller Portal
                </Button>
              )}
              {!userProfile && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/delivery-partner')}
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Become a Delivery Partner
                </Button>
              )}
              {isAdmin && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/company-account')}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Company Account
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
