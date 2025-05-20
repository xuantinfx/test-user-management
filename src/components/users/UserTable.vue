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
        <tr v-for="user in sortedUsers" :key="user.id">
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
        <tr v-if="sortedUsers.length === 0">
          <td colspan="6" class="no-results">
            <p v-if="isLoading">Loading users...</p>
            <p v-else-if="error">Error loading users</p>
            <p v-else-if="!users || users.length === 0">No users found</p>
            <p v-else>No users match your filter criteria</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { useUsers } from '../../hooks/useUsers';

export default {
  name: 'UserTable',
  setup() {
    const { sortBy, setSortBy, sortedUsers, users, isLoading, error } = useUsers();

    const sortUsers = (field) => {
      setSortBy(field);
    };

    return {
      sortBy,
      sortUsers,
      sortedUsers,
      users,
      isLoading,
      error
    };
  }
}
</script>

<style scoped>
.user-table-container {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  text-align: left;
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

@media (max-width: 768px) {
  .user-table th, .user-table td {
    padding: 0.5rem;
  }

  .user-table {
    font-size: 0.75rem;
  }
}
</style>
