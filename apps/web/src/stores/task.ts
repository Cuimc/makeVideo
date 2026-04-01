import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type {
  ProjectDetail,
  TaskStatus,
  VideoGenerationForm,
  VideoGenerationTask,
} from '@make-video/shared';
import { TASK_STATUS_OPTIONS } from '@make-video/shared';
import { apiClient } from '../api/client';
import { useAuthStore } from './auth';

function createDefaultForm(): VideoGenerationForm {
  return {
    count: 1,
    aspectRatio: '9:16',
    durationSeconds: 60,
    styleBias: '专业理性',
    withSubtitle: true,
  };
}

export const useTaskStore = defineStore('task', () => {
  const authStore = useAuthStore();
  const projectDetail = ref<ProjectDetail | null>(null);
  const form = ref<VideoGenerationForm>(createDefaultForm());
  const filters = ref<{ status?: TaskStatus }>({});
  const tasks = ref<VideoGenerationTask[]>([]);
  const loadingProject = ref(false);
  const loadingTasks = ref(false);
  const submitting = ref(false);
  const error = ref<string | null>(null);
  const retryingIds = ref<string[]>([]);

  const pointBalance = computed(() => authStore.profile?.pointBalance ?? 0);
  const statusOptions = TASK_STATUS_OPTIONS.map((item) => ({
    label: item.label,
    value: item.value,
  }));
  const summary = computed(() => ({
    title: projectDetail.value?.name ?? '未命名项目',
    sceneCount: projectDetail.value?.storyboardDraft.length ?? 0,
    selectedImageCount: projectDetail.value?.referenceImageIds.length ?? 0,
    selectedReferenceCount: projectDetail.value?.referenceResultIds.length ?? 0,
  }));
  const estimatedCost = computed(() => {
    const base = form.value.count * 300;
    const subtitleCost = form.value.withSubtitle ? 20 : 0;
    const ratioCost = form.value.aspectRatio === '16:9' ? 10 : 0;
    return base + subtitleCost + ratioCost;
  });

  function syncFormFromProject(detail: ProjectDetail) {
    projectDetail.value = detail;
    form.value = {
      ...form.value,
      durationSeconds: detail.form.durationSeconds,
      styleBias: detail.form.style,
    };
  }

  async function loadProject(projectId: string) {
    loadingProject.value = true;
    error.value = null;

    try {
      const detail = await apiClient.project.getDetail(projectId);
      syncFormFromProject(detail);
      return detail;
    } catch (loadError) {
      error.value = loadError instanceof Error ? loadError.message : '项目加载失败';
      throw loadError;
    } finally {
      loadingProject.value = false;
    }
  }

  async function submit(projectId: string) {
    submitting.value = true;

    try {
      const task = await apiClient.task.submit(projectId, { ...form.value });
      tasks.value = [task, ...tasks.value];
      return task;
    } finally {
      submitting.value = false;
    }
  }

  async function loadTasks() {
    loadingTasks.value = true;
    error.value = null;

    try {
      const result = await apiClient.task.list({
        page: 1,
        pageSize: 20,
        status: filters.value.status,
      });
      tasks.value = result.items;
      return result;
    } catch (loadError) {
      error.value = loadError instanceof Error ? loadError.message : '任务加载失败';
      throw loadError;
    } finally {
      loadingTasks.value = false;
    }
  }

  async function retry(taskId: string) {
    retryingIds.value = [...retryingIds.value, taskId];

    try {
      const nextTask = await apiClient.task.retry(taskId);
      tasks.value = tasks.value.map((task) =>
        task.id === taskId
          ? nextTask
          : task,
      );
      return nextTask;
    } finally {
      retryingIds.value = retryingIds.value.filter((item) => item !== taskId);
    }
  }

  return {
    error,
    estimatedCost,
    filters,
    form,
    loadProject,
    loadTasks,
    loadingProject,
    loadingTasks,
    pointBalance,
    projectDetail,
    retry,
    retryingIds,
    statusOptions,
    submit,
    submitting,
    summary,
    tasks,
  };
});
