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
import type { ImageUploadPayload } from '@make-video/shared';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  JwtAuthGuard,
  type JwtUserPayload,
} from '../../common/guards/jwt-auth.guard';
import { AssetsService } from './assets.service';

@ApiTags('assets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get('images')
  @ApiOperation({ summary: '获取图片素材列表' })
  list(
    @CurrentUser() user: JwtUserPayload,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.assetsService.list(user.userId, {
      page,
      pageSize,
    });
  }

  @Post('images')
  @HttpCode(200)
  @ApiOperation({ summary: '上传图片素材' })
  upload(
    @CurrentUser() user: JwtUserPayload,
    @Body() payload: ImageUploadPayload,
  ) {
    return this.assetsService.uploadImage(user.userId, payload);
  }

  @Delete('images/:imageId')
  @HttpCode(200)
  @ApiOperation({ summary: '删除图片素材' })
  remove(
    @CurrentUser() user: JwtUserPayload,
    @Param('imageId') imageId: string,
  ) {
    return this.assetsService.remove(user.userId, imageId);
  }
}
