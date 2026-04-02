import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { TaskStatus, VideoGenerationForm } from '@make-video/shared';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  JwtAuthGuard,
  type JwtUserPayload,
} from '../../common/guards/jwt-auth.guard';
import { VideoTasksService } from './video-tasks.service';

interface CreateVideoTaskPayload extends VideoGenerationForm {
  projectId: string;
}

@ApiTags('video-tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('video-tasks')
export class VideoTasksController {
  constructor(private readonly videoTasksService: VideoTasksService) {}

  @Get()
  @ApiOperation({ summary: '获取视频任务列表' })
  list(
    @CurrentUser() user: JwtUserPayload,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('status') status?: TaskStatus,
    @Query('projectName') projectName?: string,
  ) {
    return this.videoTasksService.list(user.userId, {
      page,
      pageSize,
      status,
      projectName,
    });
  }

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: '提交视频生成任务' })
  create(
    @CurrentUser() user: JwtUserPayload,
    @Body() payload: CreateVideoTaskPayload,
  ) {
    return this.videoTasksService.create(user.userId, payload);
  }

  @Post(':taskId/retry')
  @HttpCode(200)
  @ApiOperation({ summary: '重试视频生成任务' })
  retry(
    @CurrentUser() user: JwtUserPayload,
    @Param('taskId') taskId: string,
  ) {
    return this.videoTasksService.retry(user.userId, taskId);
  }
}
