<template>
  <div class="skeleton-loader" :class="[variant]" :style="customStyle"></div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: '16px' },
  variant: { type: String, default: 'text' },
  borderRadius: { type: String, default: null },
})

const customStyle = computed(() => ({
  width: props.width,
  height: props.variant === 'card' ? '120px' : props.variant === 'avatar' ? '40px' : props.height,
  borderRadius: props.borderRadius || (props.variant === 'avatar' ? '50%' : props.variant === 'card' ? '14px' : '6px'),
}))
</script>

<style lang="scss" scoped>
.skeleton-loader {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.04) 0%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.04) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
</style>
