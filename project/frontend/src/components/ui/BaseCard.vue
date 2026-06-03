<template>
  <div class="base-card" :class="[variant, { clickable, 'glow-pulse': glowing }]" @click="clickable && $emit('click')">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    <div class="card-body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'default' },
  clickable: { type: Boolean, default: false },
  glowing: { type: Boolean, default: false },
})

defineEmits(['click'])
</script>

<style lang="scss" scoped>
.base-card {
  background: $bg-card;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid $bg-glass-border;
  border-radius: $radius-lg;
  overflow: hidden;
  transition: all $transition-base;

  &.clickable {
    cursor: pointer;

    &:hover {
      background: $bg-card-hover;
      border-color: $border-active;
      box-shadow: $shadow-glow-blue;
      transform: translateY(-2px);
    }
  }

  &.glow-pulse {
    animation: glowPulse 2s ease-in-out infinite;
  }

  &.danger {
    border-color: rgba(255, 71, 87, 0.2);

    &:hover {
      border-color: rgba(255, 71, 87, 0.4);
      box-shadow: $shadow-glow-red;
    }
  }

  &.accent {
    border-color: $border-active;
    background: linear-gradient(135deg, rgba(0, 212, 255, 0.05), rgba(0, 255, 200, 0.02));
  }
}

.card-header {
  padding: $space-4 $space-6;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-body {
  padding: $space-6;
}

.card-footer {
  padding: $space-4 $space-6;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}
</style>
