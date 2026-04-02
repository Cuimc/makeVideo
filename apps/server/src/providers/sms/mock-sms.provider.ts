import { Injectable } from '@nestjs/common';
import {
  SmsProvider,
  type SendSmsCodeInput,
  type SmsSendResult,
} from './sms.provider';

@Injectable()
export class MockSmsProvider extends SmsProvider {
  async sendCode(input: SendSmsCodeInput): Promise<SmsSendResult> {
    return {
      requestId: `mock-sms-${input.phone}-${input.code}`,
    };
  }
}
