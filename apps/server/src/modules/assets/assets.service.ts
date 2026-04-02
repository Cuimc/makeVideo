import type {
  ImageUploadPayload,
  ReferenceImage,
} from '@make-video/shared';
import { Injectable } from '@nestjs/common';
import { BusinessException } from '../../common/exceptions/business.exception';
import { paginateItems, type PagingInput } from '../../common/utils/pagination';

const imagesByUser = new Map<string, ReferenceImage[]>([
  [
    'user_demo',
    [
      {
        id: 'image_1',
        name: '机器人养老场景图',
        url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
        size: 245760,
        createdAt: '2026-04-01T11:00:00.000Z',
      },
      {
        id: 'image_2',
        name: '社区养老服务图',
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
        size: 198000,
        createdAt: '2026-04-01T11:10:00.000Z',
      },
    ],
  ],
]);

@Injectable()
export class AssetsService {
  list(userId: string, paging: PagingInput) {
    return paginateItems(
      this.getImages(userId).slice().sort(sortByCreatedAtDesc),
      paging,
    );
  }

  uploadImage(userId: string, payload: ImageUploadPayload): ReferenceImage {
    const images = this.getImages(userId);
    const image: ReferenceImage = {
      id: `image_${images.length + 1}`,
      name: payload.name,
      url: payload.url,
      size: payload.size,
      createdAt: new Date().toISOString(),
    };

    images.unshift(image);

    return image;
  }

  remove(userId: string, imageId: string) {
    const images = this.getImages(userId);
    const index = images.findIndex((item) => item.id === imageId);

    if (index === -1) {
      throw new BusinessException(404, '素材不存在', 404);
    }

    images.splice(index, 1);
  }

  private getImages(userId: string) {
    const existing = imagesByUser.get(userId);

    if (existing) {
      return existing;
    }

    const created: ReferenceImage[] = [];
    imagesByUser.set(userId, created);
    return created;
  }
}

function sortByCreatedAtDesc<T extends { createdAt: string }>(left: T, right: T) {
  return right.createdAt.localeCompare(left.createdAt);
}
