<template>
  <div class="snapshot-card">
    <div class="snapshot-image" :style="{ backgroundImage: `url(${snapshot.image_url || snapshot.imageUrl})` }">
      <div v-if="!snapshot.image_url && !snapshot.imageUrl" class="no-image">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      </div>
      
      <div class="snapshot-overlay">
        <BaseButton v-if="snapshot.image_url || snapshot.imageUrl" variant="icon" @click="$emit('view', snapshot)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
        </BaseButton>
      </div>
    </div>
    
    <div class="snapshot-info">
      <div class="info-row">
        <span class="reason-badge">
          {{ snapshot.reason === 'motion_detected' ? t('alerts.types.MOTION_DETECTED') : snapshot.reason }}
        </span>
        <span class="time">{{ formattedTime }}</span>
      </div>
      <div class="device-name">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
        {{ snapshot.device?.name || 'Camera' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '../ui/BaseButton.vue'

const props = defineProps({
  snapshot: { type: Object, required: true },
})

defineEmits(['view'])

const { t } = useI18n()

const formattedTime = computed(() => {
  if (!props.snapshot.created_at) return ''
  const date = new Date(props.snapshot.created_at)
  return new Intl.DateTimeFormat('default', {
    hour: '2-digit', minute: '2-digit',
    day: '2-digit', month: 'short', year: 'numeric'
  }).format(date)
})
</script>

<style lang="scss" scoped>
.snapshot-card {
  background: $bg-secondary;
  border: 1px solid $bg-glass-border;
  border-radius: $radius-lg;
  overflow: hidden;
  transition: all $transition-base;

  &:hover {
    border-color: $border-active;
    transform: translateY(-2px);
    box-shadow: $shadow-md;
    
    .snapshot-overlay {
      opacity: 1;
    }
  }
}

.snapshot-image {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  background-size: cover;
  background-position: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.no-image {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $text-muted;
}

.snapshot-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity $transition-fast;
  
  :deep(.base-button) {
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    
    &:hover {
      background: $accent-blue;
    }
  }
}

.snapshot-info {
  padding: $space-3 $space-4;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $space-2;
}

.reason-badge {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  color: $accent-red;
  background: rgba(255, 71, 87, 0.1);
  padding: 2px 6px;
  border-radius: $radius-sm;
}

.time {
  font-size: 11px;
  color: $text-muted;
}

.device-name {
  display: flex;
  align-items: center;
  gap: $space-2;
  font-size: $font-sm;
  color: $text-secondary;
}
</style>
