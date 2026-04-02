import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { ReferenceVideoUploadPayload } from '@make-video/shared';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  JwtAuthGuard,
  type JwtUserPayload,
} from '../../common/guards/jwt-auth.guard';
import { ReferencesService } from './references.service';

@ApiTags('references')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('references')
export class ReferencesController {
  constructor(private readonly referencesService: ReferencesService) {}

  @Get()
  @ApiOperation({ summary: '获取参考视频分析结果列表' })
  list(
    @CurrentUser() user: JwtUserPayload,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.referencesService.list(user.userId, {
      page,
      pageSize,
    });
  }

  @Post('analyze')
  @HttpCode(200)
  @ApiOperation({ summary: '上传并分析参考视频' })
  analyze(
    @CurrentUser() user: JwtUserPayload,
    @Body() payload: ReferenceVideoUploadPayload,
  ) {
    return this.referencesService.analyze(user.userId, payload);
  }

  @Delete(':referenceId')
  @HttpCode(200)
  @ApiOperation({ summary: '删除参考视频分析结果' })
  remove(
    @CurrentUser() user: JwtUserPayload,
    @Param('referenceId') referenceId: string,
  ) {
    return this.referencesService.remove(user.userId, referenceId);
  }
}
