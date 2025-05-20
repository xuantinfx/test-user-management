<template>
  <div class="loading-spinner" :class="{ overlay: overlay }">
    <div class="spinner"></div>
    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from 'vue';

interface LoadingSpinnerProps {
  message?: string;
  overlay?: boolean;
}

withDefaults(defineProps<LoadingSpinnerProps>(), {
  message: 'Loading...',
  overlay: false
});
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
  animation: fadeIn 0.3s ease-in-out;
}

.loading-spinner.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 1000;
  backdrop-filter: blur(3px);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(79, 70, 229, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s ease-in-out infinite;
  box-shadow: var(--shadow-sm);
}

.message {
  margin-top: var(--space-sm);
  color: var(--text-light);
  font-size: 0.9rem;
  font-weight: 500;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive styles */
@media (max-width: 640px) {
  .spinner {
    width: 32px;
    height: 32px;
    border-width: 3px;
  }

  .message {
    font-size: 0.8rem;
  }
}
</style>
