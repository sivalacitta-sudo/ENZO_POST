<template>
  <AdminLayout>
    <div v-if="!isAdmin" class="text-center py-12">
      <h2 class="text-xl font-semibold mb-4">Access Denied</h2>
      <p class="text-gray-600">Only administrators can manage comments.</p>
      <router-link to="/admin" class="text-brand-green hover:underline mt-4 inline-block">Back to My Posts</router-link>
    </div>

    <template v-else>
      <h1 class="text-2xl font-semibold tracking-tight-heading mb-8">Comments Management</h1>

      <div v-if="loading" class="text-center py-12 text-gray-500">Loading...</div>

      <div v-else-if="comments.length === 0" class="text-center py-12 text-gray-500">
        No comments yet.
      </div>

      <div v-else class="bg-white rounded-card border-subtle overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-subtle">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Author</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Comment</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Post</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-subtle">
            <tr v-for="comment in comments" :key="comment.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <span class="font-medium">{{ comment.authorName }}</span>
              </td>
              <td class="px-6 py-4 text-sm">{{ comment.content }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ comment.postTitle }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(comment.createdAt) }}</td>
              <td class="px-6 py-4 text-right">
                <button @click="deleteComment(comment.id)" class="text-sm text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import AdminLayout from '../../layouts/AdminLayout.vue';
import api from '../../services/api';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
const isAdmin = computed(() => authStore.user?.role === 'admin');

const comments = ref<any[]>([]);
const loading = ref(true);

async function loadComments() {
  loading.value = true;
  try {
    const response = await api.get('/comments');
    comments.value = response;
  } catch (err) {
    console.error('Failed to load comments:', err);
  } finally {
    loading.value = false;
  }
}

async function deleteComment(id: number) {
  if (!confirm('Are you sure you want to delete this comment?')) return;

  try {
    await api.delete(`/comments/${id}`);
    comments.value = comments.value.filter((c) => c.id !== id);
  } catch (err) {
    console.error('Failed to delete comment:', err);
    alert('Failed to delete comment.');
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

onMounted(() => {
  if (isAdmin.value) {
    loadComments();
  } else {
    loading.value = false;
  }
});
</script>

<style scoped>
.divide-subtle > :not([hidden]) ~ :not([hidden]) {
  border-color: rgba(0, 0, 0, 0.05);
}
</style>
