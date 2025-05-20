<script setup lang="ts">
import { ref } from 'vue';

// Mobile menu state
const menuOpen = ref(false);

// Toggle mobile menu
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
</script>

<template>
  <div class="app">
    <header class="app-header">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <img src="./assets/vue.svg" alt="Vue logo" />
            <h1>User Dashboard</h1>
          </div>
          <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <nav class="nav" :class="{ 'nav-open': menuOpen }">
            <router-link :to="{ name: 'dashboard' }">Dashboard</router-link>
          </nav>
        </div>
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
  /* Primary Colors */
  --primary-color: #4f46e5;
  --primary-dark: #4338ca;
  --primary-light: #818cf8;

  /* Secondary Colors */
  --secondary-color: #10b981;
  --secondary-dark: #059669;
  --secondary-light: #34d399;

  /* Neutral Colors */
  --text-color: #1f2937;
  --text-light: #6b7280;
  --text-lighter: #9ca3af;

  /* Background Colors */
  --bg-color: #f9fafb;
  --bg-light: #ffffff;
  --bg-dark: #f3f4f6;

  /* Border Colors */
  --border-color: #e5e7eb;
  --border-dark: #d1d5db;

  /* Status Colors */
  --danger-color: #ef4444;
  --danger-dark: #dc2626;
  --warning-color: #f59e0b;
  --warning-dark: #d97706;
  --success-color: #10b981;
  --success-dark: #059669;
  --info-color: #3b82f6;
  --info-dark: #2563eb;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;

  /* Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
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
  box-shadow: var(--shadow-sm);
  padding: var(--space-md) 0;
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  height: 2rem;
  margin-right: var(--space-sm);
  transition: transform 0.3s ease;
}

.logo img:hover {
  transform: rotate(20deg);
}

.logo h1 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
}

/* Mobile menu toggle button */
.menu-toggle {
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: var(--space-xs);
  z-index: 101;
}

.menu-toggle span {
  display: block;
  width: 24px;
  height: 2px;
  margin: 5px 0;
  background-color: var(--text-color);
  transition: all 0.3s ease;
}

.nav {
  display: flex;
  gap: var(--space-sm);
}

.nav a {
  color: var(--text-color);
  font-weight: 500;
  padding: var(--space-sm) var(--space-md);
  border-radius: 4px;
  transition: all 0.2s ease;
}

.nav a:hover {
  background-color: var(--bg-dark);
  color: var(--primary-color);
  text-decoration: none;
}

.nav a.router-link-active {
  color: var(--primary-color);
  background-color: rgba(79, 70, 229, 0.1);
  font-weight: 600;
}

.app-content {
  flex: 1;
  padding: var(--space-md) 0;
}

.app-footer {
  background-color: var(--bg-light);
  border-top: 1px solid var(--border-color);
  padding: var(--space-lg) 0;
  margin-top: var(--space-xl);
  width: 100%;
}

.app-footer p {
  color: var(--text-light);
  font-size: 0.875rem;
  text-align: center;
}

/* Responsive styles */
@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  .nav {
    position: fixed;
    top: 0;
    right: -100%;
    width: 70%;
    max-width: 300px;
    height: 100vh;
    background-color: var(--bg-light);
    box-shadow: var(--shadow-lg);
    flex-direction: column;
    padding: 5rem var(--space-lg) var(--space-lg);
    transition: right 0.3s ease;
    z-index: 100;
  }

  .nav.nav-open {
    right: 0;
  }

  .nav a {
    padding: var(--space-md);
    width: 100%;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
  }
}

@media (max-width: 640px) {
  .logo h1 {
    font-size: 1.1rem;
  }

  .app-content {
    padding: var(--space-sm) 0;
  }

  .app-footer {
    padding: var(--space-md) 0;
    margin-top: var(--space-lg);
  }
}
</style>
