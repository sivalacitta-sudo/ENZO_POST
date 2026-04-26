<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <nav class="bg-white border-b border-subtle">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <router-link to="/admin" class="text-xl font-semibold tracking-tight-heading">
          {{ isAdmin ? 'Admin Panel' : 'User Panel' }}
        </router-link>
        <div class="flex items-center gap-4">
          <router-link to="/admin" class="text-sm font-medium hover:text-brand-green">My Posts</router-link>
          <router-link v-if="isAdmin" to="/admin/comments" class="text-sm font-medium hover:text-brand-green">Comments</router-link>
          <router-link v-if="isAdmin" to="/admin/tags" class="text-sm font-medium hover:text-brand-green">Tags</router-link>
          <router-link to="/" class="text-sm font-medium hover:text-brand-green">View Site</router-link>
          <MintButton variant="secondary" size="sm" @click="handleLogout">Logout</MintButton>
        </div>
      </div>
    </nav>
    <main class="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import MintButton from '../components/MintButton.vue';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const isAdmin = computed(() => authStore.user?.role === 'admin');

function handleLogout() {
  authStore.logout();
  router.push('/admin/login');
}
</script>
