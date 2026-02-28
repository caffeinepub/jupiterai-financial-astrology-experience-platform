import Stripe "Stripe";

// Mixin that exposes Stripe callback methods for frontend access
mixin(_stripe : Stripe.Stripe) {
  // Handler for payment success redirects from Stripe
  public func paymentSuccess(sessionId : Text, accountId : Text, caffeineCustomerId : Text) : async Stripe.PaymentSuccessResponse {
    await Stripe.paymentSuccess(sessionId, accountId, caffeineCustomerId);
  };

  // Handler for payment cancellation redirects from Stripe
  public func paymentCancel(sessionId : Text) : async Stripe.PaymentCancelResponse {
    await Stripe.paymentCancel(sessionId);
  };
};
