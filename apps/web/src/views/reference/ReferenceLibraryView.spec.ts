import { createPinia } from 'pinia';
import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ReferenceLibraryView from './ReferenceLibraryView.vue';

const { list, uploadVideo, remove } = vi.hoisted(() => ({
  list: vi.fn(),
  uploadVideo: vi.fn(),
  remove: vi.fn(),
}));

vi.mock('../../api/client', () => ({
  apiClient: {
    reference: {
      list,
      uploadVideo,
      remove,
    },
  },
}));

describe('ReferenceLibraryView', () => {
  beforeEach(() => {
    list.mockReset();
    uploadVideo.mockReset();
    remove.mockReset();

    list.mockResolvedValue({
      items: [
        {
          id: 'reference-1',
          title: '科技解读参考视频',
          status: 'success',
          theme: '科技与养老融合',
          structureSummary: '先抛观点，再给数据，最后给建议。',
          scriptSummary: '适合用于口播解读类视频。',
          storyboardSummary: '以数据图表和社区场景穿插为主。',
          applicableScenes: ['行业解读', '政策分析'],
          createdAt: '2026-04-01 13:20:00',
        },
      ],
      total: 1,
      page: 1,
      pageSize: 20,
    });
  });

  it('renders reference analysis states and detail entry', async () => {
    const wrapper = mount(ReferenceLibraryView, {
      global: {
        plugins: [createPinia()],
      },
    });

    await flushPromises();

    expect(wrapper.text()).toContain('脚本参考库');
    expect(wrapper.text()).toContain('分析状态');
    expect(wrapper.text()).toContain('分析成功');
  });
});
