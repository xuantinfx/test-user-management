import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// Import views
import UserDashboard from '../views/UserDashboard.vue';
import UserDetails from '../views/UserDetails.vue';
import NotFound from '../views/NotFound.vue';

// Define custom meta type
declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
  }
}

// Define routes with proper typing
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'dashboard',
    component: UserDashboard,
    meta: {
      title: 'User Dashboard'
    }
  },
  {
    path: '/user/:id',
    name: 'user-details',
    component: UserDetails,
    meta: {
      title: 'User Details'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
    meta: {
      title: '404 Not Found'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Update document title based on route meta
router.beforeEach((to, _from, next) => {
  document.title = to.meta.title || 'User Dashboard';
  next();
});

export default router;
