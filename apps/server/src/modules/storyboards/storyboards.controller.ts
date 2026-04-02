import type { StoryboardGenerationResult } from '@make-video/shared';
import { Controller, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  JwtAuthGuard,
  type JwtUserPayload,
} from '../../common/guards/jwt-auth.guard';
import { StoryboardsService } from './storyboards.service';

@ApiTags('storyboards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/storyboard')
export class StoryboardsController {
  constructor(private readonly storyboardsService: StoryboardsService) {}

  @Post('generate')
  @HttpCode(200)
  @ApiOperation({ summary: '生成项目分镜' })
  generate(
    @CurrentUser() user: JwtUserPayload,
    @Param('projectId') projectId: string,
  ): Promise<StoryboardGenerationResult> {
    return this.storyboardsService.generate(projectId, user.userId);
  }
}
