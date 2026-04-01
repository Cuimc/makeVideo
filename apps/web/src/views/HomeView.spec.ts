import { createPinia } from 'pinia';
import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import HomeView from './HomeView.vue';

const { getHealth } = vi.hoisted(() => ({
  getHealth: vi.fn(),
}));

vi.mock('../apis/client', () => ({
  apiClient: {
    getHealth,
  },
}));

describe('HomeView', () => {
  beforeEach(() => {
    getHealth.mockReset();
  });

  it('renders backend health status loaded through the sdk client', async () => {
    getHealth.mockResolvedValue({
      status: 'ok',
      service: 'make-video-server',
      timestamp: '2026-04-01T00:00:00.000Z',
    });

    const wrapper = mount(HomeView, {
      global: {
        plugins: [createPinia()],
      },
    });

    await flushPromises();

    expect(getHealth).toHaveBeenCalledTimes(1);
    expect(wrapper.text()).toContain('API 状态ok');
    expect(wrapper.text()).toContain('服务名make-video-server');
  });
});
