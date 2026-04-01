export interface NavigationItem {
  key: string;
  label: string;
  to: string;
}

export const navigationItems: NavigationItem[] = [
  { key: 'dashboard', label: '工作台', to: '/dashboard' },
  { key: 'news', label: '新闻选题', to: '/news/topics' },
  { key: 'tasks', label: '任务中心', to: '/tasks' },
  { key: 'library', label: '成品库', to: '/library' },
  { key: 'assets', label: '素材库', to: '/assets' },
  { key: 'references', label: '脚本参考库', to: '/references' },
  { key: 'profile', label: '个人中心', to: '/account/profile' },
  { key: 'billing', label: '积分中心', to: '/billing/recharge' },
];
