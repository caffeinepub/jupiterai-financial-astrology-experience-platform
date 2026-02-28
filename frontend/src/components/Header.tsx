import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Sparkles, LogOut, LogIn } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
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
    <header className="border-b border-border/40 backdrop-blur-md bg-background/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate({ to: '/' })}
          className="flex items-center gap-3 group"
        >
          <img 
            src="/assets/generated/jupiterai-logo-transparent.dim_200x200.png" 
            alt="JupiterAI" 
            className="w-10 h-10 group-hover:scale-110 transition-transform"
          />
          <div className="flex flex-col items-start">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cosmic-pink via-cosmic-purple to-cosmic-turquoise bg-clip-text text-transparent">
              JupiterAI
            </h1>
            <p className="text-xs text-muted-foreground">Financial Astrology</p>
          </div>
        </button>

        <Button
          onClick={handleAuth}
          disabled={isLoggingIn}
          variant={isAuthenticated ? 'outline' : 'default'}
          className={isAuthenticated ? '' : 'bg-gradient-to-r from-cosmic-pink to-cosmic-purple hover:opacity-90'}
        >
          {isLoggingIn ? (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : isAuthenticated ? (
            <>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
