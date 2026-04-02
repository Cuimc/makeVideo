import type { UserProfile } from '@make-video/shared';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  JwtAuthGuard,
  type JwtUserPayload,
} from '../../common/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户信息' })
  getCurrentUser(@CurrentUser() user: JwtUserPayload): UserProfile {
    const phone = user.phone ?? '13800138000';

    return {
      id: user.userId,
      phone,
      maskedPhone: maskPhone(phone),
      nickname: user.nickname ?? '演示用户',
      pointBalance: 0,
      createdAt: '2026-04-01T00:00:00.000Z',
    };
  }
}

function maskPhone(phone: string) {
  if (phone.length !== 11) {
    return phone;
  }

  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}
