import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: true,
    useLocalStorage: true,
  },
  layout: {
    title: '@umijs/max',
  },
  forkTSChecker: {},
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: 'menu.home',
      path: '/home',
      component: './Home',
    },
    {
      name: 'menu.access',
      path: '/access',
      component: './Access',
    },
    {
      name: 'menu.table',
      path: '/table',
      component: './Table',
    },
  ],
  npmClient: 'pnpm',
  utoopack: false,
});

