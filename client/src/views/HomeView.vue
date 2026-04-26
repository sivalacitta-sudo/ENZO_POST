<template>
  <MainLayout>
    <div class="max-w-6xl mx-auto px-6 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Main content - Posts list -->
        <div class="lg:col-span-3">
          <h1 class="text-4xl font-semibold tracking-tight-heading mb-8">Latest Posts</h1>

          <div v-if="loading" class="text-center py-12 text-gray-500">Loading...</div>

          <div v-else-if="posts.length === 0" class="text-center py-12 text-gray-500">
            No posts yet.
          </div>

          <div v-else class="space-y-6">
            <MintCard v-for="post in posts" :key="post.id" class="hover:border-medium cursor-pointer" @click="goToPost(post.slug)">
              <h2 class="text-xl font-semibold tracking-tight-subheading mb-2 hover:text-brand-green transition-colors">
                {{ post.title }}
              </h2>
              <p class="text-gray-700 mb-4 line-clamp-2">{{ post.excerpt || post.content.substring(0, 150) }}...</p>
              <div class="flex items-center justify-between text-sm text-gray-500">
                <span>{{ formatDate(post.createdAt) }}</span>
                <div class="flex items-center gap-2">
                  <span v-for="tag in post.tags" :key="tag.id" class="px-2 py-1 bg-gray-100 rounded-md text-xs">
                    {{ tag.name }}
                  </span>
                </div>
              </div>
            </MintCard>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-8">
            <MintButton variant="secondary" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
              Previous
            </MintButton>
            <span class="px-4 py-2 text-sm">Page {{ currentPage }} of {{ totalPages }}</span>
            <MintButton variant="secondary" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
              Next
            </MintButton>
          </div>
        </div>

        <!-- Sidebar - Tags -->
        <aside class="lg:col-span-1">
          <MintCard>
            <h3 class="text-sm font-medium uppercase tracking-[0.65px] text-gray-500 mb-4">Tags</h3>
            <div v-if="tags.length === 0" class="text-sm text-gray-500">No tags yet.</div>
            <div v-else class="flex flex-wrap gap-2">
              <router-link
                v-for="tag in tags"
                :key="tag.id"
                :to="`/tag/${tag.slug}`"
                class="px-3 py-1.5 bg-gray-100 rounded-pill text-sm hover:bg-brand-green/20 transition-colors"
              >
                {{ tag.name }}
              </router-link>
            </div>
          </MintCard>
        </aside>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';
import MintCard from '../components/MintCard.vue';
import MintButton from '../components/MintButton.vue';
import { usePostsStore } from '../stores/posts';

const router = useRouter();
const postsStore = usePostsStore();

const posts = ref<any[]>([]);
const tags = ref<any[]>([]);
const loading = ref(true);
const currentPage = ref(1);
const totalItems = ref(0);
const limit = ref(10);

const totalPages = computed(() => Math.ceil(totalItems.value / limit.value));

async function loadData() {
  loading.value = true;
  try {
    const response = await postsStore.fetchPosts(currentPage.value, limit.value);
    posts.value = response.posts;
    totalItems.value = response.total;
  } catch (error) {
    console.error('Failed to load posts:', error);
  } finally {
    loading.value = false;
  }
}

async function loadTags() {
  try {
    const response = await postsStore.fetchTags();
    tags.value = response;
  } catch (error) {
    console.error('Failed to load tags:', error);
  }
}

function goToPost(slug: string) {
  router.push(`/post/${slug}`);
}

function changePage(page: number) {
  currentPage.value = page;
  loadData();
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

onMounted(() => {
  loadData();
  loadTags();
});
</script>
