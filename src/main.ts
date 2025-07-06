import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Check authentication status on app load
const authStore = useAuthStore()

// Initialize auth status and then mount the app
authStore.checkAuthStatus().then(() => {
  // If user is authenticated and on auth page, redirect to dashboard
  if (authStore.isAuthenticated && window.location.pathname === '/auth') {
    router.push('/dashboard');
  }
  // If user is not authenticated and not on auth page, redirect to auth
  else if (!authStore.isAuthenticated && window.location.pathname !== '/auth') {
    router.push('/auth');
  }
}).finally(() => {
  app.mount('#app')
})
