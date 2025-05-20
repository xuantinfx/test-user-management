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
  padding: var(--space-md);
  border-radius: 8px;
  margin-bottom: var(--space-md);
  animation: fadeIn 0.3s ease-in-out;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.error-alert:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.error {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--danger-color);
  color: var(--danger-dark);
}

.warning {
  background-color: rgba(245, 158, 11, 0.1);
  border: 1px solid var(--warning-color);
  color: var(--warning-dark);
}

.info {
  background-color: rgba(59, 130, 246, 0.1);
  border: 1px solid var(--info-color);
  color: var(--info-dark);
}

.error-icon {
  margin-right: var(--space-md);
  flex-shrink: 0;
}

.error-icon svg {
  width: 24px;
  height: 24px;
  fill: currentColor;
}

.error-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-content p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.dismiss-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: var(--space-xs);
  margin-left: var(--space-sm);
  opacity: 0.7;
  transition: all 0.2s ease;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dismiss-btn:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.05);
}

.dismiss-btn svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
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

/* Responsive styles */
@media (max-width: 640px) {
  .error-alert {
    padding: var(--space-sm);
    flex-direction: column;
    align-items: flex-start;
  }

  .error-icon {
    margin-right: 0;
    margin-bottom: var(--space-sm);
  }

  .error-content {
    width: 100%;
  }
}
</style>
