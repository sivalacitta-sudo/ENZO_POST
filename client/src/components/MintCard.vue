<template>
  <div
    :class="[
      'bg-white border-subtle transition-colors',
      size === 'lg' ? 'rounded-card-lg p-8' : 'rounded-card p-6',
      className,
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  size?: 'default' | 'lg';
  className?: string;
}>();
</script>
