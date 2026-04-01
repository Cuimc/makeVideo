import { createPinia } from 'pinia';
import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DashboardView from './DashboardView.vue';

const { push, getSummary } = vi.hoisted(() => ({
  push: vi.fn(),
  getSummary: vi.fn(),
}));

vi.mock('../../api/client', () => ({
  apiClient: {
    dashboard: {
      getSummary,
    },
  },
}));

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>();

  return {
    ...actual,
    useRouter: () => ({
      push,
    }),
  };
});

describe('DashboardView', () => {
  beforeEach(() => {
    push.mockReset();
    getSummary.mockReset();
  });

  it('renders quick entries and recent sections', async () => {
    getSummary.mockResolvedValue({
      summary: {
        pointBalance: 2680,
        recentProjectCount: 1,
        recentVideoCount: 1,
      },
      recentProjects: [
        {
          id: 'project-1',
          name: '机器人养老趋势解读',
          keyword: '机器人',
          status: 'script_pending_confirm',
          updatedAt: '2026-04-01 10:30:00',
        },
      ],
      recentVideos: [
        {
          id: 'video-1',
          projectId: 'project-1',
          title: '机器人养老趋势解读-成片 01',
          coverUrl: 'https://example.com/mock-cover-1.jpg',
          createdAt: '2026-04-01 11:20:00',
        },
      ],
    });

    const wrapper = mount(DashboardView, {
      global: {
        plugins: [createPinia()],
      },
    });

    await flushPromises();

    expect(wrapper.text()).toContain('新建项目');
    expect(wrapper.text()).toContain('最近项目');
    expect(wrapper.text()).toContain('最近成品视频');
  });
});
