<script setup lang="ts">
import { NButton, NCard } from 'naive-ui';
import { onMounted } from 'vue';
import PageContainer from '../../components/common/PageContainer.vue';
import ListSkeleton from '../../components/common/ListSkeleton.vue';
import EmptyState from '../../components/common/EmptyState.vue';
import { useBillingStore } from '../../stores/billing';

const billingStore = useBillingStore();

onMounted(() => {
  void Promise.all([
    billingStore.loadSummary(),
    billingStore.loadPackages(),
    billingStore.loadRechargeRecords(),
  ]);
});
</script>

<template>
  <PageContainer
    title="积分充值"
    description="选择固定套餐进行充值，并查看最近充值记录"
  >
    <NCard class="rounded-[12px]">
      <div class="grid gap-4 md:grid-cols-4">
        <div class="rounded-[12px] bg-[#F9FAFB] px-4 py-4">
          <div class="text-sm text-[#6B7280]">
            当前积分余额
          </div>
          <div class="mt-2 text-2xl font-semibold text-[#111827]">
            {{ billingStore.balance }}
          </div>
        </div>
        <div class="rounded-[12px] bg-[#F9FAFB] px-4 py-4">
          <div class="text-sm text-[#6B7280]">
            累计充值
          </div>
          <div class="mt-2 text-2xl font-semibold text-[#111827]">
            {{ billingStore.summary?.totalRecharged ?? 0 }}
          </div>
        </div>
        <div class="rounded-[12px] bg-[#F9FAFB] px-4 py-4">
          <div class="text-sm text-[#6B7280]">
            累计消耗
          </div>
          <div class="mt-2 text-2xl font-semibold text-[#111827]">
            {{ billingStore.summary?.totalConsumed ?? 0 }}
          </div>
        </div>
        <div class="rounded-[12px] bg-[#F9FAFB] px-4 py-4">
          <div class="text-sm text-[#6B7280]">
            累计返还
          </div>
          <div class="mt-2 text-2xl font-semibold text-[#111827]">
            {{ billingStore.summary?.totalRefunded ?? 0 }}
          </div>
        </div>
      </div>
    </NCard>

    <ListSkeleton
      v-if="billingStore.loadingPackages"
      :rows="4"
      class="mt-6"
    />

    <EmptyState
      v-else-if="!billingStore.packages.length"
      class="mt-6"
      title="还没有充值套餐"
      description="后端接入套餐后，这里会展示固定充值档位"
    />

    <div
      v-else
      class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
    >
      <NCard
        v-for="pack in billingStore.packages"
        :key="pack.id"
        class="rounded-[12px]"
      >
        <div class="space-y-4">
          <div>
            <div class="text-lg font-semibold text-[#111827]">
              {{ pack.points }} 积分
            </div>
            <div class="mt-2 text-sm text-[#6B7280]">
              {{ pack.label }}
            </div>
            <div class="mt-3 text-2xl font-semibold text-[#2563EB]">
              ¥{{ pack.price }}
            </div>
          </div>

          <div class="text-sm text-[#6B7280]">
            支付方式：微信 / 支付宝
          </div>

          <NButton
            type="primary"
            class="w-full"
          >
            立即充值
          </NButton>
        </div>
      </NCard>
    </div>
  </PageContainer>
</template>
