import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueQueryPlugin, { queryClient } from './plugins/query'
import './style.css'

// Initialize theme from localStorage or system preference
const initializeTheme = (): void => {
  const storedTheme = localStorage.getItem('theme')
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  // Set theme based on stored preference or system preference
  const theme = storedTheme || (systemPrefersDark ? 'dark' : 'light')

  // Apply theme to document
  document.documentElement.setAttribute('data-theme', theme)
}

// Initialize theme before app is mounted
initializeTheme()

// Create the app instance
const app = createApp(App)

// Use plugins
app.use(VueQueryPlugin, { queryClient })
app.use(router)

// Mount the app
app.mount('#app')
