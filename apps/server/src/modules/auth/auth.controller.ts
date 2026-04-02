import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  JwtAuthGuard,
  type JwtUserPayload,
} from '../../common/guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginBySmsDto } from './dto/login-by-sms.dto';
import { SendCodeDto } from './dto/send-code.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('send-code')
  @HttpCode(200)
  @ApiOperation({ summary: '发送登录验证码' })
  sendCode(@Body() dto: SendCodeDto) {
    return this.authService.sendCode(dto);
  }

  @Post('login-by-sms')
  @HttpCode(200)
  @ApiOperation({ summary: '短信验证码登录' })
  loginBySms(@Body() dto: LoginBySmsDto) {
    return this.authService.loginBySms(dto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: '兼容前端 SDK 的登录接口' })
  login(@Body() dto: LoginBySmsDto) {
    return this.authService.loginBySms(dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前登录用户信息' })
  getProfile(@CurrentUser() user: JwtUserPayload) {
    return this.usersService.getProfile(user.userId);
  }
}
