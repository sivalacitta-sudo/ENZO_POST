<template>
  <AdminLayout>
    <div v-if="!isAdmin" class="text-center py-12">
      <h2 class="text-xl font-semibold mb-4">Access Denied</h2>
      <p class="text-gray-600">Only administrators can manage tags.</p>
      <router-link to="/admin" class="text-brand-green hover:underline mt-4 inline-block">Back to My Posts</router-link>
    </div>

    <template v-else>
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-semibold tracking-tight-heading">Tags Management</h1>
        <MintButton variant="primary" @click="showCreateModal = true">New Tag</MintButton>
      </div>

      <div v-if="loading" class="text-center py-12 text-gray-500">Loading...</div>

      <div v-else-if="tags.length === 0" class="text-center py-12 text-gray-500">
        No tags yet. Click "New Tag" to create one.
      </div>

      <div v-else class="bg-white rounded-card border-subtle overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-subtle">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Slug</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Posts</th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-subtle">
            <tr v-for="tag in tags" :key="tag.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <span class="font-medium">{{ tag.name }}</span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ tag.slug }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ tag.postCount || 0 }}</td>
              <td class="px-6 py-4 text-right">
                <button @click="deleteTag(tag.id)" class="text-sm text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Create Tag Modal -->
      <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-card p-6 w-full max-w-md">
          <h2 class="text-xl font-semibold mb-4">Create New Tag</h2>
          <form @submit.prevent="createTag">
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Tag Name</label>
              <input
                v-model="newTagName"
                type="text"
                required
                class="w-full px-4 py-2 border border-medium rounded-pill focus:outline-none focus:ring-1 focus:ring-brand-green"
                placeholder="Enter tag name"
              />
            </div>
            <div v-if="error" class="text-sm text-red-600 mb-4">{{ error }}</div>
            <div class="flex gap-4">
              <MintButton variant="primary" type="submit" :disabled="creating">
                {{ creating ? 'Creating...' : 'Create' }}
              </MintButton>
              <MintButton variant="secondary" type="button" @click="showCreateModal = false">
                Cancel
              </MintButton>
            </div>
          </form>
        </div>
      </div>
    </template>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import AdminLayout from '../../layouts/AdminLayout.vue';
import MintButton from '../../components/MintButton.vue';
import api from '../../services/api';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
const isAdmin = computed(() => authStore.user?.role === 'admin');

const tags = ref<any[]>([]);
const loading = ref(true);
const showCreateModal = ref(false);
const newTagName = ref('');
const error = ref('');
const creating = ref(false);

async function loadTags() {
  loading.value = true;
  try {
    const response = await api.get('/tags');
    tags.value = response;
  } catch (err) {
    console.error('Failed to load tags:', err);
  } finally {
    loading.value = false;
  }
}

async function createTag() {
  error.value = '';
  creating.value = true;
  
  try {
    await api.post('/tags', { name: newTagName.value });
    showCreateModal.value = false;
    newTagName.value = '';
    await loadTags();
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to create tag.';
  } finally {
    creating.value = false;
  }
}

async function deleteTag(id: number) {
  if (!confirm('Are you sure you want to delete this tag?')) return;
  
  try {
    await api.delete(`/tags/${id}`);
    tags.value = tags.value.filter((t) => t.id !== id);
  } catch (err) {
    console.error('Failed to delete tag:', err);
    alert('Failed to delete tag.');
  }
}

onMounted(() => {
  if (isAdmin.value) {
    loadTags();
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
