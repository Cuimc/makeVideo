import { createPinia } from 'pinia';
import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PointHistoryView from './PointHistoryView.vue';

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

describe('PointHistoryView', () => {
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
    getPointPackages.mockResolvedValue([]);
    getRechargeRecords.mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      pageSize: 20,
    });
    getPointRecords.mockResolvedValue({
      items: [
        {
          id: 'record-1',
          type: 'recharge',
          label: '充值到账',
          points: 1000,
          createdAt: '2026-04-01 10:00:00',
        },
        {
          id: 'record-2',
          type: 'consume',
          label: '视频生成消耗',
          points: -320,
          createdAt: '2026-04-01 10:30:00',
          relatedTaskId: 'task-1',
        },
        {
          id: 'record-3',
          type: 'refund',
          label: '任务失败返还',
          points: 320,
          createdAt: '2026-04-01 10:35:00',
          relatedTaskId: 'task-1',
        },
      ],
      total: 3,
      page: 1,
      pageSize: 20,
    });
  });

  it('shows only recharge consume and refund on point history page', async () => {
    const wrapper = mount(PointHistoryView, {
      global: {
        plugins: [createPinia()],
      },
    });

    await flushPromises();

    expect(wrapper.text()).toContain('充值');
    expect(wrapper.text()).toContain('消耗');
    expect(wrapper.text()).toContain('返还');
  });
});
