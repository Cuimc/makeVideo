import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getAppEnv } from '../../common/config/app-env';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { MockSmsProvider } from '../../providers/sms/mock-sms.provider';
import { SmsProvider } from '../../providers/sms/sms.provider';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: getAppEnv().jwtSecret,
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAuthGuard,
    MockSmsProvider,
    {
      provide: SmsProvider,
      useExisting: MockSmsProvider,
    },
  ],
  exports: [AuthService, JwtModule, JwtAuthGuard],
})
export class AuthModule {}
