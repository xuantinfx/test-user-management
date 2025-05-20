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
  padding: 2rem 1rem;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 3rem;
}

.not-found {
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.not-found h2 {
  color: #ef4444;
  margin-top: 0;
}

.not-found p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.back-btn {
  display: inline-block;
  background-color: #6b7280;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background-color: #4b5563;
}

@media (max-width: 640px) {
  .user-details-page {
    padding: 1rem;
  }
}
</style>
