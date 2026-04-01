import type { RouteRecordRaw } from 'vue-router';
import ReferenceLibraryView from '../../views/reference/ReferenceLibraryView.vue';

export const referenceRoutes: RouteRecordRaw[] = [
  {
    path: 'references',
    name: 'reference-library',
    component: ReferenceLibraryView,
  },
];
