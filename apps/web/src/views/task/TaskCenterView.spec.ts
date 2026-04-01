import { createPinia } from 'pinia';
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TaskCenterView from './TaskCenterView.vue';

const { list, retry } = vi.hoisted(() => ({
  list: vi.fn(),
  retry: vi.fn(),
}));

vi.mock('../../api/client', () => ({
  apiClient: {
    task: {
      list,
      retry,
    },
  },
}));

function findButton(wrapper: VueWrapper, label: string) {
  const button = wrapper.findAll('button').find((item) => item.text().includes(label));
  expect(button).toBeDefined();
  return button!;
}

describe('TaskCenterView', () => {
  beforeEach(() => {
    list.mockReset();
    retry.mockReset();

    list.mockResolvedValue({
      items: [
        {
          id: 'task-1',
          projectId: 'project-1',
          projectName: '机器人养老趋势解读',
          status: 'queued',
          progressText: '正在排队中',
          pointCost: 320,
          refundPoints: 0,
          createdAt: '2026-04-01 12:00:00',
          updatedAt: '2026-04-01 12:00:00',
          resultVideoIds: [],
        },
        {
          id: 'task-2',
          projectId: 'project-2',
          projectName: '银发经济政策分析',
          status: 'failed',
          progressText: '渲染失败，可重新提交',
          pointCost: 320,
          refundPoints: 320,
          createdAt: '2026-04-01 12:05:00',
          updatedAt: '2026-04-01 12:08:00',
          resultVideoIds: [],
        },
      ],
      total: 2,
      page: 1,
      pageSize: 20,
    });
    retry.mockResolvedValue({
      id: 'task-2',
      projectId: 'project-2',
      projectName: '银发经济政策分析',
      status: 'queued',
      progressText: '已重新进入队列',
      pointCost: 320,
      refundPoints: 0,
      createdAt: '2026-04-01 12:05:00',
      updatedAt: '2026-04-01 12:10:00',
      resultVideoIds: [],
    });
  });

  it('renders task filters and retry action for failed tasks', async () => {
    const wrapper = mount(TaskCenterView, {
      global: {
        plugins: [createPinia()],
      },
    });

    await flushPromises();

    expect(wrapper.text()).toContain('任务中心');
    expect(wrapper.text()).toContain('排队中');
    expect(wrapper.text()).toContain('重新提交');
  });

  it('retries failed tasks', async () => {
    const wrapper = mount(TaskCenterView, {
      global: {
        plugins: [createPinia()],
      },
    });

    await flushPromises();

    await findButton(wrapper, '重新提交').trigger('click');
    await flushPromises();

    expect(retry).toHaveBeenCalledWith('task-2');
  });
});
