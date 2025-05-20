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

<script>
import { useUsers } from '../../hooks/useUsers';
import { reactive, watch } from 'vue';

export default {
  name: 'UserFilter',
  setup() {
    const { filters: storeFilters, setFilter, clearFilters } = useUsers();

    // Create a local reactive copy of the filters
    const filters = reactive({
      name: storeFilters.value.name,
      email: storeFilters.value.email,
      company: storeFilters.value.company
    });

    // Watch for store filter changes and update local filters
    watch(() => storeFilters.value, (newFilters) => {
      filters.name = newFilters.name;
      filters.email = newFilters.email;
      filters.company = newFilters.company;
    }, { deep: true });

    // Update store filters when local filters change
    const updateFilters = () => {
      setFilter('name', filters.name);
      setFilter('email', filters.email);
      setFilter('company', filters.company);
    };

    return {
      filters,
      updateFilters,
      clearFilters
    };
  }
}
</script>

<style scoped>
.filter-container {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: #374151;
}

.filter-form {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  align-items: end;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  color: #4b5563;
}

input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.clear-btn {
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
  height: 38px;
}

.clear-btn:hover {
  background-color: #dc2626;
}

@media (max-width: 768px) {
  .filter-form {
    grid-template-columns: 1fr;
  }
}
</style>
