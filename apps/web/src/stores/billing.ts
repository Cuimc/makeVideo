import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type {
  BillingSummary,
  PointPackage,
  PointRecord,
  RechargeRecord,
} from '@make-video/shared';
import { apiClient } from '../api/client';

export const useBillingStore = defineStore('billing', () => {
  const summary = ref<BillingSummary | null>(null);
  const packages = ref<PointPackage[]>([]);
  const pointRecords = ref<PointRecord[]>([]);
  const rechargeRecords = ref<RechargeRecord[]>([]);
  const loading = ref(false);
  const loadingPackages = ref(false);
  const loadingRecords = ref(false);

  const balance = computed(() => summary.value?.balance ?? 0);

  async function loadSummary() {
    loading.value = true;

    try {
      const result = await apiClient.billing.getSummary();
      summary.value = result;
      return result;
    } finally {
      loading.value = false;
    }
  }

  async function loadPackages() {
    loadingPackages.value = true;

    try {
      const result = await apiClient.billing.getPointPackages();
      packages.value = result;
      return result;
    } finally {
      loadingPackages.value = false;
    }
  }

  async function loadPointRecords() {
    loadingRecords.value = true;

    try {
      const result = await apiClient.billing.getPointRecords({
        page: 1,
        pageSize: 20,
      });
      pointRecords.value = result.items;
      return result;
    } finally {
      loadingRecords.value = false;
    }
  }

  async function loadRechargeRecords() {
    const result = await apiClient.billing.getRechargeRecords({
      page: 1,
      pageSize: 20,
    });
    rechargeRecords.value = result.items;
    return result;
  }

  return {
    balance,
    loadPackages,
    loadPointRecords,
    loadRechargeRecords,
    loadSummary,
    loading,
    loadingPackages,
    loadingRecords,
    packages,
    pointRecords,
    rechargeRecords,
    summary,
  };
});
