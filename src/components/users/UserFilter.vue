<template>
  <div class="filter-container">
    <h2>Filter Users</h2>
    <div class="filter-form">
      <div class="form-group">
        <label for="name-filter">Name</label>
        <input
          id="name-filter"
          type="text"
          v-model="name"
          placeholder="Filter by name"
        />
      </div>

      <div class="form-group">
        <label for="email-filter">Email</label>
        <input
          id="email-filter"
          type="text"
          v-model="email"
          placeholder="Filter by email"
        />
      </div>

      <div class="form-group">
        <label for="company-filter">Company</label>
        <input
          id="company-filter"
          type="text"
          v-model="company"
          placeholder="Filter by company"
        />
      </div>

      <button class="clear-btn" @click="clearFilters">Clear Filters</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUsers } from '@/hooks/useUsers';
import { computed } from 'vue';
import { UserFilters } from '@/types';

// Get the shared filters and actions from the hook
const { filters, setFilter, clearFilters } = useUsers();

// Create computed properties for two-way binding
const name = computed({
  get: () => filters.value.name,
  set: (value: string) => setFilter('name', value)
});

const email = computed({
  get: () => filters.value.email,
  set: (value: string) => setFilter('email', value)
});

const company = computed({
  get: () => filters.value.company,
  set: (value: string) => setFilter('company', value)
});

// Update all filters at once (for input events)
const updateFilters = (): void => {
  // This is now a no-op since we're using computed properties
  // that automatically update the shared state
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
}

label {
  font-size: 0.875rem;
  margin-bottom: var(--space-sm);
  color: var(--text-light);
  font-weight: 500;
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
}

input:hover {
  border-color: var(--border-dark);
}

input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
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
