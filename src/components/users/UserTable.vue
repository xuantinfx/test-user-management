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
        ({{ pagination.totalItems }} {{ isFiltered ? 'filtered' : 'total' }} items)
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
import { computed } from 'vue';
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
  setPageSize,
  isFiltered
} = useUsers();

// Page size as a computed property for two-way binding
const pageSize = computed({
  get: () => pagination.value.pageSize,
  set: (value: number) => setPageSize(Number(value))
});

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

// Update page size - now a no-op since we're using a computed property
const updatePageSize = (): void => {
  // The computed property setter will handle this automatically
};
</script>

<style scoped>
.user-table-container {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  background-color: var(--bg-light);
  transition: box-shadow 0.3s ease;
}

.user-table-container:hover {
  box-shadow: var(--shadow-lg);
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  text-align: left;
  table-layout: fixed;
}

.user-table th {
  background-color: var(--bg-dark);
  padding: var(--space-md);
  font-weight: 600;
  color: var(--text-color);
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  user-select: none;
  position: relative;
  transition: all 0.2s ease;
}

.user-table th:hover {
  background-color: var(--border-color);
}

.user-table th.active {
  background-color: rgba(79, 70, 229, 0.1);
  color: var(--primary-color);
}

.sort-icon {
  margin-left: var(--space-xs);
  display: inline-block;
  font-weight: bold;
}

.user-table td {
  padding: var(--space-md);
  border-bottom: 1px solid var(--border-color);
  color: var(--text-light);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-table tbody tr {
  transition: background-color 0.2s ease;
}

.user-table tbody tr:hover {
  background-color: var(--bg-dark);
}

.user-table a {
  text-decoration: none;
  transition: color 0.2s ease;
}

.user-table a:hover {
  text-decoration: underline;
}

.view-btn {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: var(--space-xs) var(--space-sm);
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}

.view-btn:hover {
  background-color: var(--primary-dark);
  transform: translateY(-1px);
}

.view-btn:active {
  transform: translateY(0);
}

.no-results {
  text-align: center;
  padding: var(--space-xl);
  color: var(--text-light);
  font-style: italic;
}

/* Pagination Controls */
.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md);
  background-color: var(--bg-dark);
  border-top: 1px solid var(--border-color);
  flex-wrap: wrap;
  gap: var(--space-md);
}

.pagination-info {
  color: var(--text-light);
  font-size: 0.875rem;
}

.pagination-actions {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.pagination-pages {
  display: flex;
  gap: var(--space-xs);
}

.pagination-btn {
  background-color: var(--bg-light);
  border: 1px solid var(--border-color);
  color: var(--text-light);
  padding: var(--space-xs) var(--space-sm);
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 32px;
  text-align: center;
}

.pagination-btn:hover:not(:disabled) {
  background-color: var(--bg-dark);
  border-color: var(--border-dark);
  color: var(--text-color);
}

.pagination-btn.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  font-weight: 600;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.page-size-selector label {
  color: var(--text-light);
  font-size: 0.875rem;
}

.page-size-select {
  padding: var(--space-xs) var(--space-sm);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.875rem;
  background-color: var(--bg-light);
  transition: all 0.2s ease;
  color: var(--text-color);
}

.page-size-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

/* Responsive styles */
@media (max-width: 1024px) {
  .user-table th, .user-table td {
    padding: var(--space-sm);
  }
}

@media (max-width: 768px) {
  .user-table th, .user-table td {
    padding: var(--space-xs) var(--space-sm);
  }

  .user-table {
    font-size: 0.75rem;
  }

  /* Hide less important columns on medium screens */
  .user-table th:nth-child(3),
  .user-table td:nth-child(3) {
    display: none;
  }

  .pagination-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-sm);
  }

  .pagination-actions {
    width: 100%;
    justify-content: center;
    order: -1;
  }

  .page-size-selector {
    align-self: flex-end;
  }
}

@media (max-width: 640px) {
  /* Hide more columns on small screens */
  .user-table th:nth-child(5),
  .user-table td:nth-child(5) {
    display: none;
  }

  .pagination-pages {
    overflow-x: auto;
    max-width: 200px;
    padding-bottom: var(--space-xs);
  }

  .page-size-selector {
    width: 100%;
    justify-content: space-between;
    margin-top: var(--space-xs);
  }

  .pagination-info {
    width: 100%;
    text-align: center;
    order: -2;
  }
}

/* Card view for very small screens */
@media (max-width: 480px) {
  .user-table thead {
    display: none;
  }

  .user-table,
  .user-table tbody,
  .user-table tr,
  .user-table td {
    display: block;
    width: 100%;
    text-align: left;
  }

  .user-table tr {
    margin-bottom: var(--space-md);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    overflow: hidden;
  }

  .user-table td {
    position: relative;
    padding-left: 40%;
    white-space: normal;
  }

  .user-table td:before {
    position: absolute;
    left: var(--space-sm);
    width: 35%;
    font-weight: 600;
    color: var(--text-color);
  }

  /* Add labels for each cell */
  .user-table td:nth-child(1):before { content: "ID:"; }
  .user-table td:nth-child(2):before { content: "Name:"; }
  .user-table td:nth-child(4):before { content: "Email:"; }
  .user-table td:nth-child(6):before { content: "Actions:"; }

  /* Show all cells in card view */
  .user-table td:nth-child(3),
  .user-table td:nth-child(5) {
    display: block;
    padding-left: 40%;
  }

  .user-table td:nth-child(3):before { content: "Username:"; }
  .user-table td:nth-child(5):before { content: "Company:"; }
}
</style>
