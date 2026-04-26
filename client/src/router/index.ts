import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Public routes
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/post/:slug',
      name: 'post-detail',
      component: () => import('../views/PostDetailView.vue'),
    },
    {
      path: '/tag/:slug',
      name: 'tag-list',
      component: () => import('../views/TagListView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    // Admin routes
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('../views/admin/LoginView.vue'),
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('../views/admin/AdminDashboard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/post/new',
      name: 'post-new',
      component: () => import('../views/admin/PostEditorView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/post/:id',
      name: 'post-edit',
      component: () => import('../views/admin/PostEditorView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/comments',
      name: 'comment-manager',
      component: () => import('../views/admin/CommentManagerView.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/admin/login');
  } else if (to.path === '/admin/login' && authStore.isAuthenticated) {
    next('/admin');
  } else {
    next();
  }
});

export default router;
