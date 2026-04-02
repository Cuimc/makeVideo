import type {
  TaskStatus,
  VideoGenerationTask,
} from '@make-video/shared';
import type { VideoGenerationForm } from '@make-video/shared';
import { Injectable } from '@nestjs/common';
import { BusinessException } from '../../common/exceptions/business.exception';
import { paginateItems, type PagingInput } from '../../common/utils/pagination';
import { ProjectsService } from '../projects/projects.service';

interface VideoTaskRecord extends VideoGenerationTask {
  ownerId: string;
}

interface VideoTaskListInput extends PagingInput {
  status?: TaskStatus;
  projectName?: string;
}

const videoTasks = new Map<string, VideoTaskRecord>([
  [
    'task_1',
    {
      id: 'task_1',
      ownerId: 'user_demo',
      projectId: 'project_1',
      projectName: '机器人养老趋势解读',
      status: 'success',
      progressText: '视频生成完成',
      pointCost: 320,
      refundPoints: 0,
      createdAt: '2026-04-01T12:00:00.000Z',
      updatedAt: '2026-04-01T12:20:00.000Z',
      resultVideoIds: ['video_1'],
    },
  ],
  [
    'task_2',
    {
      id: 'task_2',
      ownerId: 'user_demo',
      projectId: 'project_1',
      projectName: '机器人养老趋势解读',
      status: 'failed',
      progressText: '渲染失败，可重新提交',
      pointCost: 320,
      refundPoints: 320,
      createdAt: '2026-04-01T12:30:00.000Z',
      updatedAt: '2026-04-01T12:35:00.000Z',
      resultVideoIds: [],
    },
  ],
]);

@Injectable()
export class VideoTasksService {
  constructor(private readonly projectsService: ProjectsService) {}

  list(userId: string, query: VideoTaskListInput) {
    const status = query.status?.trim();
    const projectName = query.projectName?.trim().toLowerCase();
    const items = Array.from(videoTasks.values())
      .filter((task) => task.ownerId === userId)
      .filter((task) => {
        if (status && task.status !== status) {
          return false;
        }

        if (
          projectName &&
          !task.projectName.toLowerCase().includes(projectName)
        ) {
          return false;
        }

        return true;
      })
      .slice()
      .sort(sortByCreatedAtDesc)
      .map(stripOwnerId);

    return paginateItems(items, query);
  }

  create(
    userId: string,
    payload: VideoGenerationForm & { projectId: string },
  ): VideoGenerationTask {
    const project = this.projectsService.getDetail(userId, payload.projectId);
    const pointCost =
      payload.count * 300 +
      (payload.withSubtitle ? 20 : 0) +
      (payload.aspectRatio === '16:9' ? 10 : 0);
    const now = new Date().toISOString();
    const task: VideoTaskRecord = {
      id: `task_${videoTasks.size + 1}`,
      ownerId: userId,
      projectId: payload.projectId,
      projectName: project.name,
      status: 'queued',
      progressText: '已进入队列，等待生成',
      pointCost,
      refundPoints: 0,
      createdAt: now,
      updatedAt: now,
      resultVideoIds: [],
    };

    videoTasks.set(task.id, task);

    return stripOwnerId(task);
  }

  retry(userId: string, taskId: string): VideoGenerationTask {
    const task = videoTasks.get(taskId);

    if (!task || task.ownerId !== userId) {
      throw new BusinessException(404, '视频任务不存在', 404);
    }

    task.status = 'queued';
    task.progressText = '已重新提交，等待生成';
    task.refundPoints = 0;
    task.updatedAt = new Date().toISOString();

    return stripOwnerId(task);
  }
}

function stripOwnerId(task: VideoTaskRecord): VideoGenerationTask {
  return {
    id: task.id,
    projectId: task.projectId,
    projectName: task.projectName,
    status: task.status,
    progressText: task.progressText,
    pointCost: task.pointCost,
    refundPoints: task.refundPoints,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    resultVideoIds: task.resultVideoIds,
  };
}

function sortByCreatedAtDesc<T extends { createdAt: string }>(left: T, right: T) {
  return right.createdAt.localeCompare(left.createdAt);
}
