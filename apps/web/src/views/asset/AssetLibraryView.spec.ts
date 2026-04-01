import { createPinia } from 'pinia';
import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AssetLibraryView from './AssetLibraryView.vue';

const { list, uploadImage, remove } = vi.hoisted(() => ({
  list: vi.fn(),
  uploadImage: vi.fn(),
  remove: vi.fn(),
}));

vi.mock('../../api/client', () => ({
  apiClient: {
    asset: {
      list,
      uploadImage,
      remove,
    },
  },
}));

describe('AssetLibraryView', () => {
  beforeEach(() => {
    list.mockReset();
    uploadImage.mockReset();
    remove.mockReset();

    list.mockResolvedValue({
      items: [
        {
          id: 'image-1',
          name: '养老场景图',
          url: 'https://example.com/image-1.jpg',
          size: 2048,
          createdAt: '2026-04-01 13:00:00',
        },
      ],
      total: 1,
      page: 1,
      pageSize: 20,
    });
  });

  it('renders asset upload and selectable materials', async () => {
    const wrapper = mount(AssetLibraryView, {
      global: {
        plugins: [createPinia()],
      },
    });

    await flushPromises();

    expect(wrapper.text()).toContain('素材库');
    expect(wrapper.text()).toContain('上传参考图');
    expect(wrapper.text()).toContain('选择素材');
  });
});
