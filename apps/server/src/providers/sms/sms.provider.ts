export interface SendSmsCodeInput {
  phone: string;
  code: string;
}

export interface SmsSendResult {
  requestId: string;
}

export abstract class SmsProvider {
  abstract sendCode(input: SendSmsCodeInput): Promise<SmsSendResult>;
}
