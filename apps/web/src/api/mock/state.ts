import type {
  BillingSummary,
  DashboardData,
  LibraryVideo,
  NewsItem,
  PointPackage,
  PointRecord,
  ProjectCreationResult,
  ProjectDetail,
  ProjectStatus,
  ReferenceAnalysisResult,
  ReferenceImage,
  RechargeRecord,
  StoryboardScene,
  UserProfile,
  VideoGenerationForm,
  VideoGenerationTask,
} from '@make-video/shared';
import {
  HEALTH_SERVICE_NAME,
  HEALTH_STATUS_OK,
  type HealthResponse,
} from '@make-video/shared';

export const mockProfile: UserProfile = {
  id: 'user-1',
  phone: '13800138000',
  maskedPhone: '138****8000',
  nickname: '内容工坊',
  pointBalance: 2680,
  createdAt: '2026-04-01 09:00:00',
};

export const mockNewsPool: NewsItem[] = [
  {
    id: 'news-1',
    title: '机器人养老成为社区服务新热点',
    summary: '多地开始试点机器人养老服务，市场关注度持续上升。',
    source: '科技日报',
    publishedAt: '2026-04-01 08:30:00',
    keyword: '养老',
    url: 'https://example.com/news-1',
  },
  {
    id: 'news-2',
    title: '银发经济政策加速落地',
    summary: '围绕银发经济的扶持政策密集发布，带动新一轮内容需求。',
    source: '人民日报',
    publishedAt: '2026-04-01 10:00:00',
    keyword: '养老',
    url: 'https://example.com/news-2',
  },
  {
    id: 'news-3',
    title: 'AI 硬件创业再次升温',
    summary: 'AI 终端和机器人赛道融资活跃，内容传播热度上升。',
    source: '36Kr',
    publishedAt: '2026-04-01 09:20:00',
    keyword: '科技',
    url: 'https://example.com/news-3',
  },
];

function createScene(
  id: string,
  title: string,
  durationSeconds: number,
  visualPrompt: string,
  narration: string,
  subtitle: string,
): StoryboardScene {
  return {
    id,
    title,
    durationSeconds,
    visualPrompt,
    narration,
    subtitle,
  };
}

function createProjectDetail(
  id: string,
  name: string,
  keyword: string,
  status: ProjectStatus,
  newsItems: NewsItem[],
): ProjectDetail {
  return {
    id,
    name,
    keyword,
    status,
    newsItems,
    form: {
      videoType: '口播解读',
      style: '专业理性',
      platform: '抖音',
      durationSeconds: 60,
      targetAudience: '泛科技与行业观察用户',
    },
    scriptDraft: '开场先抛出核心观点，再解释热点背后的行业趋势与传播价值。',
    storyboardDraft: [
      createScene(
        `${id}-scene-1`,
        '趋势引入',
        8,
        '行业数据图表与新闻标题叠加出现',
        '机器人养老正在从概念走向真实场景。',
        '趋势正在落地',
      ),
      createScene(
        `${id}-scene-2`,
        '观点展开',
        12,
        '社区养老中心的服务画面与专家访谈切换',
        '政策和市场需求共同推动了这一轮增长。',
        '政策与需求双驱动',
      ),
    ],
    referenceImageIds: ['image-1'],
    referenceVideoIds: ['reference-video-1'],
    referenceResultIds: ['reference-1'],
    updatedAt: '2026-04-01 10:30:00',
  };
}

export const mockProjects = new Map<string, ProjectDetail>([
  [
    'project-1',
    createProjectDetail(
      'project-1',
      '机器人养老趋势解读',
      '养老',
      'script_confirmed',
      mockNewsPool.slice(0, 2),
    ),
  ],
]);

export const mockAssets: ReferenceImage[] = [
  {
    id: 'image-1',
    name: '机器人养老场景图',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    size: 245760,
    createdAt: '2026-04-01 11:00:00',
  },
  {
    id: 'image-2',
    name: '社区养老服务图',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    size: 198000,
    createdAt: '2026-04-01 11:10:00',
  },
];

export const mockReferences: ReferenceAnalysisResult[] = [
  {
    id: 'reference-1',
    title: '科技解读参考视频',
    status: 'success',
    theme: '科技与养老融合',
    structureSummary: '先抛观点，再给数据，最后给建议。',
    scriptSummary: '适合用于口播解读类视频。',
    storyboardSummary: '以数据图表和社区场景穿插为主。',
    applicableScenes: ['行业解读', '政策分析'],
    createdAt: '2026-04-01 11:30:00',
  },
];

export const mockVideos: LibraryVideo[] = [
  {
    id: 'video-1',
    projectId: 'project-1',
    title: '机器人养老趋势解读-成片 01',
    coverUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    previewUrl: 'https://example.com/video-1.mp4',
    downloadUrl: 'https://example.com/video-1-download.mp4',
    createdAt: '2026-04-01 12:40:00',
    durationSeconds: 60,
  },
];

export const mockTasks: VideoGenerationTask[] = [
  {
    id: 'task-1',
    projectId: 'project-1',
    projectName: '机器人养老趋势解读',
    status: 'success',
    progressText: '视频生成完成',
    pointCost: 320,
    refundPoints: 0,
    createdAt: '2026-04-01 12:00:00',
    updatedAt: '2026-04-01 12:20:00',
    resultVideoIds: ['video-1'],
  },
  {
    id: 'task-2',
    projectId: 'project-1',
    projectName: '机器人养老趋势解读',
    status: 'failed',
    progressText: '渲染失败，可重新提交',
    pointCost: 320,
    refundPoints: 320,
    createdAt: '2026-04-01 12:30:00',
    updatedAt: '2026-04-01 12:35:00',
    resultVideoIds: [],
  },
];

export const mockPointPackages: PointPackage[] = [
  {
    id: 'pack-100',
    points: 100,
    price: 10,
    label: '新手入门',
  },
  {
    id: 'pack-500',
    points: 500,
    price: 45,
    label: '高频创作',
  },
  {
    id: 'pack-1000',
    points: 1000,
    price: 90,
    label: '团队推荐',
  },
];

export const mockPointRecords: PointRecord[] = [
  {
    id: 'record-1',
    type: 'recharge',
    label: '充值到账',
    points: 3000,
    createdAt: '2026-03-31 10:00:00',
  },
  {
    id: 'record-2',
    type: 'consume',
    label: '视频生成消耗',
    points: -320,
    createdAt: '2026-04-01 12:00:00',
    relatedTaskId: 'task-1',
  },
  {
    id: 'record-3',
    type: 'consume',
    label: '视频生成消耗',
    points: -320,
    createdAt: '2026-04-01 12:30:00',
    relatedTaskId: 'task-2',
  },
  {
    id: 'record-4',
    type: 'refund',
    label: '任务失败返还',
    points: 320,
    createdAt: '2026-04-01 12:35:00',
    relatedTaskId: 'task-2',
  },
];

export const mockRechargeRecords: RechargeRecord[] = [
  {
    id: 'recharge-1',
    packageId: 'pack-1000',
    packagePoints: 1000,
    amount: 90,
    channel: 'wechat',
    createdAt: '2026-03-31 10:00:00',
    status: 'success',
  },
  {
    id: 'recharge-2',
    packageId: 'pack-500',
    packagePoints: 500,
    amount: 45,
    channel: 'alipay',
    createdAt: '2026-04-01 09:30:00',
    status: 'success',
  },
];

export function buildHealthResponse(): HealthResponse {
  return {
    status: HEALTH_STATUS_OK,
    service: HEALTH_SERVICE_NAME,
    timestamp: new Date('2026-04-01T12:00:00+08:00').toISOString(),
  };
}

export function buildDashboardData(): DashboardData {
  const recentProjects = Array.from(mockProjects.values())
    .slice()
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 4)
    .map((item) => ({
      id: item.id,
      name: item.name,
      keyword: item.keyword,
      status: item.status,
      updatedAt: item.updatedAt,
    }));

  const recentVideos = mockVideos.slice(0, 6);

  return {
    summary: {
      pointBalance: mockProfile.pointBalance,
      recentProjectCount: recentProjects.length,
      recentVideoCount: recentVideos.length,
    },
    recentProjects,
    recentVideos,
  };
}

export function buildBillingSummary(): BillingSummary {
  const totalRecharged = mockPointRecords
    .filter((item) => item.type === 'recharge')
    .reduce((sum, item) => sum + item.points, 0);
  const totalConsumed = Math.abs(
    mockPointRecords
      .filter((item) => item.type === 'consume')
      .reduce((sum, item) => sum + item.points, 0),
  );
  const totalRefunded = mockPointRecords
    .filter((item) => item.type === 'refund')
    .reduce((sum, item) => sum + item.points, 0);

  return {
    balance: mockProfile.pointBalance,
    totalRecharged,
    totalConsumed,
    totalRefunded,
  };
}

export function createProjectFromNews(keyword: string, newsIds: string[]): ProjectCreationResult {
  const id = `project-${mockProjects.size + 1}`;
  const selectedNews = mockNewsPool.filter((item) => newsIds.includes(item.id));
  const detail = createProjectDetail(
    id,
    `${keyword || '热点'}选题视频创作`,
    keyword,
    'script_pending_confirm',
    selectedNews.length ? selectedNews : mockNewsPool.slice(0, 1),
  );

  mockProjects.set(id, detail);

  return {
    id: detail.id,
    name: detail.name,
    status: detail.status,
    createdAt: '2026-04-01 13:00:00',
  };
}

export function createVideoTask(projectId: string, payload: VideoGenerationForm) {
  const project = mockProjects.get(projectId);
  const taskId = `task-${mockTasks.length + 1}`;
  const cost = payload.count * 300 + (payload.withSubtitle ? 20 : 0);
  const task: VideoGenerationTask = {
    id: taskId,
    projectId,
    projectName: project?.name ?? '未命名项目',
    status: 'queued',
    progressText: '已进入队列，等待生成',
    pointCost: cost,
    refundPoints: 0,
    createdAt: '2026-04-01 13:20:00',
    updatedAt: '2026-04-01 13:20:00',
    resultVideoIds: [],
  };

  mockTasks.unshift(task);
  mockProfile.pointBalance -= cost;
  mockPointRecords.unshift({
    id: `record-${mockPointRecords.length + 1}`,
    type: 'consume',
    label: '视频生成消耗',
    points: -cost,
    createdAt: '2026-04-01 13:20:00',
    relatedTaskId: taskId,
  });

  return task;
}

export function retryVideoTask(taskId: string) {
  const task = mockTasks.find((item) => item.id === taskId);

  if (!task) {
    return null;
  }

  task.status = 'queued';
  task.progressText = '已重新进入队列';
  task.updatedAt = '2026-04-01 13:40:00';
  task.refundPoints = 0;

  return task;
}
