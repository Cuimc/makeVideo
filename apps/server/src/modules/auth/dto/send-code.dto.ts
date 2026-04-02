import { Matches } from 'class-validator';

export class SendCodeDto {
  @Matches(/^1\d{10}$/, {
    message: '手机号格式不正确',
  })
  phone!: string;
}
