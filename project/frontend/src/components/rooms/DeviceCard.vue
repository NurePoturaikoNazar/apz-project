<template>
  <div class="device-card" :class="{ offline: !device.is_active }">
    <div class="device-header">
      <div class="device-icon">
        <svg v-if="device.type === 'temperature_sensor'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/></svg>
        <svg v-else-if="device.type === 'camera'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/></svg>
      </div>
      <div class="device-status">
        <BaseBadge :variant="device.is_active ? 'success' : 'danger'" size="sm" dot>
          {{ device.is_active ? t('devices.online') : t('devices.offline') }}
        </BaseBadge>
      </div>
    </div>
    
    <div class="device-body">
      <h4 class="device-name">{{ device.name }}</h4>
      <div class="device-meta">
        <span class="mono">{{ device.mac_address || device.macAddress }}</span>
      </div>
    </div>
    
    <div v-if="$slots.actions" class="device-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import BaseBadge from '../ui/BaseBadge.vue'

defineProps({
  device: { type: Object, required: true },
})

const { t } = useI18n()
</script>

<style lang="scss" scoped>
.device-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: $radius-md;
  padding: $space-4;
  transition: all $transition-base;
  display: flex;
  flex-direction: column;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.1);
  }

  &.offline {
    opacity: 0.7;
    
    .device-icon {
      color: $text-muted;
    }
  }
}

.device-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: $space-3;
}

.device-icon {
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: $radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $accent-blue;
}

.device-body {
  flex: 1;
}

.device-name {
  font-size: $font-sm;
  font-weight: 500;
  margin-bottom: $space-1;
  color: $text-primary;
}

.device-meta {
  font-size: 11px;
  color: $text-muted;
}

.device-actions {
  margin-top: $space-3;
  padding-top: $space-3;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: flex-end;
  gap: $space-2;
}
</style>
