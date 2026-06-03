<template>
  <BaseCard class="room-card" :clickable="true" @click="$router.push(`/rooms/${room.id}`)">
    <div class="room-icon" :class="room.type">
      <svg v-if="room.type === 'living_room'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      <svg v-else-if="room.type === 'bedroom'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 14h18v7H3v-7z"/><path d="M3 10V7a2 2 0 012-2h14a2 2 0 012 2v3"/><path d="M8 10V7"/><path d="M16 10V7"/></svg>
      <svg v-else-if="room.type === 'kitchen'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
      <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
    </div>
    
    <div class="room-info">
      <h3>{{ room.name }}</h3>
      <p class="text-muted">{{ t(`rooms.types.${room.type}`) || room.type }}</p>
    </div>

    <div class="room-stats">
      <div class="stat">
        <span class="stat-label">{{ t('dashboard.totalDevices') }}</span>
        <span class="stat-value">{{ devicesCount }}</span>
      </div>
      <div class="stat">
        <span class="stat-label">{{ t('dashboard.onlineDevices') }}</span>
        <span class="stat-value text-accent">{{ onlineDevicesCount }}</span>
      </div>
    </div>
    
    <div v-if="hasAlerts" class="room-alert">
      <span class="alert-pulse"></span>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseCard from '../ui/BaseCard.vue'

const props = defineProps({
  room: { type: Object, required: true },
})

const { t } = useI18n()

const devicesCount = computed(() => props.room.devices?.length || 0)
const onlineDevicesCount = computed(() => props.room.devices?.filter(d => d.is_active)?.length || 0)

// For demo purposes, we randomly simulate if room has alert based on devices
const hasAlerts = computed(() => {
   return props.room.devices?.some(d => !d.is_active) // Just as an example, offline device = alert
})
</script>

<style lang="scss" scoped>
.room-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: $space-4;
  height: 100%;
}

.room-icon {
  width: 48px;
  height: 48px;
  border-radius: $radius-lg;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  color: $text-secondary;
  transition: all $transition-base;

  .room-card:hover & {
    background: rgba(0, 212, 255, 0.1);
    color: $accent-blue;
    transform: scale(1.05);
  }
}

.room-info {
  flex: 1;

  h3 {
    font-size: $font-lg;
    margin-bottom: 2px;
  }

  p {
    font-size: $font-sm;
  }
}

.room-stats {
  display: flex;
  gap: $space-4;
  padding-top: $space-4;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.stat {
  display: flex;
  flex-direction: column;

  .stat-label {
    font-size: 10px;
    text-transform: uppercase;
    color: $text-muted;
    letter-spacing: 0.05em;
  }

  .stat-value {
    font-size: $font-lg;
    font-weight: 600;
  }
}

.room-alert {
  position: absolute;
  top: $space-4;
  right: $space-4;
}

.alert-pulse {
  display: block;
  width: 10px;
  height: 10px;
  background: $accent-red;
  border-radius: 50%;
  animation: glowPulseRed 2s infinite;
}
</style>
