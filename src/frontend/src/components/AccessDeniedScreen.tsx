import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { navigate } from '../router/useHashRoute';

export default function AccessDeniedScreen() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto text-center">
        <CardHeader>
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>
            You do not have permission to view this page. This area is restricted to administrators only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/')} className="w-full">
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
