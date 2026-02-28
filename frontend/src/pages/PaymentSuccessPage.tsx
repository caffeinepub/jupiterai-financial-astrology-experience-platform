import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { usePaymentSuccess } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, Home } from 'lucide-react';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('sessionId') || '';
  const accountId = params.get('accountId') || '';
  const caffeineCustomerId = params.get('caffeineCustomerId') || '';

  const { data, isLoading, isError } = usePaymentSuccess(sessionId, accountId, caffeineCustomerId);

  useEffect(() => {
    if (data) {
      console.log('Payment successful:', data);
    }
  }, [data]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {isLoading ? (
          <Card className="border-cosmic-purple/20 bg-card/50 backdrop-blur">
            <CardContent className="pt-12 pb-12 text-center">
              <Sparkles className="w-16 h-16 text-cosmic-purple mx-auto mb-4 animate-spin" />
              <p className="text-lg text-muted-foreground">Confirming your payment...</p>
            </CardContent>
          </Card>
        ) : isError ? (
          <Card className="border-destructive/20 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-destructive">Payment Verification Failed</CardTitle>
              <CardDescription>
                We couldn't verify your payment. Please contact support if you were charged.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate({ to: '/' })} variant="outline">
                <Home className="w-4 h-4 mr-2" />
                Return Home
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-cosmic-pink/20 bg-gradient-to-br from-cosmic-pink/5 to-cosmic-purple/5 backdrop-blur">
            <CardHeader className="text-center">
              <CheckCircle className="w-16 h-16 text-cosmic-pink mx-auto mb-4" />
              <CardTitle className="text-2xl">Payment Successful!</CardTitle>
              <CardDescription>
                Thank you for upgrading to premium. Your enhanced report is now available.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data && (
                <div className="bg-background/50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium">
                      ${(Number(data.payment.amount) / 100).toFixed(2)} {data.payment.currency.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span className="font-medium">
                      {data.payment.paymentMethod.brand} •••• {data.payment.paymentMethod.last4}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium text-cosmic-pink">{data.payment.status}</span>
                  </div>
                </div>
              )}
              <Button
                onClick={() => navigate({ to: '/' })}
                className="w-full bg-gradient-to-r from-cosmic-pink via-cosmic-purple to-cosmic-turquoise hover:opacity-90"
              >
                <Home className="w-4 h-4 mr-2" />
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
