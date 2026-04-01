<script setup lang="ts">
import {
  NAlert,
  NButton,
  NCard,
  NDescriptions,
  NDescriptionsItem,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSelect,
  NSwitch,
} from 'naive-ui';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PageContainer from '../../components/common/PageContainer.vue';
import StatusTag from '../../components/common/StatusTag.vue';
import ListSkeleton from '../../components/common/ListSkeleton.vue';
import { useTaskStore } from '../../stores/task';

const route = useRoute();
const router = useRouter();
const taskStore = useTaskStore();

const currentProjectId = computed(() => String(route.params.projectId ?? ''));
const aspectRatioOptions = [
  { label: '9:16 竖屏', value: '9:16' },
  { label: '16:9 横屏', value: '16:9' },
  { label: '1:1 方屏', value: '1:1' },
];

async function handleSubmit() {
  if (!currentProjectId.value) {
    return;
  }

  await taskStore.submit(currentProjectId.value);
  await router.push({
    name: 'task-center',
  });
}

onMounted(() => {
  if (!currentProjectId.value) {
    return;
  }

  void taskStore.loadProject(currentProjectId.value);
});
</script>

<template>
  <PageContainer
    title="视频生成"
    description="确认生成参数、预计积分消耗并提交异步视频生成任务"
  >
    <NAlert
      v-if="taskStore.error"
      type="error"
      class="mb-4"
    >
      {{ taskStore.error }}
    </NAlert>

    <ListSkeleton
      v-if="taskStore.loadingProject"
      :rows="5"
    />

    <div
      v-else
      class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]"
    >
      <NCard
        title="脚本 / 分镜摘要"
        class="rounded-[12px]"
      >
        <NDescriptions
          bordered
          :column="1"
          label-placement="left"
        >
          <NDescriptionsItem label="项目名称">
            {{ taskStore.summary.title }}
          </NDescriptionsItem>
          <NDescriptionsItem label="项目状态">
            <StatusTag
              category="project"
              :status="taskStore.projectDetail?.status ?? 'script_confirmed'"
            />
          </NDescriptionsItem>
          <NDescriptionsItem label="分镜数量">
            {{ taskStore.summary.sceneCount }}
          </NDescriptionsItem>
          <NDescriptionsItem label="参考图片">
            {{ taskStore.summary.selectedImageCount }} 张
          </NDescriptionsItem>
          <NDescriptionsItem label="脚本参考">
            {{ taskStore.summary.selectedReferenceCount }} 条
          </NDescriptionsItem>
        </NDescriptions>

        <div class="mt-5 space-y-3">
          <div class="text-sm font-semibold text-[#111827]">
            当前脚本摘要
          </div>
          <div class="rounded-[12px] bg-[#F9FAFB] px-4 py-4 text-sm leading-[1.7] text-[#374151]">
            {{ taskStore.projectDetail?.scriptDraft || '暂无脚本内容' }}
          </div>
        </div>
      </NCard>

      <NCard
        title="生成信息"
        class="rounded-[12px]"
      >
        <NForm
          label-placement="top"
          class="space-y-3"
        >
          <NFormItem label="生成数量">
            <NInputNumber
              :value="taskStore.form.count"
              :min="1"
              :max="4"
              class="w-full"
              @update:value="(value) => (taskStore.form.count = value ?? 1)"
            />
          </NFormItem>

          <NFormItem label="画面比例">
            <NSelect
              :value="taskStore.form.aspectRatio"
              :options="aspectRatioOptions"
              @update:value="(value) => (taskStore.form.aspectRatio = value ?? '9:16')"
            />
          </NFormItem>

          <NFormItem label="生成时长（秒）">
            <NInputNumber
              :value="taskStore.form.durationSeconds"
              :min="15"
              :step="15"
              class="w-full"
              @update:value="(value) => (taskStore.form.durationSeconds = value ?? 60)"
            />
          </NFormItem>

          <NFormItem label="风格倾向">
            <NInput
              :value="taskStore.form.styleBias"
              placeholder="例如：专业理性、纪实风、强节奏"
              @update:value="(value) => (taskStore.form.styleBias = value)"
            />
          </NFormItem>

          <NFormItem label="是否字幕">
            <NSwitch
              :value="taskStore.form.withSubtitle"
              @update:value="(value) => (taskStore.form.withSubtitle = value)"
            />
          </NFormItem>
        </NForm>

        <div class="mt-5 space-y-3">
          <NAlert type="info">
            预计积分消耗 {{ taskStore.estimatedCost }}
          </NAlert>
          <NAlert type="success">
            当前积分余额 {{ taskStore.pointBalance }}
          </NAlert>
        </div>

        <NButton
          type="primary"
          block
          class="mt-5"
          :loading="taskStore.submitting"
          @click="handleSubmit"
        >
          提交生成任务
        </NButton>
      </NCard>
    </div>
  </PageContainer>
</template>
