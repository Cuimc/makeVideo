<script setup lang="ts">
import { NButton, NCard, NInput, NInputNumber } from 'naive-ui';
import type { StoryboardScene } from '@make-video/shared';

const props = defineProps<{
  modelValue: StoryboardScene[];
}>();

const emit = defineEmits<{
  'update:modelValue': [StoryboardScene[]];
}>();

function createScene(): StoryboardScene {
  const sceneId =
    globalThis.crypto?.randomUUID?.() ??
    `scene-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

  return {
    id: sceneId,
    title: '',
    durationSeconds: 5,
    visualPrompt: '',
    narration: '',
    subtitle: '',
  };
}

function updateScene(sceneId: string, patch: Partial<StoryboardScene>) {
  emit(
    'update:modelValue',
    props.modelValue.map((scene) =>
      scene.id === sceneId
        ? {
            ...scene,
            ...patch,
          }
        : scene,
    ),
  );
}

function appendScene() {
  emit('update:modelValue', [...props.modelValue, createScene()]);
}

function removeScene(sceneId: string) {
  emit(
    'update:modelValue',
    props.modelValue.filter((scene) => scene.id !== sceneId),
  );
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <p class="text-sm text-[#6B7280]">
        维护镜头顺序、时长、画面提示词和口播内容
      </p>
      <NButton
        tertiary
        type="primary"
        @click="appendScene"
      >
        新增分镜
      </NButton>
    </div>

    <div
      v-if="modelValue.length"
      class="space-y-4"
    >
      <NCard
        v-for="(scene, index) in modelValue"
        :key="scene.id"
        :title="scene.title || `分镜 ${index + 1}`"
        class="rounded-[12px]"
      >
        <template #header-extra>
          <NButton
            text
            type="error"
            @click="removeScene(scene.id)"
          >
            删除
          </NButton>
        </template>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <label class="text-sm font-medium text-[#374151]">镜头标题</label>
            <NInput
              :value="scene.title"
              placeholder="例如：行业现状引入"
              @update:value="(value) => updateScene(scene.id, { title: value })"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-[#374151]">镜头时长（秒）</label>
            <NInputNumber
              :value="scene.durationSeconds"
              :min="1"
              :step="1"
              class="w-full"
              @update:value="
                (value) => updateScene(scene.id, { durationSeconds: value ?? 5 })
              "
            />
          </div>

          <div class="space-y-2 md:col-span-2">
            <label class="text-sm font-medium text-[#374151]">画面提示词</label>
            <NInput
              type="textarea"
              :value="scene.visualPrompt"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="描述镜头画面、人物、环境和视觉风格"
              @update:value="(value) => updateScene(scene.id, { visualPrompt: value })"
            />
          </div>

          <div class="space-y-2 md:col-span-2">
            <label class="text-sm font-medium text-[#374151]">口播文案</label>
            <NInput
              type="textarea"
              :value="scene.narration"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="填写该镜头对应的口播内容"
              @update:value="(value) => updateScene(scene.id, { narration: value })"
            />
          </div>

          <div class="space-y-2 md:col-span-2">
            <label class="text-sm font-medium text-[#374151]">字幕建议</label>
            <NInput
              :value="scene.subtitle ?? ''"
              placeholder="可选，填写字幕或屏幕文案"
              @update:value="(value) => updateScene(scene.id, { subtitle: value })"
            />
          </div>
        </div>
      </NCard>
    </div>

    <div
      v-else
      class="rounded-[12px] border border-dashed border-[#D1D5DB] bg-[#F9FAFB] px-4 py-6 text-center text-sm text-[#6B7280]"
    >
      还没有分镜，点击“生成分镜”或“新增分镜”开始编辑。
    </div>
  </div>
</template>
