import { createPinia } from 'pinia';
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import VideoGenerateView from './VideoGenerateView.vue';

const { push, getDetail, submit } = vi.hoisted(() => ({
  push: vi.fn(),
  getDetail: vi.fn(),
  submit: vi.fn(),
}));

vi.mock('../../api/client', () => ({
  apiClient: {
    project: {
      getDetail,
    },
    task: {
      submit,
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

function findButton(wrapper: VueWrapper, label: string) {
  const button = wrapper.findAll('button').find((item) => item.text().includes(label));
  expect(button).toBeDefined();
  return button!;
}

describe('VideoGenerateView', () => {
  beforeEach(() => {
    push.mockReset();
    getDetail.mockReset();
    submit.mockReset();

    getDetail.mockResolvedValue({
      id: 'project-1',
      name: '机器人养老趋势解读',
      keyword: '养老',
      status: 'script_confirmed',
      newsItems: [],
      form: {
        videoType: '口播解读',
        style: '专业理性',
        platform: '抖音',
        durationSeconds: 60,
        targetAudience: '银发经济从业者',
      },
      scriptDraft: '这是当前项目的脚本摘要。',
      storyboardDraft: [
        {
          id: 'scene-1',
          title: '镜头 1',
          durationSeconds: 8,
          visualPrompt: '机器人照顾老人',
          narration: '机器人养老正在走进真实社区。',
          subtitle: '机器人养老',
        },
      ],
      referenceImageIds: ['image-1', 'image-2'],
      referenceVideoIds: [],
      referenceResultIds: ['reference-1'],
      updatedAt: '2026-04-01 11:20:00',
    });
    submit.mockResolvedValue({
      id: 'task-1',
      projectId: 'project-1',
      projectName: '机器人养老趋势解读',
      status: 'queued',
      progressText: '已进入队列',
      pointCost: 320,
      refundPoints: 0,
      createdAt: '2026-04-01 12:00:00',
      updatedAt: '2026-04-01 12:00:00',
      resultVideoIds: [],
    });
  });

  it('shows generation config, balance and estimated points', async () => {
    const wrapper = mount(VideoGenerateView, {
      global: {
        plugins: [createPinia()],
      },
    });

    await flushPromises();

    expect(wrapper.text()).toContain('视频生成');
    expect(wrapper.text()).toContain('预计积分消耗');
    expect(wrapper.text()).toContain('提交生成任务');
    expect(wrapper.text()).toContain('当前积分余额');
  });

  it('submits generation task and redirects to task center', async () => {
    const wrapper = mount(VideoGenerateView, {
      global: {
        plugins: [createPinia()],
      },
    });

    await flushPromises();

    await findButton(wrapper, '提交生成任务').trigger('click');
    await flushPromises();

    expect(submit).toHaveBeenCalledWith(
      'project-1',
      expect.objectContaining({
        count: 1,
        aspectRatio: '9:16',
      }),
    );
    expect(push).toHaveBeenCalledWith({
      name: 'task-center',
    });
  });
});
