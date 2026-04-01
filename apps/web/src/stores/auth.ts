import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { LoginPayload, UserProfile } from '@make-video/shared';
import { apiClient } from '../api/client';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null);
  const profile = ref<UserProfile | null>(null);

  const isAuthenticated = computed(() => Boolean(token.value));

  async function login(payload: LoginPayload) {
    const result = await apiClient.auth.login(payload);
    token.value = result.token;
    profile.value = result.profile;
    return result;
  }

  function logout() {
    token.value = null;
    profile.value = null;
  }

  return {
    isAuthenticated,
    login,
    logout,
    profile,
    token,
  };
});
