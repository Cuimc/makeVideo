import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getAppEnv } from '../../common/config/app-env';

@Module({
  imports: [
    JwtModule.register({
      secret: getAppEnv().jwtSecret,
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  exports: [JwtModule],
})
export class AuthModule {}
