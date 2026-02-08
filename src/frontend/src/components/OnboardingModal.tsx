import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useSaveCallerUserProfile, useRegisterBuyerProfile, useRegisterSellerProfile } from '../hooks/useUserProfile';
import { toast } from 'sonner';
import { ShoppingBag, Store, Truck } from 'lucide-react';
import { UserType } from '../types/stubs';
import { navigate } from '../router/useHashRoute';

type AccountType = 'buyer' | 'seller' | 'deliveryPartner' | null;

export default function OnboardingModal() {
  const [step, setStep] = useState<'select' | 'form'>('select');
  const [accountType, setAccountType] = useState<AccountType>(null);
  
  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Buyer fields
  const [shippingAddress, setShippingAddress] = useState('');
  
  // Seller fields
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  
  const saveProfile = useSaveCallerUserProfile();
  const registerBuyer = useRegisterBuyerProfile();
  const registerSeller = useRegisterSellerProfile();

  const handleSelectType = (type: 'buyer' | 'seller' | 'deliveryPartner') => {
    if (type === 'deliveryPartner') {
      // Redirect to dedicated delivery partner page
      navigate('/delivery-partner');
      return;
    }
    setAccountType(type);
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!email.trim() && !phone.trim()) {
      toast.error('Please provide at least email or phone number');
      return;
    }

    if (accountType === 'seller' && !businessName.trim()) {
      toast.error('Please enter your business name');
      return;
    }

    try {
      // Save user profile first
      await saveProfile.mutateAsync({
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        shippingAddress: accountType === 'buyer' ? (shippingAddress.trim() || undefined) : undefined,
        userType: accountType === 'buyer' ? UserType.buyer : UserType.seller,
      });

      // Register type-specific profile
      if (accountType === 'buyer') {
        if (shippingAddress.trim()) {
          await registerBuyer.mutateAsync({
            shippingAddress: shippingAddress.trim(),
            paymentMethod: undefined,
            billingAddress: undefined,
          });
        }
      } else if (accountType === 'seller') {
        await registerSeller.mutateAsync({
          businessName: businessName.trim(),
          gstNumber: undefined,
        });
      }

      toast.success(`Welcome to Bozarhaat, ${name}!`);
    } catch (error: any) {
      console.error('Onboarding error:', error);
      toast.error(error.message || 'Failed to complete onboarding');
    }
  };

  const isSubmitting = saveProfile.isPending || registerBuyer.isPending || registerSeller.isPending;

  return (
    <Dialog open={true}>
      <DialogContent 
        className="sm:max-w-2xl" 
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Welcome to Bozarhaat!</DialogTitle>
          <DialogDescription>
            {step === 'select' 
              ? 'Please select your account type to get started'
              : `Complete your ${accountType} profile`
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'select' ? (
          <div className="grid md:grid-cols-3 gap-4 py-4">
            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleSelectType('buyer')}
            >
              <CardContent className="pt-6 text-center">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">I'm a Buyer</h3>
                <p className="text-sm text-muted-foreground">
                  Browse and purchase products from verified sellers
                </p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleSelectType('seller')}
            >
              <CardContent className="pt-6 text-center">
                <Store className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">I'm a Seller</h3>
                <p className="text-sm text-muted-foreground">
                  List your products and reach thousands of customers
                </p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleSelectType('deliveryPartner')}
            >
              <CardContent className="pt-6 text-center">
                <Truck className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Delivery Partner</h3>
                <p className="text-sm text-muted-foreground">
                  Provide delivery services and earn
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
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

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            {accountType === 'buyer' && (
              <div className="space-y-2">
                <Label htmlFor="address">Shipping Address</Label>
                <Textarea
                  id="address"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Enter your delivery address"
                  rows={3}
                />
              </div>
            )}

            {accountType === 'seller' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Your business or shop name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <Textarea
                    id="businessAddress"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    placeholder="Your business location"
                    rows={3}
                  />
                </div>
              </>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setStep('select');
                  setAccountType(null);
                  setName('');
                  setEmail('');
                  setPhone('');
                  setShippingAddress('');
                  setBusinessName('');
                  setBusinessAddress('');
                }}
                disabled={isSubmitting}
              >
                Back
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Creating Account...' : 'Complete Registration'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
