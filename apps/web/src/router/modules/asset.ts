import type { RouteRecordRaw } from 'vue-router';
import AssetLibraryView from '../../views/asset/AssetLibraryView.vue';

export const assetRoutes: RouteRecordRaw[] = [
  {
    path: 'assets',
    name: 'asset-library',
    component: AssetLibraryView,
  },
];
