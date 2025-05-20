<template>
  <div v-if="message" class="error-alert" :class="type">
    <div class="error-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path fill="none" d="M0 0h24v24H0z"/>
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"/>
      </svg>
    </div>
    <div class="error-content">
      <p>{{ message }}</p>
      <button v-if="dismissible" class="dismiss-btn" @click="$emit('dismiss')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, withDefaults } from 'vue';

type AlertType = 'error' | 'warning' | 'info';

interface ErrorAlertProps {
  message?: string;
  type?: AlertType;
  dismissible?: boolean;
}

withDefaults(defineProps<ErrorAlertProps>(), {
  message: '',
  type: 'error',
  dismissible: true
});

defineEmits<{
  (e: 'dismiss'): void;
}>();
</script>

<style scoped>
.error-alert {
  display: flex;
  align-items: flex-start;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  animation: fadeIn 0.3s ease-in-out;
}

.error {
  background-color: #fee2e2;
  border: 1px solid #ef4444;
  color: #b91c1c;
}

.warning {
  background-color: #fef3c7;
  border: 1px solid #f59e0b;
  color: #b45309;
}

.info {
  background-color: #e0f2fe;
  border: 1px solid #38bdf8;
  color: #0369a1;
}

.error-icon {
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.error-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-content p {
  margin: 0;
}

.dismiss-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 0.5rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.dismiss-btn:hover {
  opacity: 1;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
