<script setup lang="ts">
import { NAlert, NButton, NCard, NSelect } from 'naive-ui';
import type { TaskStatus } from '@make-video/shared';
import { onMounted } from 'vue';
import PageContainer from '../../components/common/PageContainer.vue';
import EmptyState from '../../components/common/EmptyState.vue';
import ListSkeleton from '../../components/common/ListSkeleton.vue';
import StatusTag from '../../components/common/StatusTag.vue';
import { useTaskStore } from '../../stores/task';

const taskStore = useTaskStore();

async function handleStatusChange(value: TaskStatus | null) {
  taskStore.filters.status = value ?? undefined;
  await taskStore.loadTasks();
}

async function handleRetry(taskId: string) {
  await taskStore.retry(taskId);
}

onMounted(() => {
  void taskStore.loadTasks();
});
</script>

<template>
  <PageContainer
    title="任务中心"
    description="查看视频生成任务状态，重试失败任务并跟踪最新进展"
  >
    <NAlert
      v-if="taskStore.error"
      type="error"
      class="mb-4"
    >
      {{ taskStore.error }}
    </NAlert>

    <NCard class="rounded-[12px]">
      <div class="flex flex-wrap gap-4">
        <div class="min-w-[240px]">
          <div class="mb-2 text-sm font-medium text-[#374151]">
            任务状态
          </div>
          <NSelect
            clearable
            :value="taskStore.filters.status ?? null"
            :options="taskStore.statusOptions"
            placeholder="筛选任务状态"
            @update:value="handleStatusChange"
          />
        </div>
      </div>
    </NCard>

    <ListSkeleton
      v-if="taskStore.loadingTasks"
      :rows="5"
      class="mt-6"
    />

    <div
      v-else-if="taskStore.tasks.length"
      class="mt-6 space-y-4"
    >
      <NCard
        v-for="task in taskStore.tasks"
        :key="task.id"
        class="rounded-[12px]"
      >
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div class="space-y-3">
            <div>
              <div class="text-base font-semibold text-[#111827]">
                {{ task.projectName }}
              </div>
              <p class="mt-1 text-sm text-[#6B7280]">
                {{ task.progressText }}
              </p>
            </div>

            <div class="grid gap-3 text-sm text-[#4B5563] md:grid-cols-2 xl:grid-cols-4">
              <div>任务 ID：{{ task.id }}</div>
              <div>
                状态：
                <StatusTag
                  category="task"
                  :status="task.status"
                />
              </div>
              <div>积分消耗：{{ task.pointCost }}</div>
              <div>返还积分：{{ task.refundPoints }}</div>
              <div>创建时间：{{ task.createdAt }}</div>
              <div>更新时间：{{ task.updatedAt }}</div>
              <div>关联项目：{{ task.projectId }}</div>
              <div>生成结果：{{ task.resultVideoIds.length }} 个</div>
            </div>
          </div>

          <div class="flex shrink-0 items-center gap-3">
            <NButton
              v-if="task.status === 'failed'"
              type="warning"
              :loading="taskStore.retryingIds.includes(task.id)"
              @click="handleRetry(task.id)"
            >
              重新提交
            </NButton>
            <NButton
              v-if="task.resultVideoIds.length"
              quaternary
              type="primary"
            >
              查看成品
            </NButton>
          </div>
        </div>
      </NCard>
    </div>

    <EmptyState
      v-else
      class="mt-6"
      title="还没有生成任务"
      description="从视频生成页提交任务后，这里会展示任务进度与结果"
    />
  </PageContainer>
</template>
