import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Debug "mo:core/Debug";
import Runtime "mo:core/Runtime";
import Error "mo:core/Error";
import Blob "mo:core/Blob";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Prim "mo:prim";
import StripeService "StripeService";
import Cycles "mo:core/Cycles";
import AccessControl "../authorization/access-control";

module {
  // Stripe price - the atomic unit for payment (admin-managed)
  public type StripePriceInfo = {
    priceId : Text;
    name : Text;
    description : Text;
    unitAmount : Nat; // In lowest monetary unit (cents for USD, yen for JPY)
  };

  // Line item for checkout
  public type LineItem = {
    priceId : Text;
    quantity : Nat;
    comment : ?Text; // Optional comment appended to description on receipt
  };

  public type InlineItem = {
    productName : Text;
    productDescription : Text;
    priceInLowestUnit : Nat;
    quantity : Nat;
  };

  public type BuyerInfo = {
    email : ?Text;
    name : Text;
    phone : ?Text;
  };

  public type CreatePaymentRequest = {
    caffeineCustomerId : Principal;
    items : [InlineItem];
    currency : Text;
    allowedCountries : [Text];
    successUrl : Text;
    cancelUrl : Text;
    buyerInfo : ?BuyerInfo;
  };

  public type CreatePaymentResponse = {
    sessionId : Text;
    checkoutUrl : Text;
  };

  public type PaymentSuccessRequest = {
    sessionId : Text;
    accountId : Text;
    caffeineCustomerId : Text;
  };

  public type PaymentSuccessResponse = {
    message : Text;
    payment : {
      status : Text;
      amount : Nat;
      currency : Text;
      paymentMethod : { brand : Text; last4 : Text };
    };
  };

  public type PaymentCancelRequest = {
    sessionId : Text;
  };

  public type PaymentCancelResponse = {
    message : Text;
    sessionId : Text;
  };

  public type PostToStripeThroughIntegrationsCanisterResult = {
    #ok : Blob;
    #err : Text;
  };

  // Stripe state type - stable record that persists across upgrades
  public type Stripe = {
    stripePrices : Map.Map<Text, StripePriceInfo>;
    accessControlState : AccessControl.AccessControlState;
    currency : Text;
  };

  // Initialize a new Stripe state
  public func init(accessControlState : AccessControl.AccessControlState, currency : Text) : Stripe {
    {
      stripePrices = Map.empty<Text, StripePriceInfo>();
      accessControlState;
      currency;
    };
  };

  // List all Stripe prices (no auth needed)
  public func listStripePrices(self : Stripe) : [StripePriceInfo] {
    self.stripePrices.values().toArray();
  };

  // Add a new Stripe price - caller passed explicitly for authorization
  public func addStripePrice(self : Stripe, caller : Principal, price : StripePriceInfo) {
    if (not AccessControl.isAdmin(self.accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add prices");
    };
    if (self.stripePrices.containsKey(price.priceId)) {
      Runtime.trap("Price with ID already exists: " # price.priceId);
    };
    self.stripePrices.add(price.priceId, price);
  };

  // Update an existing Stripe price - caller passed explicitly for authorization
  public func updateStripePrice(self : Stripe, caller : Principal, price : StripePriceInfo) {
    if (not AccessControl.isAdmin(self.accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update prices");
    };
    if (not self.stripePrices.containsKey(price.priceId)) {
      Runtime.trap("Price not found: " # price.priceId);
    };
    self.stripePrices.add(price.priceId, price);
  };

  // Remove a Stripe price - caller passed explicitly for authorization
  public func removeStripePrice(self : Stripe, caller : Principal, priceId : Text) {
    if (not AccessControl.isAdmin(self.accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can remove prices");
    };
    if (not self.stripePrices.containsKey(priceId)) {
      Runtime.trap("Price not found: " # priceId);
    };
    self.stripePrices.remove(priceId);
  };

  // Create payment with price hydration from Stripe prices
  public func createPayment(
    self : Stripe,
    caller : Principal,
    lineItems : [LineItem],
    successPath : Text,
    cancelPath : Text
  ) : async CreatePaymentResponse {
    // Hydrate prices from Stripe price catalog
    let items = lineItems.map(
      func(item) {
        switch (self.stripePrices.get(item.priceId)) {
          case (?price) {
            let description = switch (item.comment) {
              case (?c) { price.description # " " # c };
              case (null) { price.description };
            };
            {
              productName = price.name;
              productDescription = description;
              priceInLowestUnit = price.unitAmount;
              quantity = item.quantity;
            };
          };
          case (null) {
            Runtime.trap("Unknown price ID: " # item.priceId);
          };
        };
      }
    );

    let successUrl = buildUrl(getFrontendUrl<system>(), successPath, []);
    let cancelUrl = buildUrl(getFrontendUrl<system>(), cancelPath, []);
    let requestBody = to_candid (
      {
        caffeineCustomerId = caller;
        items;
        currency = self.currency;
        allowedCountries = [];
        successUrl;
        cancelUrl;
        buyerInfo = null;
      } : CreatePaymentRequest
    );
    let response = await postToStripeThroughIntegrationsCanister("start-payment", requestBody);
    let candidEncodedPayload = switch (response) {
      case (#ok(response)) { response };
      case (#err(error)) { Runtime.trap("Failed to create checkout session: " # error) };
    };
    let decodedResponse : ?CreatePaymentResponse = from_candid (candidEncodedPayload);
    switch (decodedResponse) {
      case (?response) { response };
      case (null) { Runtime.trap("Failed to decode response from Stripe: " # debug_show (decodedResponse)) };
    };
  };

  // Handler for payment success redirects from Stripe
  public func paymentSuccess(sessionId : Text, accountId : Text, caffeineCustomerId : Text) : async PaymentSuccessResponse {
    try {
      let body = to_candid (
        {
          sessionId;
          accountId;
          caffeineCustomerId;
        } : PaymentSuccessRequest
      );
      let response = await postToStripeThroughIntegrationsCanister<system>("payment-success", body);
      let candidEncodedPayload = switch (response) {
        case (#ok(response)) { response };
        case (#err(error)) { Runtime.trap("Failed to get payment success: " # error) };
      };
      let decodedResponse : ?PaymentSuccessResponse = from_candid (candidEncodedPayload);
      switch (decodedResponse) {
        case (?response) { response };
        case (null) { Runtime.trap("Failed to decode response from Stripe: " # debug_show (decodedResponse)) };
      };
    } catch (err) {
      Runtime.trap("Failed to handle payment success: " # err.message());
    };
  };

  // Handler for payment cancellation redirects from Stripe
  public func paymentCancel(sessionId : Text) : async PaymentCancelResponse {
    try {
      let body = to_candid ({ sessionId } : PaymentCancelRequest);
      let response = await postToStripeThroughIntegrationsCanister<system>("payment-cancel", body);
      let candidEncodedPayload = switch (response) {
        case (#ok(response)) { response };
        case (#err(error)) { Runtime.trap("Failed to get payment cancel: " # error) };
      };
      let decodedResponse : ?PaymentCancelResponse = from_candid (candidEncodedPayload);
      switch (decodedResponse) {
        case (?response) { response };
        case (null) { Runtime.trap("Failed to decode response from Stripe: " # debug_show (decodedResponse)) };
      };
    } catch (err) {
      Runtime.trap("Failed to handle payment cancel: " # err.message());
    };
  };

  // Helper functions
  func getFrontendUrl<system>() : Text {
    switch (Prim.envVar<system>("FRONTEND_URL")) {
      case (?url) { url };
      case (null) {
        Runtime.trap("FRONTEND_URL environment variable is not set. This should be set during deployment.");
      };
    };
  };

  func buildUrl(base : Text, path : Text, params : [(Text, Text)]) : Text {
    // Handle slash concatenation
    let baseEndsWithSlash = base.endsWith(#text "/");
    let pathStartsWithSlash = path.startsWith(#text "/");

    let baseUrl = if (baseEndsWithSlash and pathStartsWithSlash) {
      base.trimEnd(#text "/") # path;
    } else if (not baseEndsWithSlash and not pathStartsWithSlash) {
      base # "/" # path;
    } else {
      base # path;
    };

    // Add query parameters if provided
    if (params.size() == 0) {
      return baseUrl;
    };

    let queryString = params.values().map(func(pair) { pair.0 # "=" # pair.1 }).join("&");
    baseUrl # "?" # queryString;
  };

  func getIntegrationsCanisterId() : async Principal {
    switch (Prim.envVar<system>("INTEGRATIONS_CANISTER_ID")) {
      case (null) {
        Runtime.trap("INTEGRATIONS_CANISTER_ID environment variable is not set");
      };
      case (?integrationsCanisterId) {
        try {
          Principal.fromText(integrationsCanisterId);
        } catch (_) {
          Runtime.trap("INTEGRATIONS_CANISTER_ID is not a valid Principal: " # integrationsCanisterId);
        };
      };
    };
  };

  func postToStripeThroughIntegrationsCanister(endpoint : Text, payload : Blob) : async PostToStripeThroughIntegrationsCanisterResult {
    let integrationsCanisterId = await getIntegrationsCanisterId();
    // TODO: This needs to be calculated here based on payload size
    let maxCost = 500_000_000; // 500M CYCLES

    let currentBalance = Cycles.balance();
    if (currentBalance < maxCost) {
      return #err("Not enough cycles to send request to Stripe");
    };

    let stripeService = actor (integrationsCanisterId.toText()) : StripeService.StripeService;
    let response = await (with cycles = maxCost) stripeService.send_to_stripe({ endpoint; payload });
    switch (response.result) {
      case (#Ok(success)) { #ok(success.response) };
      case (#Err(error)) { #err(debug_show (error)) };
    };
  };
};
