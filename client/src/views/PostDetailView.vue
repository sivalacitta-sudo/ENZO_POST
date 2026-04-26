<template>
  <MainLayout>
    <div class="max-w-4xl mx-auto px-6 py-12">
      <div v-if="loading" class="text-center py-12 text-gray-500">Loading...</div>

      <div v-else-if="post" class="markdown-content">
        <!-- Post header -->
        <header class="mb-8">
          <h1 class="text-[40px] font-semibold tracking-tight-heading mb-4">{{ post.title }}</h1>
          <div class="flex items-center gap-4 text-sm text-gray-500">
            <span>By {{ post.author?.username || 'Anonymous' }}</span>
            <span>{{ formatDate(post.createdAt) }}</span>
            <span>{{ post.viewCount }} views</span>
          </div>
          <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2 mt-4">
            <router-link
              v-for="tag in post.tags"
              :key="tag.id"
              :to="`/tag/${tag.slug}`"
              class="px-3 py-1.5 bg-gray-100 rounded-pill text-xs hover:bg-brand-green/20 transition-colors"
            >
              {{ tag.name }}
            </router-link>
          </div>
        </header>

        <!-- Cover image -->
        <img v-if="post.coverImage" :src="post.coverImage" :alt="post.title" class="w-full rounded-card mb-8" />

        <!-- Content -->
        <div v-html="renderedContent" class="mb-12"></div>

        <!-- Comments section -->
        <section class="border-t border-subtle pt-8">
          <h2 class="text-2xl font-medium tracking-tight-subheading mb-6">Comments ({{ comments.length }})</h2>

          <!-- Comment form -->
          <div v-if="authStore.isAuthenticated" class="mb-8">
            <textarea
              v-model="newComment"
              placeholder="Write a comment..."
              class="w-full p-4 border border-medium rounded-card resize-none focus:outline-none focus:ring-1 focus:ring-brand-green"
              rows="4"
            ></textarea>
            <MintButton variant="primary" class="mt-4" @click="submitComment">Post Comment</MintButton>
          </div>
          <div v-else class="mb-8 text-sm text-gray-500">
            <router-link to="/admin/login" class="text-brand-green hover:underline">Login</router-link> to leave a comment.
          </div>

          <!-- Comments list -->
          <div v-if="comments.length === 0" class="text-gray-500 text-sm">No comments yet.</div>
          <div v-else class="space-y-4">
            <div v-for="comment in comments" :key="comment.id" class="p-4 bg-gray-50 rounded-card">
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium text-sm">{{ comment.authorName }}</span>
                <span class="text-xs text-gray-500">{{ formatDate(comment.createdAt) }}</span>
              </div>
              <p class="text-sm text-gray-700">{{ comment.content }}</p>
            </div>
          </div>
        </section>
      </div>

      <div v-else class="text-center py-12 text-gray-500">Post not found.</div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';
import MainLayout from '../layouts/MainLayout.vue';
import MintButton from '../components/MintButton.vue';
import { usePostsStore } from '../stores/posts';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';

const route = useRoute();
const postsStore = usePostsStore();
const authStore = useAuthStore();

const post = ref<any>(null);
const comments = ref<any[]>([]);
const newComment = ref('');
const loading = ref(true);

const md = new MarkdownIt({ html: true, linkify: true });

const renderedContent = computed(() => {
  if (!post.value?.content) return '';
  const html = md.render(post.value.content);
  return DOMPurify.sanitize(html);
});

async function loadPost() {
  loading.value = true;
  try {
    const response = await postsStore.fetchPostBySlug(route.params.slug as string);
    post.value = response;
    comments.value = response.comments || [];
  } catch (error) {
    console.error('Failed to load post:', error);
  } finally {
    loading.value = false;
  }
}

async function submitComment() {
  if (!newComment.value.trim() || !post.value) return;

  try {
    const response = await api.post('/comments', {
      content: newComment.value,
      postId: post.value.id,
    });
    comments.value.push(response);
    newComment.value = '';
  } catch (error) {
    console.error('Failed to submit comment:', error);
    alert('Failed to submit comment. Please try again.');
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

onMounted(() => {
  loadPost();
});
</script>
