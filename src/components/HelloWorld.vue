<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      >Vue Docs Scaling up Guide</a
    >.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: var(--text-secondary);
}

h1 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 1rem;
}

.card {
  background-color: var(--surface-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin: 1rem 0;
}

.card button {
  background-color: var(--accent-primary);
  color: var(--text-primary);
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.card button:hover {
  background-color: var(--accent-hover);
  transform: translateY(-1px);
}

.card button:focus {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}

.card p {
  color: var(--text-secondary);
  margin-top: 1rem;
}

.card code {
  background-color: var(--surface-tertiary);
  color: var(--accent-primary);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-family: 'Fira Code', 'Consolas', monospace;
}

a {
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 500;
}

a:hover {
  color: var(--accent-hover);
  text-decoration: underline;
}
</style>
