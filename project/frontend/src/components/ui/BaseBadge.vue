<template>
  <span class="base-badge" :class="[variant, size]">
    <span v-if="dot" class="badge-dot" :class="variant"></span>
    <slot />
  </span>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'default' },
  size: { type: String, default: 'md' },
  dot: { type: Boolean, default: false },
})
</script>

<style lang="scss" scoped>
.base-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: $font-xs;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: $radius-full;
  letter-spacing: 0.02em;

  &.sm {
    font-size: 10px;
    padding: 2px 8px;
  }

  &.default {
    background: rgba(139, 149, 168, 0.15);
    color: $text-secondary;
  }

  &.success {
    background: rgba(46, 213, 115, 0.12);
    color: $accent-green;
  }

  &.danger {
    background: rgba(255, 71, 87, 0.12);
    color: $accent-red;
  }

  &.warning {
    background: rgba(255, 165, 2, 0.12);
    color: $accent-yellow;
  }

  &.info {
    background: rgba(0, 212, 255, 0.12);
    color: $accent-blue;
  }

  &.purple {
    background: rgba(168, 85, 247, 0.12);
    color: $accent-purple;
  }
}

.badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;

  &.success { background: $accent-green; box-shadow: 0 0 6px rgba(46, 213, 115, 0.5); }
  &.danger { background: $accent-red; box-shadow: 0 0 6px rgba(255, 71, 87, 0.5); }
  &.warning { background: $accent-yellow; box-shadow: 0 0 6px rgba(255, 165, 2, 0.5); }
  &.info { background: $accent-blue; box-shadow: 0 0 6px rgba(0, 212, 255, 0.5); }
}
</style>
