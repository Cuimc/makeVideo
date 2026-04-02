import { Injectable } from '@nestjs/common';
import {
  PaymentProvider,
  type CreatePaymentOrderInput,
  type PaymentOrderResult,
  type QueryPaymentResult,
} from './payment.provider';

@Injectable()
export class MockPaymentProvider extends PaymentProvider {
  async createOrder(
    input: CreatePaymentOrderInput,
  ): Promise<PaymentOrderResult> {
    return {
      providerOrderId: `mock-payment-${input.orderNo}`,
      paymentUrl: `https://example.com/pay/${input.orderNo}?amount=${input.amountCents}`,
    };
  }

  async query(providerOrderId: string): Promise<QueryPaymentResult> {
    return {
      status: providerOrderId.includes('paid') ? 'PAID' : 'PENDING',
    };
  }
}
