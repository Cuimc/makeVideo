import type { LibraryVideo } from '@make-video/shared';
import { Injectable } from '@nestjs/common';
import { BusinessException } from '../../common/exceptions/business.exception';
import { paginateItems, type PagingInput } from '../../common/utils/pagination';

interface LibraryListInput extends PagingInput {
  projectName?: string;
  createdAt?: string;
}

const videosByUser = new Map<string, LibraryVideo[]>([
  [
    'user_demo',
    [
      {
        id: 'video_1',
        projectId: 'project_1',
        title: '机器人养老趋势解读-成片 01',
        coverUrl:
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
        previewUrl: 'https://example.com/videos/video_1.mp4',
        downloadUrl: 'https://example.com/videos/video_1-download.mp4',
        createdAt: '2026-04-01T12:40:00.000Z',
        durationSeconds: 60,
      },
    ],
  ],
]);

@Injectable()
export class LibraryService {
  list(userId: string, input: LibraryListInput) {
    return this.listByUser(userId, input);
  }

  listByUser(userId: string, input: LibraryListInput) {
    const projectNameKeyword = input.projectName?.trim();
    const createdAtKeyword = input.createdAt?.trim();
    const filtered = this.getVideos(userId)
      .filter((item) => {
        if (
          projectNameKeyword &&
          !item.title.toLowerCase().includes(projectNameKeyword.toLowerCase())
        ) {
          return false;
        }

        if (createdAtKeyword && !item.createdAt.includes(createdAtKeyword)) {
          return false;
        }

        return true;
      })
      .slice()
      .sort(sortByCreatedAtDesc);

    return paginateItems(filtered, input);
  }

  remove(userId: string, videoId: string) {
    const videos = this.getVideos(userId);
    const index = videos.findIndex((item) => item.id === videoId);

    if (index === -1) {
      throw new BusinessException(404, '成片不存在', 404);
    }

    videos.splice(index, 1);
  }

  private getVideos(userId: string) {
    const existing = videosByUser.get(userId);

    if (existing) {
      return existing;
    }

    const created: LibraryVideo[] = [];
    videosByUser.set(userId, created);
    return created;
  }
}

function sortByCreatedAtDesc<T extends { createdAt: string }>(left: T, right: T) {
  return right.createdAt.localeCompare(left.createdAt);
}
