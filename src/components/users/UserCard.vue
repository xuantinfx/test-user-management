<template>
  <div class="user-card">
    <div class="user-header">
      <div class="avatar">
        {{ initials }}
      </div>
      <div class="user-info">
        <h2>{{ user.name }}</h2>
        <p class="username">@{{ user.username }}</p>
      </div>
    </div>

    <div class="user-details">
      <div class="detail-group">
        <h3>Contact Information</h3>
        <div class="detail-item">
          <span class="label">Email:</span>
          <a :href="'mailto:' + user.email">{{ user.email }}</a>
        </div>
        <div class="detail-item">
          <span class="label">Phone:</span>
          <a :href="'tel:' + user.phone">{{ user.phone }}</a>
        </div>
        <div class="detail-item">
          <span class="label">Website:</span>
          <a :href="'https://' + user.website" target="_blank" rel="noopener noreferrer">
            {{ user.website }}
          </a>
        </div>
      </div>

      <div class="detail-group">
        <h3>Address</h3>
        <div class="detail-item">
          <span class="label">Street:</span>
          <span>{{ user.address.street }}, {{ user.address.suite }}</span>
        </div>
        <div class="detail-item">
          <span class="label">City:</span>
          <span>{{ user.address.city }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Zipcode:</span>
          <span>{{ user.address.zipcode }}</span>
        </div>
        <div class="detail-item map-link">
          <a
            :href="mapUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="map-btn"
          >
            View on Map
          </a>
        </div>
      </div>

      <div class="detail-group">
        <h3>Company</h3>
        <div class="detail-item">
          <span class="label">Name:</span>
          <span>{{ user.company.name }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Catch Phrase:</span>
          <span class="catchphrase">{{ user.company.catchPhrase }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Business:</span>
          <span>{{ user.company.bs }}</span>
        </div>
      </div>
    </div>

    <div class="user-actions">
      <router-link :to="{ name: 'dashboard' }" class="back-btn">
        Back to Dashboard
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { User } from '@/types';

interface UserCardProps {
  user: User;
}

const props = defineProps<UserCardProps>();

// Get user initials for avatar
const initials = computed<string>(() => {
  if (!props.user.name) return '';
  return props.user.name
    .split(' ')
    .map((word: string) => word[0])
    .join('')
    .toUpperCase();
});

// Generate Google Maps URL
const mapUrl = computed<string>(() => {
  const { lat, lng } = props.user.address.geo;
  return `https://www.google.com/maps?q=${lat},${lng}`;
});
</script>

<style scoped>
.user-card {
  background-color: var(--bg-light);
  border-radius: 8px;
  box-shadow: var(--shadow-md);
  overflow: hidden;
  max-width: 800px;
  margin: 0 auto;
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease-in-out;
}

.user-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.user-header {
  display: flex;
  align-items: center;
  padding: var(--space-lg);
  background-color: var(--bg-dark);
  border-bottom: 1px solid var(--border-color);
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  margin-right: var(--space-md);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
  background-color: var(--primary-dark);
}

.user-info h2 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.25rem;
}

.username {
  margin: var(--space-xs) 0 0;
  color: var(--text-light);
  font-size: 0.875rem;
}

.user-details {
  padding: var(--space-lg);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-lg);
}

.detail-group {
  transition: all 0.3s ease;
  padding: var(--space-md);
  border-radius: 8px;
}

.detail-group:hover {
  background-color: var(--bg-dark);
  transform: translateY(-2px);
}

.detail-group h3 {
  margin-top: 0;
  margin-bottom: var(--space-md);
  color: var(--text-color);
  font-size: 1rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: var(--space-sm);
  position: relative;
}

.detail-group h3::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 40px;
  height: 3px;
  background-color: var(--primary-color);
  border-radius: 1.5px;
}

.detail-item {
  margin-bottom: var(--space-sm);
  font-size: 0.875rem;
  display: flex;
  flex-wrap: wrap;
}

.label {
  font-weight: 600;
  color: var(--text-color);
  margin-right: var(--space-sm);
  min-width: 80px;
}

.detail-item a {
  text-decoration: none;
  transition: color 0.2s ease;
}

.detail-item a:hover {
  text-decoration: underline;
}

.catchphrase {
  font-style: italic;
  color: var(--text-light);
}

.map-link {
  margin-top: var(--space-md);
}

.map-btn {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: var(--space-sm) var(--space-md);
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.map-btn:hover {
  transform: translateY(-1px);
}

.map-btn:active {
  transform: translateY(0);
}

.user-actions {
  padding: var(--space-md) var(--space-lg);
  background-color: var(--bg-dark);
  border-top: 1px solid var(--border-color);
  text-align: right;
}

.back-btn {
  display: inline-block;
  background-color: var(--primary-light);
  color: white;
  padding: var(--space-sm) var(--space-md);
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background-color: var(--text-color);
  transform: translateY(-1px);
}

.back-btn:active {
  transform: translateY(0);
}

/* Responsive styles */
@media (max-width: 768px) {
  .user-details {
    grid-template-columns: 1fr;
    gap: var(--space-md);
    padding: var(--space-md);
  }

  .user-header {
    padding: var(--space-md);
  }

  .user-actions {
    padding: var(--space-md);
  }
}

@media (max-width: 640px) {
  .user-details {
    padding: var(--space-sm);
    gap: var(--space-sm);
  }

  .user-header {
    flex-direction: column;
    text-align: center;
    padding: var(--space-md) var(--space-sm);
  }

  .avatar {
    margin-right: 0;
    margin-bottom: var(--space-md);
  }

  .detail-group {
    padding: var(--space-sm);
  }

  .detail-item {
    flex-direction: column;
  }

  .label {
    margin-bottom: var(--space-xs);
  }

  .user-actions {
    text-align: center;
  }

  .back-btn {
    width: 100%;
    text-align: center;
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
