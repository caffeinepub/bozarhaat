import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useGetCallerUserProfile, useRegisterDeliveryPartnerProfile } from '../hooks/useUserProfile';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { navigate } from '../router/useHashRoute';
import { toast } from 'sonner';
import { Truck, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserType } from '../types/stubs';

export default function DeliveryPartnerOnboardingPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const registerDeliveryPartner = useRegisterDeliveryPartnerProfile();

  const [name, setName] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [canServeOtherEcommerce, setCanServeOtherEcommerce] = useState(false);
  const [servicePricePaise, setServicePricePaise] = useState('');

  const isAuthenticated = !!identity;
  const isDeliveryPartner = userProfile?.userType === UserType.deliveryPartner;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !contactDetails.trim() || !servicePricePaise) {
      toast.error('Please fill in all required fields');
      return;
    }

    const priceInPaise = parseInt(servicePricePaise);
    if (isNaN(priceInPaise) || priceInPaise < 0) {
      toast.error('Please enter a valid service price');
      return;
    }

    try {
      await registerDeliveryPartner.mutateAsync({
        name: name.trim(),
        contactDetails: contactDetails.trim(),
        canServeOtherEcommerce,
        servicePricePaise: priceInPaise,
      });

      toast.success('Delivery partner registration successful!');
      navigate('/account');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to register as delivery partner');
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
              You need to be logged in to register as a delivery partner.
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

  if (isDeliveryPartner) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Already Registered
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              You are already registered as a delivery partner.
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
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Truck className="h-8 w-8 text-primary" />
            Become a Delivery Partner
          </h1>
          <p className="text-muted-foreground">
            Join our delivery network and start earning
          </p>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Fill in your details to register as a delivery partner on Bozarhaat.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Registration Form</CardTitle>
            <CardDescription>
              Provide your information to complete the registration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact Details *</Label>
                <Textarea
                  id="contact"
                  value={contactDetails}
                  onChange={(e) => setContactDetails(e.target.value)}
                  placeholder="Phone number, email, address, etc."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Service Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={servicePricePaise}
                  onChange={(e) => setServicePricePaise(e.target.value)}
                  placeholder="Enter your service price in rupees"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  This is the price you charge per delivery
                </p>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor="other-ecommerce">Serve Other E-commerce Platforms</Label>
                  <p className="text-sm text-muted-foreground">
                    Can you deliver for other e-commerce platforms?
                  </p>
                </div>
                <Switch
                  id="other-ecommerce"
                  checked={canServeOtherEcommerce}
                  onCheckedChange={setCanServeOtherEcommerce}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={registerDeliveryPartner.isPending}
              >
                {registerDeliveryPartner.isPending ? 'Registering...' : 'Complete Registration'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
