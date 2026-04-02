import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  JwtAuthGuard,
  type JwtUserPayload,
} from '../../common/guards/jwt-auth.guard';
import { BillingService } from './billing.service';

@ApiTags('billing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('summary')
  @ApiOperation({ summary: '获取前端积分中心摘要' })
  getSummary(@CurrentUser() user: JwtUserPayload) {
    return this.billingService.getSummary(user.userId);
  }

  @Get('packages')
  @ApiOperation({ summary: '获取积分充值套餐' })
  getPackages() {
    return this.billingService.getPackages();
  }

  @Get('records')
  @ApiOperation({ summary: '获取积分明细' })
  getPointRecords(
    @CurrentUser() user: JwtUserPayload,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.billingService.getPointRecords(user.userId, {
      page,
      pageSize,
    });
  }

  @Get('recharges')
  @ApiOperation({ summary: '获取充值记录' })
  getRechargeRecords(
    @CurrentUser() user: JwtUserPayload,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.billingService.getRechargeRecords(user.userId, {
      page,
      pageSize,
    });
  }
}
