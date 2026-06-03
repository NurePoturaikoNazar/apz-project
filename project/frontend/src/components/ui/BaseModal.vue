<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="closable && $emit('update:modelValue', false)">
        <div class="modal-content" :class="[size]">
          <div class="modal-header">
            <h3>{{ title }}</h3>
            <button v-if="closable" class="modal-close" @click="$emit('update:modelValue', false)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: '' },
  size: { type: String, default: 'md' },
  closable: { type: Boolean, default: true },
})

defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  padding: $space-4;
}

.modal-content {
  background: $bg-secondary;
  border: 1px solid $bg-glass-border;
  border-radius: $radius-xl;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: $shadow-lg;
  transition: all 0.3s ease;

  &.sm { width: 400px; max-width: 95vw; }
  &.md { width: 520px; max-width: 95vw; }
  &.lg { width: 700px; max-width: 95vw; }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-6 $space-6 $space-4;

  h3 {
    font-size: $font-lg;
    font-weight: 600;
    color: $text-primary;
  }
}

.modal-close {
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: $text-secondary;
  cursor: pointer;
  padding: $space-2;
  border-radius: $radius-sm;
  transition: all $transition-fast;
  display: flex;

  &:hover {
    background: rgba(255, 71, 87, 0.15);
    color: $accent-red;
  }
}

.modal-body {
  padding: $space-4 $space-6;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: $space-3;
  padding: $space-4 $space-6 $space-6;
}
</style>
