<template>
  <button
    :class="[
      'inline-flex items-center justify-center font-medium transition-opacity',
      variant === 'primary' ? 'bg-near-black text-white px-6 py-2 rounded-pill hover:opacity-90' : '',
      variant === 'secondary' ? 'bg-white text-near-black px-3 py-1.5 rounded-pill border border-medium hover:opacity-90' : '',
      variant === 'ghost' ? 'bg-transparent text-near-black px-1.5 py-1.5 rounded-md hover:text-brand-green' : '',
      size === 'sm' ? 'text-sm' : '',
      size === 'md' ? 'text-[15px]' : '',
      disabled ? 'opacity-50 cursor-not-allowed' : '',
      className,
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
}>();

defineEmits(['click']);
</script>
