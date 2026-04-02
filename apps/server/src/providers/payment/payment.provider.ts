export interface CreatePaymentOrderInput {
  orderNo: string;
  amountCents: number;
  subject: string;
}

export interface PaymentOrderResult {
  providerOrderId: string;
  paymentUrl: string;
}

export interface QueryPaymentResult {
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CLOSED';
}

export abstract class PaymentProvider {
  abstract createOrder(
    input: CreatePaymentOrderInput,
  ): Promise<PaymentOrderResult>;

  abstract query(providerOrderId: string): Promise<QueryPaymentResult>;
}
