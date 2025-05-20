<template>
  <div class="user-table-container">
    <table class="user-table">
      <thead>
        <tr>
          <th @click="sortUsers('id')" :class="{ active: sortBy.field === 'id' }">
            ID
            <span v-if="sortBy.field === 'id'" class="sort-icon">
              {{ sortBy.direction === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
          <th @click="sortUsers('name')" :class="{ active: sortBy.field === 'name' }">
            Name
            <span v-if="sortBy.field === 'name'" class="sort-icon">
              {{ sortBy.direction === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
          <th @click="sortUsers('username')" :class="{ active: sortBy.field === 'username' }">
            Username
            <span v-if="sortBy.field === 'username'" class="sort-icon">
              {{ sortBy.direction === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
          <th @click="sortUsers('email')" :class="{ active: sortBy.field === 'email' }">
            Email
            <span v-if="sortBy.field === 'email'" class="sort-icon">
              {{ sortBy.direction === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
          <th @click="sortUsers('company')" :class="{ active: sortBy.field === 'company' }">
            Company
            <span v-if="sortBy.field === 'company'" class="sort-icon">
              {{ sortBy.direction === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in paginatedUsers" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.username }}</td>
          <td>
            <a :href="'mailto:' + user.email">{{ user.email }}</a>
          </td>
          <td>{{ user.company.name }}</td>
          <td>
            <router-link :to="{ name: 'user-details', params: { id: user.id }}" class="view-btn">
              View Details
            </router-link>
          </td>
        </tr>
        <tr v-if="paginatedUsers.length === 0">
          <td colspan="6" class="no-results">
            <p v-if="isLoading">Loading users...</p>
            <p v-else-if="error">Error loading users</p>
            <p v-else-if="!users || users.length === 0">No users found</p>
            <p v-else>No users match your filter criteria</p>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <div class="pagination-controls" >
      <div class="pagination-info">
        Showing {{ pagination.currentPage }} of {{ pagination.totalPages }} pages
        ({{ pagination.totalItems }} total items)
      </div>

      <div class="pagination-actions">
        <button
          @click="prevPage"
          class="pagination-btn"
          :disabled="pagination.currentPage === 1"
          aria-label="Previous page"
        >
          &laquo; Prev
        </button>

        <div class="pagination-pages">
          <button
            v-for="page in displayedPages"
            :key="page"
            @click="typeof page === 'number' ? goToPage(page) : null"
            class="pagination-btn"
            :class="{ active: pagination.currentPage === page }"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="nextPage"
          class="pagination-btn"
          :disabled="pagination.currentPage === pagination.totalPages"
          aria-label="Next page"
        >
          Next &raquo;
        </button>
      </div>

      <div class="page-size-selector">
        <label for="page-size">Items per page:</label>
        <select
          id="page-size"
          v-model="pageSize"
          @change="updatePageSize"
          class="page-size-select"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUsers } from '@/hooks/useUsers';

// Get users data and methods from the hook
const {
  sortBy,
  setSortBy,
  paginatedUsers,
  users,
  isLoading,
  error,
  pagination,
  goToPage,
  nextPage,
  prevPage,
  setPageSize
} = useUsers();

// Page size state
const pageSize = ref<number>(pagination.value.pageSize);

// Calculate which page numbers to display
const displayedPages = computed<Array<number | string>>(() => {
  const totalPages = pagination.value.totalPages;
  const currentPage = pagination.value.currentPage;

  if (totalPages <= 7) {
    // If 7 or fewer pages, show all
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Always include first and last page
  const pages: Array<number | string> = [1, totalPages];

  // Add current page and pages around it
  const pagesToAdd = [
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2
  ].filter(p => p > 1 && p < totalPages);

  // Add ellipses where needed
  if (pagesToAdd[0] > 2) {
    pages.splice(1, 0, '...' as string);
  }

  // Add the pages around current page
  pages.splice(pages.indexOf(1) + 1, 0, ...pagesToAdd);

  // Add ellipsis before last page if needed
  if (pagesToAdd[pagesToAdd.length - 1] < totalPages - 1) {
    pages.splice(pages.indexOf(totalPages as number), 0, '...' as string);
  }

  return pages;
});

// Sort users by field
const sortUsers = (field: string): void => {
  setSortBy(field);
};

// Update page size
const updatePageSize = (): void => {
  setPageSize(Number(pageSize.value));
};
</script>

<style scoped>
.user-table-container {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  text-align: left;
  table-layout: fixed;
}

.user-table th {
  background-color: #f3f4f6;
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  user-select: none;
  position: relative;
  transition: background-color 0.2s;
}

.user-table th:hover {
  background-color: #e5e7eb;
}

.user-table th.active {
  background-color: #dbeafe;
  color: #1e40af;
}

.sort-icon {
  margin-left: 0.25rem;
  display: inline-block;
}

.user-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  color: #4b5563;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-table tbody tr:hover {
  background-color: #f9fafb;
}

.user-table a {
  color: #3b82f6;
  text-decoration: none;
}

.user-table a:hover {
  text-decoration: underline;
}

.view-btn {
  display: inline-block;
  background-color: #3b82f6;
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  text-decoration: none;
  transition: background-color 0.2s;
}

.view-btn:hover {
  background-color: #2563eb;
}

.no-results {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

/* Pagination Controls */
.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
  flex-wrap: wrap;
  gap: 1rem;
}

.pagination-info {
  color: #6b7280;
  font-size: 0.875rem;
}

.pagination-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-pages {
  display: flex;
  gap: 0.25rem;
}

.pagination-btn {
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  color: #4b5563;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.pagination-btn.active {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-size-selector label {
  color: #6b7280;
  font-size: 0.875rem;
}

.page-size-select {
  padding: 0.375rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  background-color: white;
}

/* Responsive styles */
@media (max-width: 768px) {
  .user-table th, .user-table td {
    padding: 0.5rem;
  }

  .user-table {
    font-size: 0.75rem;
  }

  /* Hide less important columns on mobile */
  .user-table th:nth-child(3),
  .user-table td:nth-child(3),
  .user-table th:nth-child(5),
  .user-table td:nth-child(5) {
    display: none;
  }

  .pagination-controls {
    flex-direction: column;
    align-items: flex-start;
  }

  .pagination-actions {
    width: 100%;
    justify-content: center;
    order: -1;
  }
}
</style>
