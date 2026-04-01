import { createPinia } from 'pinia';
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AiWorkspaceView from './AiWorkspaceView.vue';

const {
  push,
  getDetail,
  generateScript,
  generateStoryboard,
  saveDraft,
  confirm,
} = vi.hoisted(() => ({
  push: vi.fn(),
  getDetail: vi.fn(),
  generateScript: vi.fn(),
  generateStoryboard: vi.fn(),
  saveDraft: vi.fn(),
  confirm: vi.fn(),
}));

vi.mock('../../api/client', () => ({
  apiClient: {
    project: {
      getDetail,
      generateScript,
      generateStoryboard,
      saveDraft,
      confirm,
    },
  },
}));

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>();

  return {
    ...actual,
    useRoute: () => ({
      params: {
        projectId: 'project-1',
      },
    }),
    useRouter: () => ({
      push,
    }),
  };
});

const detail = {
  id: 'project-1',
  name: '机器人养老趋势解读',
  keyword: '养老',
  status: 'script_pending_confirm',
  newsItems: [
    {
      id: 'news-1',
      title: '机器人养老成为社区服务新热点',
      summary: '多地开始试点机器人养老服务，市场关注度持续上升。',
      source: '科技日报',
      publishedAt: '2026-04-01 08:30:00',
      keyword: '养老',
      url: 'https://example.com/news-1',
    },
  ],
  form: {
    videoType: '口播解读',
    style: '专业理性',
    platform: '抖音',
    durationSeconds: 60,
    targetAudience: '银发经济从业者',
  },
  scriptDraft: '开场先抛出机器人养老正在成为新风口。',
  storyboardDraft: [
    {
      id: 'scene-1',
      title: '镜头 1',
      durationSeconds: 8,
      visualPrompt: '社区养老中心里机器人与老人互动',
      narration: '机器人养老不再只是概念，而是正在落地的服务场景。',
      subtitle: '机器人养老加速落地',
    },
  ],
  referenceImageIds: ['image-1'],
  referenceVideoIds: ['video-1'],
  referenceResultIds: ['reference-1'],
  updatedAt: '2026-04-01 10:30:00',
} as const;

function findButton(wrapper: VueWrapper, label: string) {
  const button = wrapper.findAll('button').find((item) => item.text().includes(label));
  expect(button).toBeDefined();
  return button!;
}

describe('AiWorkspaceView', () => {
  beforeEach(() => {
    push.mockReset();
    getDetail.mockReset();
    generateScript.mockReset();
    generateStoryboard.mockReset();
    saveDraft.mockReset();
    confirm.mockReset();

    getDetail.mockResolvedValue(detail);
    generateScript.mockResolvedValue({
      script: '这是重新生成后的脚本内容。',
      estimatedPointCost: 120,
    });
    generateStoryboard.mockResolvedValue({
      storyboard: [
        {
          id: 'scene-2',
          title: '镜头 2',
          durationSeconds: 10,
          visualPrompt: '展示银发经济相关数据图表',
          narration: '政策支持让机器人养老进入快速发展阶段。',
          subtitle: '政策推动发展',
        },
      ],
      estimatedPointCost: 240,
    });
    saveDraft.mockResolvedValue(detail);
    confirm.mockResolvedValue({
      ...detail,
      status: 'script_confirmed',
    });
  });

  it('renders two-column workspace with script and storyboard sections', async () => {
    const wrapper = mount(AiWorkspaceView, {
      global: {
        plugins: [createPinia()],
      },
    });

    await flushPromises();

    expect(getDetail).toHaveBeenCalledWith('project-1');
    expect(wrapper.text()).toContain('AI 创作');
    expect(wrapper.text()).toContain('创作参数');
    expect(wrapper.text()).toContain('脚本模块');
    expect(wrapper.text()).toContain('分镜模块');
    expect(wrapper.text()).toContain('确认进入下一步');
    expect(wrapper.text()).toContain('机器人养老成为社区服务新热点');
  });

  it('supports generating, saving and confirming project draft', async () => {
    const wrapper = mount(AiWorkspaceView, {
      global: {
        plugins: [createPinia()],
      },
    });

    await flushPromises();

    await findButton(wrapper, '生成脚本').trigger('click');
    await flushPromises();
    expect(generateScript).toHaveBeenCalledWith('project-1');
    expect(wrapper.text()).toContain('这是重新生成后的脚本内容。');

    await findButton(wrapper, '生成分镜').trigger('click');
    await flushPromises();
    expect(generateStoryboard).toHaveBeenCalledWith('project-1');
    expect(wrapper.text()).toContain('镜头 2');

    await findButton(wrapper, '保存').trigger('click');
    await flushPromises();
    expect(saveDraft).toHaveBeenCalledWith(
      'project-1',
      expect.objectContaining({
        scriptDraft: '这是重新生成后的脚本内容。',
      }),
    );

    await findButton(wrapper, '确认进入下一步').trigger('click');
    await flushPromises();
    expect(confirm).toHaveBeenCalledWith('project-1');
    expect(push).toHaveBeenCalledWith({
      name: 'project-video-generate',
      params: {
        projectId: 'project-1',
      },
    });
  });
});
