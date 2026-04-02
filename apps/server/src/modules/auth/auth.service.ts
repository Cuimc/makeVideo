import type { AuthSession } from '@make-video/shared';
import { JwtService } from '@nestjs/jwt';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { BusinessException } from '../../common/exceptions/business.exception';
import { SmsProvider } from '../../providers/sms/sms.provider';
import type { LoginBySmsDto } from './dto/login-by-sms.dto';
import type { SendCodeDto } from './dto/send-code.dto';
import { UsersService } from '../users/users.service';

interface AuthCodeRecord {
  code: string;
  expiresAt: number;
}

const authCodes = new Map<string, AuthCodeRecord>();

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(SmsProvider)
    private readonly smsProvider: SmsProvider,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async sendCode(dto: SendCodeDto) {
    const code = '123456';
    const expiresAt = Date.now() + 5 * 60 * 1000;
    authCodes.set(dto.phone, {
      code,
      expiresAt,
    });
    const result = await this.smsProvider.sendCode({
      phone: dto.phone,
      code,
    });

    return {
      phone: dto.phone,
      requestId: result.requestId,
      sent: true,
    };
  }

  async loginBySms(dto: LoginBySmsDto): Promise<AuthSession & { accessToken: string }> {
    const record = authCodes.get(dto.phone);

    if (!record || record.code !== dto.code || record.expiresAt < Date.now()) {
      throw new BusinessException(400, '验证码错误或已过期');
    }

    const profile = await this.usersService.findOrCreateByPhone(dto.phone);
    const token = await this.jwtService.signAsync({
      userId: profile.id,
      phone: profile.phone,
      nickname: profile.nickname,
    });

    return {
      token,
      accessToken: token,
      profile,
    };
  }
}
