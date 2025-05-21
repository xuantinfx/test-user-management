<template>
  <div class="filter-container">
    <h2>Filter Users</h2>
    <div class="filter-form">
      <div class="form-group">
        <label for="name-filter">Name</label>
        <div class="input-wrapper">
          <input
            id="name-filter"
            type="text"
            :value="currentFilters.name"
            @input="e => handleFilterInput(e, 'name')"
            placeholder="Filter by name"
          />
          <span v-if="debouncingFields.name" class="debounce-indicator"></span>
        </div>
      </div>

      <div class="form-group">
        <label for="email-filter">Email</label>
        <div class="input-wrapper">
          <input
            id="email-filter"
            type="text"
            :value="currentFilters.email"
            @input="e => handleFilterInput(e, 'email')"
            placeholder="Filter by email"
          />
          <span v-if="debouncingFields.email" class="debounce-indicator"></span>
        </div>
      </div>

      <div class="form-group">
        <label for="company-filter">Company</label>
        <div class="input-wrapper">
          <input
            id="company-filter"
            type="text"
            :value="currentFilters.company"
            @input="e => handleFilterInput(e, 'company')"
            placeholder="Filter by company"
          />
          <span v-if="debouncingFields.company" class="debounce-indicator"></span>
        </div>
      </div>

      <button class="clear-btn" @click="clearFilters">Clear Filters</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUsers } from '@/hooks/useUsers';
import { ref, computed } from 'vue';
import { UserFilters } from '@/types';
import { debounce } from '@/utils/debounce';

// Get the shared filters and actions from the hook
const { filters, setFilter, clearFilters: clearFiltersHook } = useUsers();

// Create a computed property for the current filters that unwraps the computed ref
const currentFilters = computed(() => {
  return filters.value;
});

// Wrapper for clearFilters to also reset debouncing state
const clearFilters = () => {
  clearFiltersHook();
  // Reset all debouncing indicators
  Object.keys(debouncingFields.value).forEach(key => {
    debouncingFields.value[key as keyof UserFilters] = false;
  });
};

// Track which fields are currently being debounced
const debouncingFields = ref<Record<keyof UserFilters, boolean>>({
  name: false,
  email: false,
  company: false
});

// Create debounced filter handlers with 300ms delay
const debouncedSetFilter = debounce((field: keyof UserFilters, value: string) => {
  setFilter(field, value);
  debouncingFields.value[field] = false;
}, 300);

// Handle input events with debouncing
const handleFilterInput = (event: Event, field: keyof UserFilters): void => {
  const target = event.target as HTMLInputElement;
  debouncingFields.value[field] = true;
  debouncedSetFilter(field, target.value);
};
</script>

<style scoped>
.filter-container {
  background-color: var(--bg-dark);
  border-radius: 8px;
  padding: var(--space-lg);
  margin-bottom: var(--space-xl);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  border: 1px solid var(--border-color);
}

.filter-container:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

h2 {
  margin-top: 0;
  margin-bottom: var(--space-md);
  font-size: 1.25rem;
  color: var(--text-color);
  position: relative;
  display: inline-block;
}

h2::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 40px;
  height: 3px;
  background-color: var(--primary-color);
  border-radius: 1.5px;
}

.filter-form {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--space-md);
  align-items: end;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

label {
  font-size: 0.875rem;
  margin-bottom: var(--space-sm);
  color: var(--text-light);
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

input {
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: var(--bg-light);
  height: 34px;
  color: var(--text-color);
  width: 100%;
}

input:hover {
  border-color: var(--border-dark);
}

input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}

.debounce-indicator {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--primary-color);
  opacity: 0.7;
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0% {
    transform: translateY(-50%) scale(0.8);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-50%) scale(1.2);
    opacity: 1;
  }
  100% {
    transform: translateY(-50%) scale(0.8);
    opacity: 0.7;
  }
}

.clear-btn {
  background-color: var(--danger-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: var(--space-sm) var(--space-md);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.clear-btn:hover {
  background-color: var(--danger-dark);
  transform: translateY(-1px);
}

.clear-btn:active {
  transform: translateY(0);
}

/* Responsive styles */
@media (max-width: 1024px) {
  .filter-form {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .filter-container {
    padding: var(--space-md);
    margin-bottom: var(--space-lg);
  }

  .filter-form {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-sm);
  }
}

@media (max-width: 640px) {
  .filter-form {
    grid-template-columns: 1fr;
  }

  .clear-btn {
    margin-top: var(--space-xs);
    width: 100%;
  }
}
</style>
