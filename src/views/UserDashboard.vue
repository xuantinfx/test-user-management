<template>
  <div class="dashboard">
    <h1>User Dashboard</h1>

    <ErrorAlert
      v-if="error"
      :message="error"
      @dismiss="dismissError"
    />

    <UserFilter />

    <div class="dashboard-content">
      <div v-if="isLoading && (!users || !users.length)" class="loading-container">
        <LoadingSpinner message="Loading users..." />
      </div>

      <template v-else>
        <div class="results-info">
          <p>
            Showing {{ sortedUsers.length }} of {{ users.length }} users
            <span v-if="isFiltered">(filtered)</span>
          </p>
          <button
            v-if="users && users.length && !isLoading"
            @click="refreshUsers"
            class="refresh-btn"
            :disabled="refreshing"
          >
            <span v-if="refreshing">Refreshing...</span>
            <span v-else>Refresh Data</span>
          </button>
        </div>

        <UserTable />
      </template>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useUsers } from '../hooks/useUsers';
import UserFilter from '../components/users/UserFilter.vue';
import UserTable from '../components/users/UserTable.vue';
import LoadingSpinner from '../components/ui/LoadingSpinner.vue';
import ErrorAlert from '../components/ui/ErrorAlert.vue';

export default {
  name: 'UserDashboard',
  components: {
    UserFilter,
    UserTable,
    LoadingSpinner,
    ErrorAlert
  },
  setup() {
    const refreshing = ref(false);

    // Use the users hook
    const {
      users,
      sortedUsers,
      isLoading,
      isError,
      error,
      isFiltered,
      refreshUsers: refetchUsers
    } = useUsers();

    // Refresh user data with loading state
    const refreshUsers = async () => {
      refreshing.value = true;
      await refetchUsers();
      refreshing.value = false;
    };

    // Dismiss error message
    const dismissError = () => {
      error.value = null;
    };

    return {
      users,
      sortedUsers,
      isLoading,
      isError,
      error,
      isFiltered,
      refreshUsers,
      refreshing,
      dismissError
    };
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

h1 {
  margin-top: 0;
  margin-bottom: 2rem;
  color: #1f2937;
  font-size: 1.875rem;
  font-weight: 700;
}

.dashboard-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.loading-container {
  padding: 3rem;
  display: flex;
  justify-content: center;
}

.results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.results-info p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.refresh-btn {
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  background-color: #2563eb;
}

.refresh-btn:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .dashboard {
    padding: 1rem;
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .results-info {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
}
</style>
