import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsAdmin } from '../hooks/useAdminStatus';
import { useGetCompanyBankDetails, useUpdateCompanyBankDetails } from '../hooks/useCompanyBankDetails';
import { navigate } from '../router/useHashRoute';
import { toast } from 'sonner';
import { Building2, User } from 'lucide-react';
import AccessDeniedScreen from '../components/AccessDeniedScreen';

export default function CompanyAccountPage() {
  const { identity } = useInternetIdentity();
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: bankDetails, isLoading: detailsLoading } = useGetCompanyBankDetails();
  const updateDetails = useUpdateCompanyBankDetails();

  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Update form when bank details load
  useEffect(() => {
    if (bankDetails) {
      setBankName(bankDetails.bankName);
      setAccountNumber(bankDetails.accountNumber);
      setIfsc(bankDetails.ifsc);
      setAccountHolderName(bankDetails.accountHolderName);
    }
  }, [bankDetails]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bankName.trim() || !accountNumber.trim() || !ifsc.trim() || !accountHolderName.trim()) {
      toast.error('All fields are required');
      return;
    }

    try {
      await updateDetails.mutateAsync({
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        ifsc: ifsc.trim(),
        accountHolderName: accountHolderName.trim(),
      });
      toast.success('Company bank details updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update bank details');
    }
  };

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Please Login</h2>
        <p className="text-muted-foreground mb-6">You need to be logged in to view this page</p>
        <Button onClick={() => navigate('/')}>Go to Home</Button>
      </div>
    );
  }

  if (adminLoading || detailsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-muted rounded"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Company Account</h1>
          <p className="text-muted-foreground">
            Manage company bank account details for receiving payments
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Bank Account Details
            </CardTitle>
            <CardDescription>
              All customer payments will be received in this account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name *</Label>
                <Input
                  id="bankName"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  disabled={!isEditing}
                  required
                  placeholder="e.g., Bank of India"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number *</Label>
                <Input
                  id="accountNumber"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  disabled={!isEditing}
                  required
                  placeholder="e.g., 30463453451"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ifsc">IFSC Code *</Label>
                <Input
                  id="ifsc"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value)}
                  disabled={!isEditing}
                  required
                  placeholder="e.g., SBIN0009864"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="accountHolderName">Account Holder Name *</Label>
                <Input
                  id="accountHolderName"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  disabled={!isEditing}
                  required
                  placeholder="e.g., Basanta Boniya"
                />
              </div>

              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> This account is managed by National Practical Centre (NATPRACEN) Federation. 
                  All transactions from customers will be received here, and payments to sellers and service providers 
                  will be processed from this account.
                </p>
              </div>

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        if (bankDetails) {
                          setBankName(bankDetails.bankName);
                          setAccountNumber(bankDetails.accountNumber);
                          setIfsc(bankDetails.ifsc);
                          setAccountHolderName(bankDetails.accountHolderName);
                        }
                      }}
                      disabled={updateDetails.isPending}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={updateDetails.isPending}>
                      {updateDetails.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                ) : (
                  <Button type="button" onClick={() => setIsEditing(true)}>
                    Edit Details
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
