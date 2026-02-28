import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, Home, ArrowLeft } from 'lucide-react';

export default function PaymentCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="border-muted bg-card/50 backdrop-blur">
          <CardHeader className="text-center">
            <XCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
            <CardDescription>
              Your payment was cancelled. No charges were made to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              You can return to your report or go back home to explore more features.
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => navigate({ to: '/' })}
                variant="outline"
                className="flex-1"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
              <Button
                onClick={() => window.history.back()}
                className="flex-1 bg-gradient-to-r from-cosmic-pink to-cosmic-purple hover:opacity-90"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
