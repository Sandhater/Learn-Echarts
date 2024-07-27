import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './utils/router'

import './style.scss'
import App from './App.vue'

const app = createApp(App)
app.use(router)
    .use(createPinia())
    .mount('#app')
