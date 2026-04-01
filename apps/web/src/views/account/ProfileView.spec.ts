import { createPinia } from 'pinia';
import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '../../stores/auth';
import ProfileView from './ProfileView.vue';

const { push, getSummary } = vi.hoisted(() => ({
  push: vi.fn(),
  getSummary: vi.fn(),
}));

vi.mock('../../api/client', () => ({
  apiClient: {
    billing: {
      getSummary,
      getPointPackages: vi.fn(),
      getPointRecords: vi.fn(),
      getRechargeRecords: vi.fn(),
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

describe('ProfileView', () => {
  beforeEach(() => {
    push.mockReset();
    getSummary.mockReset();

    getSummary.mockResolvedValue({
      balance: 2680,
      totalRecharged: 5000,
      totalConsumed: 2120,
      totalRefunded: 120,
    });
  });

  it('shows masked phone and balance on profile page', async () => {
    const pinia = createPinia();
    const authStore = useAuthStore(pinia);

    authStore.profile = {
      id: 'user-1',
      phone: '13800138000',
      maskedPhone: '138****8000',
      nickname: '内容工坊',
      pointBalance: 2680,
      createdAt: '2026-04-01 09:00:00',
    };

    const wrapper = mount(ProfileView, {
      global: {
        plugins: [pinia],
      },
    });

    await flushPromises();

    expect(wrapper.text()).toContain('个人中心');
    expect(wrapper.text()).toContain('138****8000');
    expect(wrapper.text()).toContain('当前积分余额');
  });
});
