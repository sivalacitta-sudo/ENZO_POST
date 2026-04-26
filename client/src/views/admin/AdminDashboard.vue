<template>
  <AdminLayout>
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-semibold tracking-tight-heading">My Posts</h1>
      <router-link to="/admin/post/new">
        <MintButton variant="primary">New Post</MintButton>
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-12 text-gray-500">Loading...</div>

    <div v-else-if="posts.length === 0" class="text-center py-12 text-gray-500">
      No posts yet. Click "New Post" to create one.
    </div>

    <div v-else class="bg-white rounded-card border-subtle overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-subtle">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Title</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Views</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-subtle">
          <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <span class="font-medium">{{ post.title }}</span>
            </td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'px-2 py-1 text-xs rounded-pill',
                  post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600',
                ]"
              >
                {{ post.status }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ post.viewCount }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(post.createdAt) }}</td>
            <td class="px-6 py-4 text-right space-x-2">
              <router-link :to="`/admin/post/${post.id}`" class="text-sm text-brand-green hover:underline">Edit</router-link>
              <button @click="deletePostHandler(post.id)" class="text-sm text-red-600 hover:underline">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '../../layouts/AdminLayout.vue';
import MintButton from '../../components/MintButton.vue';
import api from '../../services/api';

const posts = ref<any[]>([]);
const loading = ref(true);

async function loadData() {
  loading.value = true;
  try {
    const response = await api.get('/posts/my/posts');
    posts.value = response.posts || [];
  } catch (error) {
    console.error('Failed to load posts:', error);
  } finally {
    loading.value = false;
  }
}

async function deletePostHandler(id: number) {
  if (!confirm('Are you sure you want to delete this post?')) return;

  try {
    await api.delete(`/posts/${id}`);
    posts.value = posts.value.filter((p) => p.id !== id);
  } catch (error) {
    console.error('Failed to delete post:', error);
    alert('Failed to delete post.');
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.divide-subtle > :not([hidden]) ~ :not([hidden]) {
  border-color: rgba(0, 0, 0, 0.05);
}
</style>
