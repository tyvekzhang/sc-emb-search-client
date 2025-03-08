export default [
  {
    path: '/',
    key: 'home',
    name: 'home',
    icon: 'home',
    component: '@/pages/Home/index',
  },
  { path: '/index', redirect: '/' },
  {
    path: '/dataset',
    key: 'dataset',
    name: 'dataset',
    icon: 'database',
    component: '@/pages/Dataset/index',
  },
  {
    path: '/search',
    key: 'search',
    name: 'search',
    icon: 'search',
    component: '@/pages/Search/index',
  },
  {
    path: '/help',
    key: 'help',
    name: 'help',
    icon: 'QuestionCircle',
    component: '@/pages/Help/index',
  },
  { path: '/*', component: '@/pages/404' },
];
