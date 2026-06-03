<template>
  <div class="dashboard-view fade-in">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ t('dashboard.title') }}</h1>
        <p class="page-subtitle">{{ t('dashboard.subtitle') }}</p>
      </div>
      <div class="header-actions">
        <!-- Add new room shortcut if admin -->
        <BaseButton v-if="authStore.isAdmin" variant="primary" @click="$router.push('/admin/system')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          {{ t('rooms.addRoom') }}
        </BaseButton>
      </div>
    </div>

    <!-- Overview Stats -->
    <div class="stats-grid stagger-1">
      <BaseCard class="stat-card accent">
        <div class="stat-icon purple">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">{{ t('dashboard.totalRooms') }}</span>
          <span class="stat-value">{{ rooms.length }}</span>
        </div>
      </BaseCard>

      <BaseCard class="stat-card">
        <div class="stat-icon blue">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">{{ t('dashboard.totalDevices') }}</span>
          <span class="stat-value">{{ totalDevices }}</span>
        </div>
      </BaseCard>

      <BaseCard class="stat-card">
        <div class="stat-icon cyan">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">{{ t('dashboard.onlineDevices') }}</span>
          <span class="stat-value">{{ onlineDevices }}</span>
        </div>
      </BaseCard>

      <BaseCard class="stat-card" :class="{ danger: activeAlerts > 0 }" :glowing="activeAlerts > 0">
        <div class="stat-icon" :class="activeAlerts > 0 ? 'red' : 'green'">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">{{ t('dashboard.activeAlerts') }}</span>
          <span class="stat-value">{{ activeAlerts }}</span>
        </div>
      </BaseCard>
    </div>

    <!-- Rooms Grid -->
    <div class="section-header stagger-2">
      <h2>{{ t('rooms.title') }}</h2>
      <BaseButton variant="ghost" size="sm" @click="$router.push('/rooms')">
        View All
      </BaseButton>
    </div>

    <div v-if="loading" class="rooms-grid stagger-3">
      <SkeletonLoader v-for="i in 4" :key="i" variant="card" />
    </div>

    <div v-else-if="rooms.length === 0" class="empty-state stagger-3">
      <div class="empty-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
      </div>
      <h3>{{ t('dashboard.noRooms') }}</h3>
      <p>{{ t('dashboard.noRoomsHint') }}</p>
      <BaseButton v-if="authStore.isAdmin" variant="primary" class="mt-4" @click="$router.push('/admin/system')">
        {{ t('rooms.addRoom') }}
      </BaseButton>
    </div>

    <div v-else class="rooms-grid stagger-3">
      <RoomCard 
        v-for="room in rooms" 
        :key="room.id" 
        :room="room" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { roomsApi } from '@/api/rooms'
import { alertsApi } from '@/api/alerts'

import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import RoomCard from '@/components/rooms/RoomCard.vue'

const { t } = useI18n()
const authStore = useAuthStore()
const uiStore = useUiStore()

const loading = ref(true)
const rooms = ref([])
const activeAlerts = ref(0)

const totalDevices = computed(() => {
  return rooms.value.reduce((total, room) => total + (room.devices?.length || 0), 0)
})

const onlineDevices = computed(() => {
  return rooms.value.reduce((total, room) => {
    return total + (room.devices?.filter(d => d.is_active)?.length || 0)
  }, 0)
})

async function fetchData() {
  try {
    const [roomsRes, alertsRes] = await Promise.all([
      roomsApi.getAll(),
      alertsApi.getUnreadCount()
    ])
    
    rooms.value = roomsRes.data
    activeAlerts.value = alertsRes.data?.count || 0
  } catch (error) {
    uiStore.error('Failed to load dashboard data')
    console.error(error)
  } finally {
    loading.value = false
  }
}

let pollInterval
onMounted(() => {
  fetchData()
  // Poll every 15 seconds for dashboard updates
  pollInterval = setInterval(fetchData, 15000)
})

onUnmounted(() => {
  clearInterval(pollInterval)
})
</script>

<style lang="scss" scoped>
.dashboard-view {
  display: flex;
  flex-direction: column;
  gap: $space-8;
}

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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: $space-6;
}

.stat-card {
  :deep(.card-body) {
    display: flex;
    align-items: center;
    gap: $space-4;
    padding: $space-5 $space-6;
  }
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: $radius-lg;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  
  &.purple { color: $accent-purple; background: rgba(168, 85, 247, 0.1); }
  &.blue { color: $accent-blue; background: rgba(0, 212, 255, 0.1); }
  &.cyan { color: $accent-cyan; background: rgba(0, 255, 200, 0.1); }
  &.red { color: $accent-red; background: rgba(255, 71, 87, 0.1); }
  &.green { color: $accent-green; background: rgba(46, 213, 115, 0.1); }
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: $font-sm;
  color: $text-muted;
  font-weight: 500;
}

.stat-value {
  font-size: $font-3xl;
  font-weight: 700;
  line-height: 1.2;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: -$space-4;
  
  h2 {
    font-size: $font-xl;
  }
}

.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $space-6;
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
  
  .empty-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    color: $text-muted;
    margin-bottom: $space-4;
  }
  
  h3 {
    font-size: $font-xl;
    margin-bottom: $space-2;
  }
  
  p {
    color: $text-muted;
  }
}

.mt-4 { margin-top: $space-4; }
</style>
