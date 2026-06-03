<template>
  <div class="app-layout">
    <AppSidebar />
    
    <div class="main-content" :class="{ 'sidebar-collapsed': uiStore.sidebarCollapsed }">
      <AppHeader />
      
      <main class="page-container">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- Global UI Elements -->
    <BaseToast />
  </div>
</template>

<script setup>
import { useUiStore } from '@/stores/ui'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import BaseToast from '../ui/BaseToast.vue'

const uiStore = useUiStore()
</script>

<style lang="scss" scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: $bg-primary;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-left: $sidebar-width;
  transition: margin-left $transition-base;

  &.sidebar-collapsed {
    margin-left: $sidebar-collapsed;
  }

  @media (max-width: $bp-md) {
    margin-left: 0 !important;
  }
}

.page-container {
  flex: 1;
  padding: $space-6;
  position: relative;
  
  @media (max-width: $bp-md) {
    padding: $space-4;
  }
}

// Global page transitions
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
