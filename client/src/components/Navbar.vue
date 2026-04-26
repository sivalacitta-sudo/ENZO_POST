<template>
  <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-subtle">
    <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <router-link to="/" class="text-xl font-semibold tracking-tight-heading hover:text-brand-green transition-colors">
        Blog CMS
      </router-link>

      <div class="flex items-center gap-6">
        <router-link to="/" class="text-[14px] font-medium hover:text-brand-green transition-colors">Home</router-link>
        <router-link to="/about" class="text-[14px] font-medium hover:text-brand-green transition-colors">About</router-link>
        <router-link v-if="!isAuthenticated" to="/admin/login" class="text-[14px] font-medium hover:text-brand-green transition-colors">Admin</router-link>
        <router-link v-if="isAuthenticated" to="/admin" class="text-[14px] font-medium hover:text-brand-green transition-colors">Dashboard</router-link>
        <MintButton v-if="isAuthenticated" variant="secondary" size="sm" @click="handleLogout">
          Logout
        </MintButton>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import MintButton from './MintButton.vue';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);

function handleLogout() {
  authStore.logout();
  router.push('/');
}
</script>
