import { createApp } from 'vue'
import router from './utils/router'

import './style.scss'
import App from './App.vue'

const app = createApp(App)
app.use(router).mount('#app')
