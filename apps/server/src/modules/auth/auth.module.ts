import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getAppEnv } from '../../common/config/app-env';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: getAppEnv().jwtSecret,
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  providers: [JwtAuthGuard],
  exports: [JwtModule, JwtAuthGuard],
})
export class AuthModule {}
