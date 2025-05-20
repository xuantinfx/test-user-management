<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <router-link :to="{ name: 'dashboard' }" class="home-btn">
        Go to Dashboard
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional setup needed for this simple component
</script>

<style scoped>
.not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: var(--space-xl);
  animation: fadeIn 0.5s ease-in-out;
}

.not-found-content {
  text-align: center;
  max-width: 500px;
  padding: var(--space-xl) var(--space-lg);
  background-color: var(--bg-light);
  border-radius: 8px;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}

.not-found-content:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-3px);
}

h1 {
  font-size: 6rem;
  margin: 0;
  color: var(--danger-color);
  line-height: 1;
  font-weight: 800;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 1.5rem;
  margin: var(--space-sm) 0 var(--space-lg);
  color: var(--text-color);
  font-weight: 600;
}

p {
  color: var(--text-light);
  margin-bottom: var(--space-lg);
  font-size: 1rem;
}

.home-btn {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: var(--space-sm) var(--space-lg);
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.home-btn:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.home-btn:active {
  transform: translateY(0);
}

/* Responsive styles */
@media (max-width: 768px) {
  .not-found-page {
    padding: var(--space-lg);
  }

  .not-found-content {
    padding: var(--space-lg) var(--space-md);
  }

  h1 {
    font-size: 5rem;
  }
}

@media (max-width: 640px) {
  .not-found-page {
    padding: var(--space-md);
  }

  .not-found-content {
    padding: var(--space-md);
    max-width: 100%;
  }

  h1 {
    font-size: 4rem;
  }

  h2 {
    font-size: 1.25rem;
  }

  .home-btn {
    width: 100%;
    padding: var(--space-md);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
