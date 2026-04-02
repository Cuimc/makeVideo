import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  JwtAuthGuard,
  type JwtUserPayload,
} from '../../common/guards/jwt-auth.guard';
import { LibraryService } from './library.service';

@ApiTags('library')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get('videos')
  @ApiOperation({ summary: '获取成品库列表' })
  list(
    @CurrentUser() user: JwtUserPayload,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('projectName') projectName?: string,
    @Query('createdAt') createdAt?: string,
  ) {
    return this.libraryService.list(user.userId, {
      page,
      pageSize,
      projectName,
      createdAt,
    });
  }

  @Delete('videos/:videoId')
  @HttpCode(200)
  @ApiOperation({ summary: '删除成片' })
  remove(
    @CurrentUser() user: JwtUserPayload,
    @Param('videoId') videoId: string,
  ) {
    return this.libraryService.remove(user.userId, videoId);
  }
}
