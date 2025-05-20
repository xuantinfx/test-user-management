<script setup>
// App is the root component
</script>

<template>
  <div class="app">
    <header class="app-header">
      <div class="container">
        <div class="logo">
          <img src="./assets/vue.svg" alt="Vue logo" />
          <h1>User Dashboard</h1>
        </div>
        <nav class="nav">
          <router-link :to="{ name: 'dashboard' }">Dashboard</router-link>
        </nav>
      </div>
    </header>

    <main class="app-content">
      <router-view />
    </main>

    <footer class="app-footer">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} User Dashboard. Built with Vue 3 and Vite.</p>
      </div>
    </footer>
  </div>
</template>

<style>
/* Global styles */
:root {
  --primary-color: #3b82f6;
  --primary-dark: #2563eb;
  --secondary-color: #10b981;
  --text-color: #1f2937;
  --text-light: #6b7280;
  --border-color: #e5e7eb;
  --bg-color: #f9fafb;
  --bg-light: #ffffff;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: var(--text-color);
  background-color: var(--bg-color);
  line-height: 1.5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

a {
  color: var(--primary-color);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

button {
  cursor: pointer;
}

/* App specific styles */
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: var(--bg-light);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
}

.app-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  height: 2rem;
  margin-right: 0.75rem;
}

.logo h1 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
}

.nav a {
  color: var(--text-color);
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav a:hover {
  background-color: var(--bg-color);
  text-decoration: none;
}

.nav a.router-link-active {
  color: var(--primary-color);
  background-color: rgba(59, 130, 246, 0.1);
}

.app-content {
  flex: 1;
}

.app-footer {
  background-color: var(--bg-light);
  border-top: 1px solid var(--border-color);
  padding: 1.5rem 0;
  margin-top: 2rem;
}

.app-footer p {
  color: var(--text-light);
  font-size: 0.875rem;
  text-align: center;
}

@media (max-width: 640px) {
  .app-header .container {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
