import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import * as Echarts from 'vue-echarts'
import  VueFlags  from "@singleway/vueflags";
import i18n from './plugins/i18n';

loadFonts()

const fetchConfig = async () => {
  try {
      const response = await fetch('/config');
      if (!response.ok) {
          throw new Error('Failed to fetch config');
      }
      const config = await response.json();
      return config;
  } catch (error) {
      console.error('Error fetching config:', error);
      return {};
  }
};

fetchConfig().then(config => {
  const app = createApp(App);
  
  app.config.globalProperties.$config = config;

  app
      .use(router)
      .use(vuetify)
      .use(i18n)
      .use(createPinia())
      .use(VueFlags, { iconPath: '/assets/flags/' })
      .component('v-chart', Echarts)
      .mount('#app');
});
