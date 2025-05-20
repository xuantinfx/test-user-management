<template>
  <button 
    class="theme-toggle" 
    @click="toggleTheme" 
    :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    aria-live="polite"
    role="switch"
    :aria-checked="isDark"
  >
    <!-- Sun icon for light theme -->
    <svg 
      v-if="!isDark" 
      xmlns="http://www.w3.org/2000/svg" 
      class="icon sun-icon" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
    
    <!-- Moon icon for dark theme -->
    <svg 
      v-else 
      xmlns="http://www.w3.org/2000/svg" 
      class="icon moon-icon" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
    
    <span class="sr-only">{{ isDark ? 'Dark mode active' : 'Light mode active' }}</span>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '@/hooks/useTheme';

// Use the theme composable
const { isDark, toggleTheme } = useTheme();
</script>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  color: var(--text-color);
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background-color: var(--bg-dark);
  transform: rotate(15deg);
}

.theme-toggle:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.icon {
  width: 20px;
  height: 20px;
  transition: all 0.3s ease;
}

.sun-icon {
  color: var(--warning-color);
}

.moon-icon {
  color: var(--primary-light);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Animation for icon transition */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.theme-toggle:active .icon {
  animation: spin 0.5s ease-in-out;
}
</style>
