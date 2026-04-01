import { createPinia } from 'pinia';
import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import RechargeView from './RechargeView.vue';

const { getSummary, getPointPackages, getPointRecords, getRechargeRecords } = vi.hoisted(() => ({
  getSummary: vi.fn(),
  getPointPackages: vi.fn(),
  getPointRecords: vi.fn(),
  getRechargeRecords: vi.fn(),
}));

vi.mock('../../api/client', () => ({
  apiClient: {
    billing: {
      getSummary,
      getPointPackages,
      getPointRecords,
      getRechargeRecords,
    },
  },
}));

describe('RechargeView', () => {
  beforeEach(() => {
    getSummary.mockReset();
    getPointPackages.mockReset();
    getPointRecords.mockReset();
    getRechargeRecords.mockReset();

    getSummary.mockResolvedValue({
      balance: 2680,
      totalRecharged: 5000,
      totalConsumed: 2120,
      totalRefunded: 120,
    });
    getPointPackages.mockResolvedValue([
      {
        id: 'pack-100',
        points: 100,
        price: 10,
        label: '新手入门',
      },
      {
        id: 'pack-1000',
        points: 1000,
        price: 90,
        label: '高频创作',
      },
    ]);
    getRechargeRecords.mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      pageSize: 20,
    });
    getPointRecords.mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      pageSize: 20,
    });
  });

  it('shows fixed point packages on recharge page', async () => {
    const wrapper = mount(RechargeView, {
      global: {
        plugins: [createPinia()],
      },
    });

    await flushPromises();

    expect(wrapper.text()).toContain('100 积分');
    expect(wrapper.text()).toContain('1000 积分');
  });
});
