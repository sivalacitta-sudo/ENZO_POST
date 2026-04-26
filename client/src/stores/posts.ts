import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/api';

export const usePostsStore = defineStore('posts', () => {
  const posts = ref<any[]>([]);
  const currentPost = ref<any>(null);
  const tags = ref<any[]>([]);

  async function fetchPosts(page = 1, limit = 10, tag?: string) {
    const params: any = { page, limit };
    if (tag) params.tag = tag;
    const response = await api.get('/posts', { params });
    posts.value = response.posts;
    return response;
  }

  async function fetchPostBySlug(slug: string) {
    const response = await api.get(`/posts/${slug}`);
    currentPost.value = response;
    return response;
  }

  async function fetchTags() {
    const response = await api.get('/tags');
    tags.value = response;
    return response;
  }

  async function createPost(data: any) {
    return api.post('/posts', data);
  }

  async function updatePost(id: number, data: any) {
    return api.patch(`/posts/${id}`, data);
  }

  async function deletePost(id: number) {
    return api.delete(`/posts/${id}`);
  }

  async function fetchAdminPosts(page = 1, limit = 10) {
    const response = await api.get('/posts/admin/all', { params: { page, limit } });
    posts.value = response.posts;
    return response;
  }

  return {
    posts,
    currentPost,
    tags,
    fetchPosts,
    fetchPostBySlug,
    fetchTags,
    createPost,
    updatePost,
    deletePost,
    fetchAdminPosts,
  };
});
