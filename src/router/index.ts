import { createRouter, createWebHistory } from "vue-router";
import AuthFlow from "../components/AuthFlow.vue";
import Dashboard from "../components/Dashboard.vue";
import { useAuthStore } from "../stores/auth";

const routes = [
  {
    path: "/",
    redirect: "/auth",
  },
  {
    path: "/auth",
    name: "Auth",
    component: AuthFlow,
    meta: { requiresGuest: true },
  },
  {
    path: "/login",
    redirect: "/auth",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guards
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();

  try {
    // Always check auth status fresh from backend
    console.log('Checking authentication status...');
    const isAuthenticated = await authStore.checkAuthStatus();
    console.log('Authentication status:', isAuthenticated);
    console.log('User object:', authStore.user);

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      console.log("Access denied: User not authenticated, redirecting to auth");
      next("/auth");
    } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
      console.log("Redirecting authenticated user to dashboard");
      next("/dashboard");
    } else {
      console.log(`Navigation allowed to ${to.path}`);
      next();
    }
  } catch (error: any) {
    console.error("Navigation error:", error);
    next("/auth");
  }
});

export default router;
