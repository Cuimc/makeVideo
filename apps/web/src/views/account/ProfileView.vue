<script setup lang="ts">
import {
  NButton,
  NCard,
  NDescriptions,
  NDescriptionsItem,
} from 'naive-ui';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import PageContainer from '../../components/common/PageContainer.vue';
import { useAuthStore } from '../../stores/auth';
import { useBillingStore } from '../../stores/billing';

const router = useRouter();
const authStore = useAuthStore();
const billingStore = useBillingStore();

function handleLogout() {
  authStore.logout();
  void router.push({
    name: 'login',
  });
}

onMounted(() => {
  void billingStore.loadSummary();
});
</script>

<template>
  <PageContainer
    title="个人中心"
    description="查看账户信息、积分余额和常用账户操作入口"
  >
    <NCard class="rounded-[12px]">
      <NDescriptions
        bordered
        :column="1"
        label-placement="left"
      >
        <NDescriptionsItem label="手机号">
          {{ authStore.profile?.maskedPhone ?? '--' }}
        </NDescriptionsItem>
        <NDescriptionsItem label="昵称">
          {{ authStore.profile?.nickname ?? '--' }}
        </NDescriptionsItem>
        <NDescriptionsItem label="注册时间">
          {{ authStore.profile?.createdAt ?? '--' }}
        </NDescriptionsItem>
        <NDescriptionsItem label="当前积分余额">
          {{ billingStore.balance }}
        </NDescriptionsItem>
      </NDescriptions>

      <div class="mt-6 flex flex-wrap gap-3">
        <NButton
          type="primary"
          @click="router.push({ name: 'billing-recharge' })"
        >
          去充值
        </NButton>
        <NButton @click="router.push({ name: 'billing-history' })">
          积分明细
        </NButton>
        <NButton
          quaternary
          @click="handleLogout"
        >
          退出登录
        </NButton>
      </div>
    </NCard>
  </PageContainer>
</template>
