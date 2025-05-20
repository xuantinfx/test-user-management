<template>
  <div class="filter-container">
    <h2>Filter Users</h2>
    <div class="filter-form">
      <div class="form-group">
        <label for="name-filter">Name</label>
        <input
          id="name-filter"
          type="text"
          v-model="filters.name"
          placeholder="Filter by name"
          @input="updateFilters"
        />
      </div>

      <div class="form-group">
        <label for="email-filter">Email</label>
        <input
          id="email-filter"
          type="text"
          v-model="filters.email"
          placeholder="Filter by email"
          @input="updateFilters"
        />
      </div>

      <div class="form-group">
        <label for="company-filter">Company</label>
        <input
          id="company-filter"
          type="text"
          v-model="filters.company"
          placeholder="Filter by company"
          @input="updateFilters"
        />
      </div>

      <button class="clear-btn" @click="clearFilters">Clear Filters</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUsers } from '@/hooks/useUsers';
import { reactive, watch } from 'vue';
import { UserFilters } from '@/types';

const { filters: storeFilters, setFilter, clearFilters } = useUsers();

// Create a local reactive copy of the filters
const filters = reactive<UserFilters>({
  name: storeFilters.value.name,
  email: storeFilters.value.email,
  company: storeFilters.value.company
});

// Watch for store filter changes and update local filters
watch(() => storeFilters.value, (newFilters: UserFilters) => {
  filters.name = newFilters.name;
  filters.email = newFilters.email;
  filters.company = newFilters.company;
}, { deep: true });

// Update store filters when local filters change
const updateFilters = (): void => {
  setFilter('name', filters.name);
  setFilter('email', filters.email);
  setFilter('company', filters.company);
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
  height: 38px;
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
