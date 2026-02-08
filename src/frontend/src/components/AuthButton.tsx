import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { LogIn, LogOut } from 'lucide-react';

export default function AuthButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <Button
      onClick={handleAuth}
      disabled={disabled}
      size="sm"
      variant={isAuthenticated ? 'outline' : 'default'}
      className="gap-2"
    >
      {loginStatus === 'logging-in' ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          <span className="hidden sm:inline">Logging in...</span>
        </>
      ) : isAuthenticated ? (
        <>
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </>
      ) : (
        <>
          <LogIn className="h-4 w-4" />
          <span className="hidden sm:inline">Login</span>
        </>
      )}
    </Button>
  );
}
