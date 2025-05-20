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
  padding: var(--space-xl) var(--space-md);
  animation: fadeIn 0.5s ease-in-out;
}

h1 {
  margin-top: 0;
  margin-bottom: var(--space-xl);
  color: var(--text-color);
  font-size: 1.875rem;
  font-weight: 700;
  position: relative;
  display: inline-block;
}

h1::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 4px;
  background-color: var(--primary-color);
  border-radius: 2px;
}

.dashboard-content {
  background-color: var(--bg-light);
  border-radius: 8px;
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.dashboard-content:hover {
  box-shadow: var(--shadow-lg);
}

.loading-container {
  padding: var(--space-xl);
  display: flex;
  justify-content: center;
}

.results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md);
  background-color: var(--bg-dark);
  border-bottom: 1px solid var(--border-color);
}

.results-info p {
  margin: 0;
  color: var(--text-light);
  font-size: 0.875rem;
}

.refresh-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: var(--space-sm) var(--space-md);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.refresh-btn:hover:not(:disabled) {
  background-color: var(--primary-dark);
  transform: translateY(-1px);
}

.refresh-btn:active:not(:disabled) {
  transform: translateY(0);
}

.refresh-btn:disabled {
  background-color: var(--primary-light);
  opacity: 0.7;
  cursor: not-allowed;
}

/* Responsive styles */
@media (max-width: 768px) {
  .dashboard {
    padding: var(--space-lg) var(--space-md);
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: var(--space-lg);
  }
}

@media (max-width: 640px) {
  .dashboard {
    padding: var(--space-md);
  }

  h1 {
    font-size: 1.25rem;
    margin-bottom: var(--space-md);
  }

  .results-info {
    flex-direction: column;
    gap: var(--space-sm);
    align-items: flex-start;
  }

  .loading-container {
    padding: var(--space-lg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
