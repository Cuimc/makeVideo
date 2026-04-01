<script setup lang="ts">
import { NCard, NTag } from 'naive-ui';
import { onMounted } from 'vue';
import PageContainer from '../../components/common/PageContainer.vue';
import EmptyState from '../../components/common/EmptyState.vue';
import ListSkeleton from '../../components/common/ListSkeleton.vue';
import { useBillingStore } from '../../stores/billing';

const billingStore = useBillingStore();

const typeMap = {
  recharge: {
    label: '充值',
    type: 'success',
  },
  consume: {
    label: '消耗',
    type: 'warning',
  },
  refund: {
    label: '返还',
    type: 'info',
  },
} as const;

onMounted(() => {
  void billingStore.loadPointRecords();
});
</script>

<template>
  <PageContainer
    title="积分明细"
    description="仅展示用户可理解的充值、消耗和返还结果"
  >
    <ListSkeleton
      v-if="billingStore.loadingRecords"
      :rows="5"
    />

    <EmptyState
      v-else-if="!billingStore.pointRecords.length"
      title="还没有积分变动记录"
      description="充值、消耗和返还记录会统一沉淀在这里"
    />

    <div
      v-else
      class="space-y-4"
    >
      <NCard
        v-for="item in billingStore.pointRecords"
        :key="item.id"
        class="rounded-[12px]"
      >
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div class="flex items-center gap-3">
              <NTag
                :type="typeMap[item.type].type"
                :bordered="false"
                round
              >
                {{ typeMap[item.type].label }}
              </NTag>
              <span class="text-base font-semibold text-[#111827]">
                {{ item.label }}
              </span>
            </div>
            <p class="mt-2 text-sm text-[#6B7280]">
              时间：{{ item.createdAt }}
            </p>
          </div>

          <div class="text-right">
            <div class="text-lg font-semibold text-[#111827]">
              {{ item.points > 0 ? `+${item.points}` : item.points }}
            </div>
            <p class="mt-1 text-sm text-[#9CA3AF]">
              {{ item.relatedTaskId ? `关联任务 ${item.relatedTaskId}` : '无关联任务' }}
            </p>
          </div>
        </div>
      </NCard>
    </div>
  </PageContainer>
</template>
