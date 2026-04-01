import type { RouteRecordRaw } from 'vue-router';
import LibraryView from '../../views/library/LibraryView.vue';

export const libraryRoutes: RouteRecordRaw[] = [
  {
    path: 'library',
    name: 'library',
    component: LibraryView,
  },
];
