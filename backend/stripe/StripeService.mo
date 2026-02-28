module {
  public type StripeService = actor {
    send_to_stripe : (SendToStripeArgs) -> async Response;
  };

  public type SendToStripeArgs = {
    endpoint : Text;
    payload : Blob;
  };

  public type Response = {
    cycles_charged : Nat;
    result : Result;
  };

  public type Result = {
    #Ok : Success;
    #Err : Error;
  };

  public type Success = {
    response : Blob;
  };

  public type Error = {
    #UnknownError : Text;
    #InvalidArgs : Text;
    #TooFewCyclesAttached : TooFewCyclesAttached;
    #FailedToCallService : Text;
    #FailedToDeserializeServiceResponse : Text;
  };

  public type TooFewCyclesAttached = {
    required : Nat;
    attached : Nat;
  };
};
