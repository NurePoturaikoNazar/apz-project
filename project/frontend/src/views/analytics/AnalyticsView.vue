<template>
  <div class="analytics-view fade-in">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ t('nav.analytics') }}</h1>
        <p class="page-subtitle">Cross-system telemetry analysis</p>
      </div>
    </div>

    <div class="empty-state mt-8">
      <div class="empty-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12a2 2 0 100 4 2 2 0 000-4z"/></svg>
      </div>
      <h3>Analytics Dashboard</h3>
      <p>Select a room to view detailed analytics and historical data.</p>
      <BaseButton variant="primary" class="mt-4" @click="$router.push('/rooms')">
        {{ t('nav.rooms') }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/ui/BaseButton.vue'

const { t } = useI18n()
</script>

<style lang="scss" scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.page-title {
  font-size: $font-3xl;
  margin-bottom: $space-1;
}

.page-subtitle {
  color: $text-muted;
  font-size: $font-lg;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $space-12 $space-6;
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: $radius-lg;
  text-align: center;
  color: $text-muted;
  
  .empty-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: $space-4;
  }
}

.mt-4 { margin-top: $space-4; }
.mt-8 { margin-top: $space-8; }
</style>
