<script setup lang="ts">
import {
  NAlert,
  NButton,
  NCard,
  NDescriptions,
  NDescriptionsItem,
} from 'naive-ui';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PageContainer from '../../components/common/PageContainer.vue';
import StatusTag from '../../components/common/StatusTag.vue';
import ListSkeleton from '../../components/common/ListSkeleton.vue';
import ProjectParamForm from '../../components/forms/ProjectParamForm.vue';
import ScriptEditor from '../../components/forms/ScriptEditor.vue';
import StoryboardEditor from '../../components/forms/StoryboardEditor.vue';
import ReferencePanel from '../../components/project/ReferencePanel.vue';
import { useProjectStore } from '../../stores/project';

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();

const currentProjectId = computed(() => String(route.params.projectId ?? ''));

async function handleSave() {
  await projectStore.saveDraft();
}

async function handleConfirm() {
  const result = await projectStore.confirmProject();

  if (!result) {
    return;
  }

  await router.push({
    name: 'project-video-generate',
    params: {
      projectId: result.id,
    },
  });
}

onMounted(() => {
  if (!currentProjectId.value) {
    return;
  }

  void projectStore.load(currentProjectId.value);
});
</script>

<template>
  <PageContainer
    title="AI 创作"
    description="补充创作参数、生成脚本和分镜，并确认进入视频生成阶段"
  >
    <NAlert
      v-if="projectStore.error"
      type="error"
      class="mb-4"
    >
      {{ projectStore.error }}
    </NAlert>

    <ListSkeleton
      v-if="projectStore.loading"
      :rows="6"
    />

    <div
      v-else
      class="space-y-6"
    >
      <div class="grid gap-6 2xl:grid-cols-[360px_minmax(0,1fr)]">
        <div class="space-y-6">
          <NCard
            title="项目信息"
            class="rounded-[12px]"
          >
            <NDescriptions
              bordered
              :column="1"
              label-placement="left"
            >
              <NDescriptionsItem label="项目名称">
                {{ projectStore.detail?.name || '未命名项目' }}
              </NDescriptionsItem>
              <NDescriptionsItem label="关键词">
                {{ projectStore.detail?.keyword || '-' }}
              </NDescriptionsItem>
              <NDescriptionsItem label="项目状态">
                <StatusTag
                  category="project"
                  :status="projectStore.detail?.status ?? 'created'"
                />
              </NDescriptionsItem>
              <NDescriptionsItem label="最后更新时间">
                {{ projectStore.detail?.updatedAt || '-' }}
              </NDescriptionsItem>
            </NDescriptions>
          </NCard>

          <NCard
            title="已选新闻"
            class="rounded-[12px]"
          >
            <ul class="space-y-3">
              <li
                v-for="item in projectStore.detail?.newsItems ?? []"
                :key="item.id"
                class="rounded-[10px] bg-[#F9FAFB] px-4 py-3"
              >
                <div class="text-sm font-semibold text-[#111827]">
                  {{ item.title }}
                </div>
                <p class="mt-1 text-sm leading-[1.6] text-[#6B7280]">
                  {{ item.summary }}
                </p>
              </li>
            </ul>
          </NCard>

          <NCard
            title="创作参数"
            class="rounded-[12px]"
          >
            <ProjectParamForm v-model="projectStore.form" />
          </NCard>

          <NCard
            title="参考内容区"
            class="rounded-[12px]"
          >
            <ReferencePanel
              :image-ids="projectStore.referenceImageIds"
              :video-ids="projectStore.referenceVideoIds"
              :reference-ids="projectStore.referenceResultIds"
            />
          </NCard>
        </div>

        <div class="space-y-6">
          <NCard
            title="脚本模块"
            class="rounded-[12px]"
          >
            <template #header-extra>
              <NButton
                type="primary"
                :loading="projectStore.generatingScript"
                @click="projectStore.generateScript"
              >
                生成脚本
              </NButton>
            </template>

            <ScriptEditor v-model="projectStore.script" />
          </NCard>

          <NCard
            title="分镜模块"
            class="rounded-[12px]"
          >
            <template #header-extra>
              <NButton
                type="primary"
                :loading="projectStore.generatingStoryboard"
                @click="projectStore.generateStoryboard"
              >
                生成分镜
              </NButton>
            </template>

            <StoryboardEditor v-model="projectStore.storyboard" />
          </NCard>
        </div>
      </div>

      <div class="sticky bottom-0 z-10 rounded-[16px] border border-[#E5E7EB] bg-white px-4 py-4 shadow-sm">
        <div class="flex flex-wrap items-center justify-end gap-3">
          <NButton
            :loading="projectStore.saving"
            @click="handleSave"
          >
            保存
          </NButton>
          <NButton
            type="primary"
            :loading="projectStore.confirming"
            @click="handleConfirm"
          >
            确认进入下一步
          </NButton>
        </div>
      </div>
    </div>
  </PageContainer>
</template>
