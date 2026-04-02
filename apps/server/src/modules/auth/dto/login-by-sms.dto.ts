import { Matches } from 'class-validator';

export class LoginBySmsDto {
  @Matches(/^1\d{10}$/, {
    message: '手机号格式不正确',
  })
  phone!: string;

  @Matches(/^\d{6}$/, {
    message: '验证码格式不正确',
  })
  code!: string;
}
