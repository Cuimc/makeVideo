import type { ProjectCreationResult, ProjectDetail } from '@make-video/shared';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  JwtAuthGuard,
  type JwtUserPayload,
} from '../../common/guards/jwt-auth.guard';
import type { SaveProjectDraftPayload } from '@make-video/shared';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: '创建项目' })
  createProject(
    @CurrentUser() user: JwtUserPayload,
    @Body() dto: CreateProjectDto,
  ): Promise<ProjectCreationResult> {
    return this.projectsService.create(user.userId, dto);
  }

  @Get(':projectId')
  @ApiOperation({ summary: '获取项目详情' })
  getDetail(
    @CurrentUser() user: JwtUserPayload,
    @Param('projectId') projectId: string,
  ): ProjectDetail {
    return this.projectsService.getDetail(user.userId, projectId);
  }

  @Put(':projectId')
  @ApiOperation({ summary: '保存项目草稿' })
  saveDraft(
    @CurrentUser() user: JwtUserPayload,
    @Param('projectId') projectId: string,
    @Body() payload: SaveProjectDraftPayload,
  ): ProjectDetail {
    return this.projectsService.saveDraft(user.userId, projectId, payload);
  }

  @Post(':projectId/confirm')
  @HttpCode(200)
  @ApiOperation({ summary: '确认项目脚本与分镜' })
  confirm(
    @CurrentUser() user: JwtUserPayload,
    @Param('projectId') projectId: string,
  ): ProjectDetail {
    return this.projectsService.confirm(user.userId, projectId);
  }
}
