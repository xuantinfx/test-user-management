<template>
  <div class="user-details-page">
    <div v-if="loading" class="loading-container">
      <LoadingSpinner message="Loading user details..." />
    </div>

    <ErrorAlert
      v-if="error"
      :message="error"
      @dismiss="dismissError"
    />

    <div v-if="!loading && !error && user" class="user-details-content">
      <UserCard :user="user" />
    </div>

    <div v-if="!loading && !error && !user" class="not-found">
      <h2>User Not Found</h2>
      <p>The user you are looking for does not exist or has been removed.</p>
      <router-link :to="{ name: 'dashboard' }" class="back-btn">
        Back to Dashboard
      </router-link>
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router';
import { useUser } from '../hooks/useUser';
import UserCard from '../components/users/UserCard.vue';
import LoadingSpinner from '../components/ui/LoadingSpinner.vue';
import ErrorAlert from '../components/ui/ErrorAlert.vue';

export default {
  name: 'UserDetails',
  components: {
    UserCard,
    LoadingSpinner,
    ErrorAlert
  },
  setup() {
    const route = useRoute();
    const userId = parseInt(route.params.id);

    // Use the user hook to fetch user data
    const {
      user,
      isLoading,
      error,
      dismissError
    } = useUser(userId);

    return {
      user,
      loading: isLoading,
      error,
      dismissError
    };
  }
}
</script>

<style scoped>
.user-details-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-xl) var(--space-md);
  animation: fadeIn 0.5s ease-in-out;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: var(--space-xl);
}

.user-details-content {
  transition: all 0.3s ease;
}

.not-found {
  text-align: center;
  padding: var(--space-xl);
  background-color: var(--bg-light);
  border-radius: 8px;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}

.not-found:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.not-found h2 {
  color: var(--danger-color);
  margin-top: 0;
  font-size: 1.5rem;
  margin-bottom: var(--space-md);
}

.not-found p {
  color: var(--text-light);
  margin-bottom: var(--space-lg);
  font-size: 1rem;
  line-height: 1.5;
}

.back-btn {
  display: inline-block;
  background-color: var(--text-light);
  color: white;
  padding: var(--space-sm) var(--space-md);
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.back-btn:hover {
  background-color: var(--text-color);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.back-btn:active {
  transform: translateY(0);
}

/* Responsive styles */
@media (max-width: 768px) {
  .user-details-page {
    padding: var(--space-lg) var(--space-md);
  }

  .loading-container {
    padding: var(--space-lg);
  }

  .not-found {
    padding: var(--space-lg);
  }
}

@media (max-width: 640px) {
  .user-details-page {
    padding: var(--space-md);
  }

  .loading-container {
    padding: var(--space-md);
  }

  .not-found {
    padding: var(--space-md);
  }

  .back-btn {
    width: 100%;
    text-align: center;
    padding: var(--space-md);
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
