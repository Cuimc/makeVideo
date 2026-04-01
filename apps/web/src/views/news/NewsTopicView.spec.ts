import { createPinia } from 'pinia';
import { flushPromises, mount } from '@vue/test-utils';
import { NButton } from 'naive-ui';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import NewsTopicView from './NewsTopicView.vue';

const { push, search, createProject } = vi.hoisted(() => ({
  push: vi.fn(),
  search: vi.fn(),
  createProject: vi.fn(),
}));

vi.mock('../../api/client', () => ({
  apiClient: {
    news: {
      search,
      createProject,
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

describe('NewsTopicView', () => {
  beforeEach(() => {
    push.mockReset();
    search.mockReset();
    createProject.mockReset();
  });

  it('supports selecting multiple news items and next step action', async () => {
    search.mockResolvedValue([
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
    ]);
    createProject.mockResolvedValue({
      id: 'project-1',
      name: '养老热点内容创作',
      status: 'script_pending_confirm',
      createdAt: '2026-04-01 10:10:00',
    });

    const wrapper = mount(NewsTopicView, {
      global: {
        plugins: [createPinia()],
      },
    });

    expect(wrapper.text()).toContain('新闻选题');
    expect(wrapper.text()).toContain('搜索新闻');
    expect(wrapper.text()).toContain('下一步：进入 AI 创作');

    const getButtons = () => wrapper.findAllComponents(NButton);

    expect(getButtons().at(-1)?.props('disabled')).toBe(true);

    await wrapper.get('input').setValue('养老');
    await getButtons()[0]?.trigger('click');
    await flushPromises();

    expect(search).toHaveBeenCalledWith({
      keyword: '养老',
    });
    expect(wrapper.text()).toContain('机器人养老成为社区服务新热点');
    expect(wrapper.text()).toContain('银发经济政策加速落地');

    const optionButtons = wrapper
      .findAll('button')
      .filter((button) => button.text().includes('选择新闻'));

    expect(optionButtons).toHaveLength(2);

    await optionButtons[0]?.trigger('click');
    await flushPromises();

    expect(wrapper.text()).toContain('已选新闻');
    expect(wrapper.text()).toContain('机器人养老成为社区服务新热点');
    expect(getButtons().at(-1)?.props('disabled')).toBe(false);

    await getButtons().at(-1)?.trigger('click');
    await flushPromises();

    expect(createProject).toHaveBeenCalledWith({
      keyword: '养老',
      newsIds: ['news-1'],
    });
    expect(push).toHaveBeenCalledWith({
      name: 'project-workspace',
      params: {
        projectId: 'project-1',
      },
    });
  });
});
