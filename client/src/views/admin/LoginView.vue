<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-6">
    <MintCard size="lg" class="w-full max-w-md">
      <h1 class="text-2xl font-semibold tracking-tight-heading mb-6 text-center">Login</h1>

      <form @submit.prevent class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Username</label>
          <input
            v-model="username"
            type="text"
            required
            class="w-full px-4 py-2 border border-medium rounded-pill focus:outline-none focus:ring-1 focus:ring-brand-green"
            placeholder="Enter your username"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 border border-medium rounded-pill focus:outline-none focus:ring-1 focus:ring-brand-green"
            placeholder="Enter your password"
          />
        </div>

        <div v-if="error" class="text-sm text-red-600 bg-red-50 p-3 rounded-card">{{ error }}</div>
        <div v-if="successMsg" class="text-sm text-green-600 bg-green-50 p-3 rounded-card">{{ successMsg }}</div>

        <div class="flex gap-3 pt-2">
          <MintButton variant="secondary" className="flex-1" :disabled="loading" @click="handleRegister">
            Register
          </MintButton>
          <MintButton variant="primary" className="flex-1" :disabled="loading" @click="handleLogin">
            {{ loading ? 'Processing...' : 'Login' }}
          </MintButton>
        </div>
      </form>

      <p class="mt-4 text-center text-sm text-gray-500">
        Register creates a new account. Login uses existing account.
      </p>
    </MintCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import MintCard from '../../components/MintCard.vue';
import MintButton from '../../components/MintButton.vue';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const password = ref('');
const error = ref('');
const successMsg = ref('');
const loading = ref(false);

async function handleLogin() {
  error.value = '';
  successMsg.value = '';
  loading.value = true;

  try {
    await authStore.login(username.value, password.value);
    successMsg.value = 'Login successful! Redirecting...';
    setTimeout(() => router.push('/admin'), 300);
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Invalid username or password.';
  } finally {
    loading.value = false;
  }
}

async function handleRegister() {
  error.value = '';
  successMsg.value = '';
  loading.value = true;

  try {
    await authStore.register(username.value, password.value);
    successMsg.value = 'Account created! Redirecting...';
    setTimeout(() => router.push('/admin'), 300);
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Registration failed.';
  } finally {
    loading.value = false;
  }
}
</script>
