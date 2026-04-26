import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<any>(null);

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  async function login(username: string, password: string) {
    const response = await api.post('/auth/login', { username, password });
    console.log('Login response:', response);
    token.value = response.token;
    user.value = response.user;
    localStorage.setItem('token', response.token);
    return response;
  }

  async function register(username: string, password: string) {
    const response = await api.post('/auth/register', { username, password });
    console.log('Register response:', response);
    token.value = response.token;
    user.value = response.user;
    localStorage.setItem('token', response.token);
    return response;
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
  }

  async function fetchProfile() {
    try {
      const response = await api.get('/users/me');
      user.value = response;
      return response;
    } catch (error) {
      logout();
      throw error;
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    fetchProfile,
  };
});
