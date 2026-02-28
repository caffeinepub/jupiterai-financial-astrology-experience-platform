import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import BirthDataForm, { type BirthData } from '../components/BirthDataForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, TrendingUp, Calendar, Target, Clock, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function HomePage() {
  const navigate = useNavigate();
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFormSubmit = async (data: BirthData) => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      // Navigate to a sample report
      navigate({ to: '/report/$reportId', params: { reportId: '102' } });
      toast.success('Your financial astrology report is ready!');
    }, 2000);
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <img 
              src="/assets/generated/jupiterai-logo-transparent.dim_200x200.png" 
              alt="JupiterAI" 
              className="w-32 h-32 mx-auto"
            />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cosmic-pink via-cosmic-purple to-cosmic-turquoise bg-clip-text text-transparent">
              Unlock Your Financial Destiny
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover personalized financial insights through the ancient wisdom of astrology combined with modern cryptocurrency and traditional finance charts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 my-12">
            <Card className="border-cosmic-pink/20 bg-card/50 backdrop-blur">
              <CardHeader>
                <TrendingUp className="w-10 h-10 text-cosmic-pink mx-auto mb-2" />
                <CardTitle className="text-lg">Money Personality</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Understand your unique financial strengths and tendencies
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-cosmic-purple/20 bg-card/50 backdrop-blur">
              <CardHeader>
                <Calendar className="w-10 h-10 text-cosmic-purple mx-auto mb-2" />
                <CardTitle className="text-lg">Timing Windows</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Discover optimal periods for financial decisions
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-cosmic-turquoise/20 bg-card/50 backdrop-blur">
              <CardHeader>
                <Target className="w-10 h-10 text-cosmic-turquoise mx-auto mb-2" />
                <CardTitle className="text-lg">Action Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get personalized strategies for wealth building
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <Button
            onClick={handleLogin}
            disabled={isLoggingIn}
            size="lg"
            className="bg-gradient-to-r from-cosmic-pink via-cosmic-purple to-cosmic-turquoise hover:opacity-90 text-lg px-8 py-6"
          >
            {isLoggingIn ? (
              <>
                <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started - Login Now
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Secure authentication via Internet Identity</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cosmic-pink via-cosmic-purple to-cosmic-turquoise bg-clip-text text-transparent">
            Your Financial Astrology Journey
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter your birth details to receive a personalized financial astrology report
          </p>
        </div>

        <BirthDataForm onSubmit={handleFormSubmit} isLoading={isGenerating} />

        <Card className="border-cosmic-turquoise/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-cosmic-turquoise" />
              What You'll Discover
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-cosmic-pink mt-2" />
              <div>
                <p className="font-medium">Money Personality Snapshot</p>
                <p className="text-sm text-muted-foreground">Your innate financial tendencies and patterns</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-cosmic-purple mt-2" />
              <div>
                <p className="font-medium">Financial Strengths Analysis</p>
                <p className="text-sm text-muted-foreground">Leverage your natural advantages</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-cosmic-turquoise mt-2" />
              <div>
                <p className="font-medium">Current Financial Season</p>
                <p className="text-sm text-muted-foreground">Understanding your present cosmic climate</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-cosmic-pink mt-2" />
              <div>
                <p className="font-medium">Action Translation Plan</p>
                <p className="text-sm text-muted-foreground">Practical steps aligned with your chart</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-cosmic-purple mt-2" />
              <div>
                <p className="font-medium">Timing Windows</p>
                <p className="text-sm text-muted-foreground">Optimal periods for financial decisions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
