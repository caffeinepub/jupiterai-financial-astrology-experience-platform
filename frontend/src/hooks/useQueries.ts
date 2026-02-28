import { useQuery, useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ReportData, PaymentSuccessResponse } from '../backend';

export function useGetReport(reportId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ReportData | null>({
    queryKey: ['report', reportId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getReport(reportId);
    },
    enabled: !!actor && !isFetching && !!reportId,
  });
}

export function useCheckout() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (productType: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.checkout(productType);
    },
  });
}

export function usePaymentSuccess(sessionId: string, accountId: string, caffeineCustomerId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<PaymentSuccessResponse>({
    queryKey: ['paymentSuccess', sessionId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.paymentSuccess(sessionId, accountId, caffeineCustomerId);
    },
    enabled: !!actor && !isFetching && !!sessionId && !!accountId && !!caffeineCustomerId,
    retry: false,
  });
}
