import { createApp, createSSRApp } from 'vue';
import App from '@/App.vue';
import routes from './router';
import store from './store';
import ElementPlus from 'element-plus';
import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router';

export function createVueApp(ssr: boolean) {
  const app = ssr
    ? createSSRApp(App)
    : createApp(App);
  const router = createRouter({
    history: ssr
      ? createMemoryHistory()
      : createWebHistory(),
    routes,
  });
  app.use(ElementPlus);
  app.use(store);
  app.use(router);

  return { app, router };
}
