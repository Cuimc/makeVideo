import type { ScriptGenerationResult } from '@make-video/shared';
import { Controller, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  JwtAuthGuard,
  type JwtUserPayload,
} from '../../common/guards/jwt-auth.guard';
import { ScriptsService } from './scripts.service';

@ApiTags('scripts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/script')
export class ScriptsController {
  constructor(private readonly scriptsService: ScriptsService) {}

  @Post('generate')
  @HttpCode(200)
  @ApiOperation({ summary: '生成项目脚本' })
  generate(
    @CurrentUser() user: JwtUserPayload,
    @Param('projectId') projectId: string,
  ): Promise<ScriptGenerationResult> {
    return this.scriptsService.generate(projectId, user.userId);
  }
}
