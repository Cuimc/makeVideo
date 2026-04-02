import type {
  ReferenceAnalysisResult,
  ReferenceVideoUploadPayload,
} from '@make-video/shared';
import { Injectable } from '@nestjs/common';
import { BusinessException } from '../../common/exceptions/business.exception';
import { paginateItems, type PagingInput } from '../../common/utils/pagination';

const referencesByUser = new Map<string, ReferenceAnalysisResult[]>([
  [
    'user_demo',
    [
      {
        id: 'reference_1',
        title: '科技解读参考视频',
        status: 'success',
        theme: '科技与养老融合',
        structureSummary: '先抛观点，再给数据，最后给建议。',
        scriptSummary: '适合用于口播解读类视频。',
        storyboardSummary: '以数据图表和社区场景穿插为主。',
        applicableScenes: ['行业解读', '政策分析'],
        createdAt: '2026-04-01T11:30:00.000Z',
      },
    ],
  ],
]);

@Injectable()
export class ReferencesService {
  list(userId: string, paging: PagingInput) {
    return paginateItems(
      this.getReferences(userId).slice().sort(sortByCreatedAtDesc),
      paging,
    );
  }

  analyze(
    userId: string,
    payload: ReferenceVideoUploadPayload,
  ): ReferenceAnalysisResult {
    const references = this.getReferences(userId);
    const result: ReferenceAnalysisResult = {
      id: `reference_${references.length + 1}`,
      title: payload.name,
      status: 'success',
      theme: '热点解读参考',
      structureSummary: '开场抛观点，中段给依据，结尾强化行动建议。',
      scriptSummary: `参考视频《${payload.name}》适合拆成口播解读脚本。`,
      storyboardSummary: '可采用新闻标题、数据图表、场景镜头交替呈现。',
      applicableScenes: ['行业解读', '热点复盘'],
      createdAt: new Date().toISOString(),
    };

    references.unshift(result);

    return result;
  }

  remove(userId: string, referenceId: string) {
    const references = this.getReferences(userId);
    const index = references.findIndex((item) => item.id === referenceId);

    if (index === -1) {
      throw new BusinessException(404, '参考视频不存在', 404);
    }

    references.splice(index, 1);
  }

  private getReferences(userId: string) {
    const existing = referencesByUser.get(userId);

    if (existing) {
      return existing;
    }

    const created: ReferenceAnalysisResult[] = [];
    referencesByUser.set(userId, created);
    return created;
  }
}

function sortByCreatedAtDesc<T extends { createdAt: string }>(left: T, right: T) {
  return right.createdAt.localeCompare(left.createdAt);
}
