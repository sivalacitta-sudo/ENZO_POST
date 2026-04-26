<template>
  <MainLayout>
    <div class="max-w-4xl mx-auto px-6 py-12">
      <h1 class="text-4xl font-semibold tracking-tight-heading mb-2">Tag: {{ tagName }}</h1>
      <p class="text-gray-500 mb-8">{{ posts.length }} post(s)</p>

      <div v-if="loading" class="text-center py-12 text-gray-500">Loading...</div>

      <div v-else-if="posts.length === 0" class="text-center py-12 text-gray-500">
        No posts with this tag.
      </div>

      <div v-else class="space-y-6">
        <MintCard v-for="post in posts" :key="post.id" class="hover:border-medium cursor-pointer" @click="goToPost(post.slug)">
          <h2 class="text-xl font-semibold tracking-tight-subheading mb-2 hover:text-brand-green transition-colors">
            {{ post.title }}
          </h2>
          <p class="text-gray-700 mb-4 line-clamp-2">{{ post.excerpt || post.content.substring(0, 150) }}...</p>
          <div class="flex items-center justify-between text-sm text-gray-500">
            <span>{{ formatDate(post.createdAt) }}</span>
            <span>{{ post.viewCount }} views</span>
          </div>
        </MintCard>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';
import MintCard from '../components/MintCard.vue';
import { usePostsStore } from '../stores/posts';

const route = useRoute();
const router = useRouter();
const postsStore = usePostsStore();

const posts = ref<any[]>([]);
const tagName = ref('');
const loading = ref(true);

async function loadData() {
  loading.value = true;
  try {
    const response = await postsStore.fetchPosts(1, 100, route.params.slug as string);
    posts.value = response.posts;
    // Get tag name from the first post's tags
    if (posts.value.length > 0 && posts.value[0].tags) {
      const tag = posts.value[0].tags.find((t: any) => t.slug === route.params.slug);
      if (tag) tagName.value = tag.name;
    }
  } catch (error) {
    console.error('Failed to load posts:', error);
  } finally {
    loading.value = false;
  }
}

function goToPost(slug: string) {
  router.push(`/post/${slug}`);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

onMounted(() => {
  loadData();
});
</script>
