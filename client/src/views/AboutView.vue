<template>
  <MainLayout>
    <div class="max-w-3xl mx-auto px-6 py-12">
      <h1 class="text-4xl font-semibold tracking-tight-heading mb-8">About</h1>
      <MintCard size="lg">
        <div class="prose max-w-none">
          <p class="text-gray-700 leading-relaxed mb-4">
            Welcome to my personal blog! This is a space where I share my thoughts, experiences, and learnings.
          </p>
          <p class="text-gray-700 leading-relaxed mb-4">
            Built with Vue3, NestJS, and TypeORM, this blog CMS features a clean, minimal design inspired by Mintlify's design system.
          </p>
          <p class="text-gray-700 leading-relaxed">
            Feel free to browse the articles, leave comments, and get in touch if you have any questions or suggestions.
          </p>
        </div>
      </MintCard>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '../layouts/MainLayout.vue';
import MintCard from '../components/MintCard.vue';
</script>
