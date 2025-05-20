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

<script>
export default {
  name: 'UserCard',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    // Get user initials for avatar
    initials() {
      if (!this.user.name) return '';
      return this.user.name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase();
    },
    
    // Generate Google Maps URL
    mapUrl() {
      const { lat, lng } = this.user.address.geo;
      return `https://www.google.com/maps?q=${lat},${lng}`;
    }
  }
}
</script>

<style scoped>
.user-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 800px;
  margin: 0 auto;
}

.user-header {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background-color: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  margin-right: 1rem;
}

.user-info h2 {
  margin: 0;
  color: #1f2937;
  font-size: 1.25rem;
}

.username {
  margin: 0.25rem 0 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.user-details {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.detail-group h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #374151;
  font-size: 1rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.detail-item {
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.label {
  font-weight: 600;
  color: #4b5563;
  margin-right: 0.5rem;
}

.detail-item a {
  color: #3b82f6;
  text-decoration: none;
}

.detail-item a:hover {
  text-decoration: underline;
}

.catchphrase {
  font-style: italic;
  color: #6b7280;
}

.map-link {
  margin-top: 1rem;
}

.map-btn {
  display: inline-block;
  background-color: #10b981;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.map-btn:hover {
  background-color: #059669;
}

.user-actions {
  padding: 1rem 1.5rem;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
  text-align: right;
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
  .user-details {
    grid-template-columns: 1fr;
  }
  
  .user-header {
    flex-direction: column;
    text-align: center;
  }
  
  .avatar {
    margin-right: 0;
    margin-bottom: 1rem;
  }
}
</style>
