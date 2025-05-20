import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueQueryPlugin, { queryClient } from './plugins/query'
import './style.css'

// Create the app instance
const app = createApp(App)

// Use plugins
app.use(VueQueryPlugin, { queryClient })
app.use(router)

// Mount the app
app.mount('#app')
