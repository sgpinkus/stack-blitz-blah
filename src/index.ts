import { createApp } from 'vue';
import App from '@/App.vue';

async function main() {
  const app = createApp(App);
  app.mount('#app');
}

main()
  .then(() => console.log('Main: done'))
  .catch((e) => console.log('Main: failed', e));