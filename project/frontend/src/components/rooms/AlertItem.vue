<template>
  <div class="alert-item" :class="[alertTypeClass, { unread: !alert.is_read }]">
    <div class="alert-icon">
      <svg v-if="alert.type.includes('TEMPERATURE')" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/></svg>
      <svg v-else-if="alert.type.includes('HUMIDITY')" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22a7 7 0 007-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 007 7z"/></svg>
      <svg v-else-if="alert.type.includes('MOTION')" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
      <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    </div>
    
    <div class="alert-content">
      <div class="alert-header">
        <span class="alert-title">{{ t(`alerts.types.${alert.type}`) || alert.type }}</span>
        <span class="alert-time">{{ formattedTime }}</span>
      </div>
      <p class="alert-message">{{ alert.message }}</p>
    </div>
    
    <div class="alert-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  alert: { type: Object, required: true },
})

const { t } = useI18n()

const formattedTime = computed(() => {
  if (!props.alert.created_at) return ''
  const date = new Date(props.alert.created_at)
  return new Intl.DateTimeFormat('default', {
    hour: '2-digit', minute: '2-digit',
    day: '2-digit', month: 'short'
  }).format(date)
})

const alertTypeClass = computed(() => {
  const type = props.alert.type || ''
  if (type.includes('HIGH') || type.includes('MOTION')) return 'danger'
  if (type.includes('LOW')) return 'warning'
  return 'info'
})
</script>

<style lang="scss" scoped>
.alert-item {
  display: flex;
  gap: $space-4;
  padding: $space-4;
  background: rgba(255, 255, 255, 0.02);
  border-radius: $radius-md;
  border-left: 3px solid transparent;
  transition: all $transition-fast;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
  }

  &.unread {
    background: rgba(255, 255, 255, 0.05);
  }

  &.danger {
    border-left-color: $accent-red;
    .alert-icon { color: $accent-red; background: rgba(255, 71, 87, 0.1); }
  }

  &.warning {
    border-left-color: $accent-yellow;
    .alert-icon { color: $accent-yellow; background: rgba(255, 165, 2, 0.1); }
  }

  &.info {
    border-left-color: $accent-blue;
    .alert-icon { color: $accent-blue; background: rgba(0, 212, 255, 0.1); }
  }
}

.alert-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.alert-content {
  flex: 1;
  min-width: 0;
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: $space-1;
}

.alert-title {
  font-size: $font-sm;
  font-weight: 600;
  color: $text-primary;
}

.alert-time {
  font-size: 11px;
  color: $text-muted;
}

.alert-message {
  font-size: $font-sm;
  color: $text-secondary;
  margin: 0;
}

.alert-actions {
  display: flex;
  align-items: center;
}
</style>
