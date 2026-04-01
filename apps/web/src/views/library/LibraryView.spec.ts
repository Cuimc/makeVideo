import { createPinia } from 'pinia';
import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LibraryView from './LibraryView.vue';

const { list, remove } = vi.hoisted(() => ({
  list: vi.fn(),
  remove: vi.fn(),
}));

vi.mock('../../api/client', () => ({
  apiClient: {
    library: {
      list,
      remove,
    },
  },
}));

describe('LibraryView', () => {
  beforeEach(() => {
    list.mockReset();
    remove.mockReset();

    list.mockResolvedValue({
      items: [
        {
          id: 'video-1',
          projectId: 'project-1',
          title: '机器人养老趋势解读-成片 01',
          coverUrl: 'https://example.com/video-1.jpg',
          previewUrl: 'https://example.com/video-1.mp4',
          downloadUrl: 'https://example.com/video-1-download.mp4',
          createdAt: '2026-04-01 14:00:00',
          durationSeconds: 60,
        },
      ],
      total: 1,
      page: 1,
      pageSize: 20,
    });
  });

  it('renders generated video library actions', async () => {
    const wrapper = mount(LibraryView, {
      global: {
        plugins: [createPinia()],
      },
    });

    await flushPromises();

    expect(wrapper.text()).toContain('成品库');
    expect(wrapper.text()).toContain('下载');
  });
});
