<template>
  <AdminLayout>
    <div class="mb-8">
      <h1 class="text-2xl font-semibold tracking-tight-heading">{{ isEdit ? 'Edit Post' : 'New Post' }}</h1>
    </div>

    <MintCard size="lg">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium mb-2">Title</label>
          <input
            v-model="form.title"
            type="text"
            required
            class="w-full px-4 py-2 border border-medium rounded-pill focus:outline-none focus:ring-1 focus:ring-brand-green"
            placeholder="Enter post title"
          />
        </div>

        <!-- Excerpt -->
        <div>
          <label class="block text-sm font-medium mb-2">Excerpt (optional)</label>
          <input
            v-model="form.excerpt"
            type="text"
            class="w-full px-4 py-2 border border-medium rounded-pill focus:outline-none focus:ring-1 focus:ring-brand-green"
            placeholder="Brief description of the post"
          />
        </div>

        <!-- Cover Image URL -->
        <div>
          <label class="block text-sm font-medium mb-2">Cover Image URL (optional)</label>
          <input
            v-model="form.coverImage"
            type="text"
            class="w-full px-4 py-2 border border-medium rounded-pill focus:outline-none focus:ring-1 focus:ring-brand-green"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-sm font-medium mb-2">Tags</label>
          <div class="flex flex-wrap gap-2 mb-2">
            <span
              v-for="tag in selectedTags"
              :key="tag.id"
              class="px-3 py-1 bg-brand-green/20 rounded-pill text-sm flex items-center gap-2"
            >
              {{ tag.name }}
              <button type="button" @click="removeTag(tag.id)" class="hover:text-red-600">&times;</button>
            </span>
          </div>
          <select
            @change="addTag($event)"
            class="px-4 py-2 border border-medium rounded-pill focus:outline-none focus:ring-1 focus:ring-brand-green"
          >
            <option value="">Select a tag...</option>
            <option v-for="tag in availableTags" :key="tag.id" :value="tag.id" :disabled="isTagSelected(tag.id)">
              {{ tag.name }}
            </option>
          </select>
        </div>

        <!-- Markdown Editor -->
        <div>
          <label class="block text-sm font-medium mb-2">Content (Markdown)</label>
          <textarea
            v-model="form.content"
            rows="15"
            class="w-full px-4 py-3 border border-medium rounded-card font-mono text-sm focus:outline-none focus:ring-1 focus:ring-brand-green resize-none"
            placeholder="# Write your post content in Markdown here..."
          ></textarea>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium mb-2">Status</label>
          <select
            v-model="form.status"
            class="px-4 py-2 border border-medium rounded-pill focus:outline-none focus:ring-1 focus:ring-brand-green"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <!-- Error message -->
        <div v-if="error" class="text-sm text-red-600">{{ error }}</div>

        <!-- Actions -->
        <div class="flex gap-4">
          <MintButton variant="primary" type="submit" :disabled="loading">
            {{ loading ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post' }}
          </MintButton>
          <router-link to="/admin">
            <MintButton variant="secondary">Cancel</MintButton>
          </router-link>
        </div>
      </form>
    </MintCard>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import 'bytemd/dist/index.css';
import 'highlight.js/styles/github.css';
import AdminLayout from '../../layouts/AdminLayout.vue';
import MintCard from '../../components/MintCard.vue';
import MintButton from '../../components/MintButton.vue';
import { usePostsStore } from '../../stores/posts';
import api from '../../services/api';

const route = useRoute();
const router = useRouter();
const postsStore = usePostsStore();

const isEdit = computed(() => !!route.params.id);
const form = reactive({
  title: '',
  content: '',
  excerpt: '',
  coverImage: '',
  status: 'draft',
});

const availableTags = ref<any[]>([]);
const selectedTags = ref<any[]>([]);
const error = ref('');
const loading = ref(false);

async function loadTags() {
  try {
    const response = await api.get('/tags');
    availableTags.value = response;
  } catch (err) {
    console.error('Failed to load tags:', err);
  }
}

async function loadPost() {
  if (!isEdit.value) return;

  try {
    const response = await api.get(`/posts/admin/all`);
    const foundPost = response.posts.find((p: any) => p.id === Number(route.params.id));
    if (foundPost) {
      form.title = foundPost.title;
      form.content = foundPost.content;
      form.excerpt = foundPost.excerpt || '';
      form.coverImage = foundPost.coverImage || '';
      form.status = foundPost.status;
      selectedTags.value = foundPost.tags || [];
    }
  } catch (err) {
    error.value = 'Failed to load post.';
    console.error(err);
  }
}

function handleContentChange(value: string) {
  form.content = value;
}

function addTag(event: Event) {
  const target = event.target as HTMLSelectElement;
  const tagId = Number(target.value);
  if (!tagId) return;

  const tag = availableTags.value.find((t) => t.id === tagId);
  if (tag && !isTagSelected(tagId)) {
    selectedTags.value.push(tag);
  }
  target.value = '';
}

function removeTag(tagId: number) {
  selectedTags.value = selectedTags.value.filter((t) => t.id !== tagId);
}

function isTagSelected(tagId: number): boolean {
  return selectedTags.value.some((t) => t.id === tagId);
}

async function handleSubmit() {
  error.value = '';
  loading.value = true;

  try {
    const data = {
      ...form,
      tagIds: selectedTags.value.map((t) => t.id),
    };

    if (isEdit.value) {
      await postsStore.updatePost(Number(route.params.id), data);
    } else {
      await postsStore.createPost(data);
    }

    router.push('/admin');
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to save post.';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadTags();
  loadPost();
});
</script>

<style>
.bytemd {
  height: 500px;
  border: none;
}
</style>

