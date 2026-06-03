<template>
  <button
    class="base-button"
    :class="[variant, size, { 'is-loading': loading, 'full-width': fullWidth }]"
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <span v-if="loading" class="spinner"></span>
    <span class="btn-content" :class="{ invisible: loading }">
      <slot />
    </span>
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  fullWidth: { type: Boolean, default: false },
})

defineEmits(['click'])
</script>

<style lang="scss" scoped>
.base-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $space-2;
  font-family: $font-family;
  font-weight: 600;
  border: 1px solid transparent;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all $transition-base;
  white-space: nowrap;
  text-decoration: none;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.full-width {
    width: 100%;
  }

  // Sizes
  &.sm {
    font-size: $font-xs;
    padding: $space-2 $space-3;
    border-radius: $radius-sm;
  }

  &.md {
    font-size: $font-sm;
    padding: $space-3 $space-5;
  }

  &.lg {
    font-size: $font-base;
    padding: $space-4 $space-8;
  }

  // Variants
  &.primary {
    background: $gradient-blue;
    color: #fff;
    box-shadow: 0 2px 12px rgba(0, 212, 255, 0.25);

    &:hover:not(:disabled) {
      box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4);
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  }

  &.ghost {
    background: rgba(255, 255, 255, 0.04);
    color: $text-primary;
    border-color: $border-color;

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.08);
      border-color: $border-active;
      color: $accent-blue;
    }
  }

  &.danger {
    background: $gradient-danger;
    color: #fff;
    box-shadow: 0 2px 12px rgba(255, 71, 87, 0.25);

    &:hover:not(:disabled) {
      box-shadow: 0 4px 20px rgba(255, 71, 87, 0.4);
      transform: translateY(-1px);
    }
  }

  &.icon {
    background: transparent;
    color: $text-secondary;
    padding: $space-2;
    border-radius: $radius-sm;

    &:hover:not(:disabled) {
      color: $accent-blue;
      background: rgba(0, 212, 255, 0.1);
    }
  }
}

.spinner {
  position: absolute;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.btn-content {
  display: inline-flex;
  align-items: center;
  gap: $space-2;

  &.invisible {
    visibility: hidden;
  }
}
</style>
