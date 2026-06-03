<template>
  <Teleport to="body">
    <TransitionGroup name="toast" tag="div" class="toast-container">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast-item"
        :class="toast.type"
        @click="uiStore.removeToast(toast.id)"
      >
        <div class="toast-icon">
          <svg v-if="toast.type === 'success'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          <svg v-else-if="toast.type === 'error'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
          <svg v-else-if="toast.type === 'warning'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
        </div>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()
const toasts = computed(() => uiStore.toasts)
</script>

<style lang="scss" scoped>
.toast-container {
  position: fixed;
  top: $space-6;
  right: $space-6;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: $space-3;
  max-width: 400px;
}

.toast-item {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-4 $space-5;
  border-radius: $radius-md;
  background: $bg-secondary;
  border: 1px solid $bg-glass-border;
  backdrop-filter: blur(20px);
  box-shadow: $shadow-lg;
  cursor: pointer;
  transition: all $transition-fast;
  animation: slideInRight 0.4s ease-out;

  &:hover {
    transform: translateX(-4px);
  }

  &.success {
    border-left: 3px solid $accent-green;
    .toast-icon { color: $accent-green; }
  }

  &.error {
    border-left: 3px solid $accent-red;
    .toast-icon { color: $accent-red; }
  }

  &.warning {
    border-left: 3px solid $accent-yellow;
    .toast-icon { color: $accent-yellow; }
  }

  &.info {
    border-left: 3px solid $accent-blue;
    .toast-icon { color: $accent-blue; }
  }
}

.toast-icon {
  flex-shrink: 0;
  display: flex;
}

.toast-message {
  font-size: $font-sm;
  color: $text-primary;
  line-height: 1.4;
}

.toast-enter-active {
  animation: slideInRight 0.4s ease-out;
}

.toast-leave-active {
  animation: slideInRight 0.3s ease-in reverse;
}
</style>
