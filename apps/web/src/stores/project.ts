import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type {
  ProjectCreativeParams,
  ProjectDetail,
  SaveProjectDraftPayload,
  StoryboardScene,
} from '@make-video/shared';
import { apiClient } from '../api/client';

function createDefaultForm(): ProjectCreativeParams {
  return {
    videoType: '口播解读',
    style: '专业理性',
    platform: '抖音',
    durationSeconds: 60,
    targetAudience: '',
  };
}

export const useProjectStore = defineStore('project', () => {
  const detail = ref<ProjectDetail | null>(null);
  const loading = ref(false);
  const saving = ref(false);
  const confirming = ref(false);
  const generatingScript = ref(false);
  const generatingStoryboard = ref(false);
  const error = ref<string | null>(null);
  const script = ref('');
  const storyboard = ref<StoryboardScene[]>([]);
  const form = ref<ProjectCreativeParams>(createDefaultForm());
  const referenceImageIds = ref<string[]>([]);
  const referenceVideoIds = ref<string[]>([]);
  const referenceResultIds = ref<string[]>([]);

  const projectId = computed(() => detail.value?.id ?? '');

  function syncFromDetail(nextDetail: ProjectDetail) {
    detail.value = nextDetail;
    form.value = { ...nextDetail.form };
    script.value = nextDetail.scriptDraft;
    storyboard.value = [...nextDetail.storyboardDraft];
    referenceImageIds.value = [...nextDetail.referenceImageIds];
    referenceVideoIds.value = [...nextDetail.referenceVideoIds];
    referenceResultIds.value = [...nextDetail.referenceResultIds];
  }

  function createPayload(): SaveProjectDraftPayload {
    return {
      form: { ...form.value },
      scriptDraft: script.value,
      storyboardDraft: [...storyboard.value],
      referenceImageIds: [...referenceImageIds.value],
      referenceVideoIds: [...referenceVideoIds.value],
      referenceResultIds: [...referenceResultIds.value],
    };
  }

  async function load(id: string) {
    loading.value = true;
    error.value = null;

    try {
      const result = await apiClient.project.getDetail(id);
      syncFromDetail(result);
      return result;
    } catch (loadError) {
      error.value = loadError instanceof Error ? loadError.message : '项目加载失败';
      throw loadError;
    } finally {
      loading.value = false;
    }
  }

  async function saveDraft() {
    if (!projectId.value) {
      return null;
    }

    saving.value = true;

    try {
      const result = await apiClient.project.saveDraft(projectId.value, createPayload());
      syncFromDetail(result);
      return result;
    } finally {
      saving.value = false;
    }
  }

  async function generateScript() {
    if (!projectId.value) {
      return null;
    }

    generatingScript.value = true;

    try {
      const result = await apiClient.project.generateScript(projectId.value);
      script.value = result.script;
      return result;
    } finally {
      generatingScript.value = false;
    }
  }

  async function generateStoryboard() {
    if (!projectId.value) {
      return null;
    }

    generatingStoryboard.value = true;

    try {
      const result = await apiClient.project.generateStoryboard(projectId.value);
      storyboard.value = [...result.storyboard];
      return result;
    } finally {
      generatingStoryboard.value = false;
    }
  }

  async function confirmProject() {
    if (!projectId.value) {
      return null;
    }

    confirming.value = true;

    try {
      const result = await apiClient.project.confirm(projectId.value);
      syncFromDetail(result);
      return result;
    } finally {
      confirming.value = false;
    }
  }

  return {
    confirmProject,
    detail,
    error,
    form,
    generateScript,
    generateStoryboard,
    generatingScript,
    generatingStoryboard,
    load,
    loading,
    projectId,
    referenceImageIds,
    referenceResultIds,
    referenceVideoIds,
    saveDraft,
    saving,
    script,
    storyboard,
    confirming,
  };
});
