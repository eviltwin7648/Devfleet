<script setup lang="ts">
import ToastNotification from './components/ToastNotification.vue';
</script>

<template>
  <div id="app">
    <router-view />
    <ToastNotification />
  </div>
</template>

<style>
:root {
  /* Dark Theme Color Palette */
  --bg-primary: #0a0a0a;
  --bg-secondary: #1a1a1a;
  --bg-tertiary: #2a2a2a;
  --bg-quaternary: #3a3a3a;
  
  /* Surface colors */
  --surface-primary: #1e1e1e;
  --surface-secondary: #2d2d2d;
  --surface-tertiary: #3c3c3c;
  
  /* Text colors */
  --text-primary: #ffffff;
  --text-secondary: #e0e0e0;
  --text-tertiary: #b0b0b0;
  --text-muted: #808080;
  
  /* Accent colors */
  --accent-primary: #4a9eff;
  --accent-secondary: #6366f1;
  --accent-success: #10b981;
  --accent-error: #ef4444;
  --accent-warning: #f59e0b;
  
  /* Border colors */
  --border-primary: #404040;
  --border-secondary: #525252;
  --border-tertiary: #666666;
  
  /* Interactive colors */
  --hover-overlay: rgba(255, 255, 255, 0.05);
  --active-overlay: rgba(255, 255, 255, 0.1);
  --focus-ring: rgba(74, 158, 255, 0.3);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  height: 100%;
  width: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  line-height: 1.6;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  background-color: var(--bg-primary);
}

/* Ensure inputs are always interactive */
input, button, select, textarea {
  font-family: inherit;
}

input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

button {
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
}

/* Remove any potential overlays or z-index issues */
* {
  position: relative;
}
</style>
