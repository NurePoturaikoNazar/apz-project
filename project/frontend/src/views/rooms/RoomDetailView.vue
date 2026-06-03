<template>
  <div class="room-detail-view fade-in">
    <div v-if="loading" class="loading-state">
      <SkeletonLoader variant="card" height="100px" class="mb-6" />
      <div class="grid-2 mt-6">
        <SkeletonLoader variant="card" height="300px" />
        <SkeletonLoader variant="card" height="300px" />
      </div>
    </div>

    <div v-else-if="!room" class="error-state">
      <div class="empty-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <h3>Room not found</h3>
      <BaseButton variant="ghost" class="mt-4" @click="$router.push('/rooms')">
        {{ t('common.back') }}
      </BaseButton>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <BaseButton variant="icon" @click="$router.push('/rooms')">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </BaseButton>
          <div>
            <div class="title-row">
              <h1 class="page-title">{{ room.name }}</h1>
              <BaseBadge :variant="activeDevicesCount > 0 ? 'success' : 'warning'" dot>
                {{ activeDevicesCount }} / {{ room.devices?.length || 0 }} {{ t('devices.online') }}
              </BaseBadge>
            </div>
            <p class="page-subtitle">{{ t(`rooms.types.${room.type}`) || room.type }}</p>
          </div>
        </div>
      </div>

      <!-- Telemetry Charts -->
      <div class="section-header mt-8">
        <h2>{{ t('nav.analytics') }}</h2>
        <div class="period-selector">
          <button :class="{ active: period === 'hour' }" @click="setPeriod('hour')">{{ t('telemetry.period.hour') }}</button>
          <button :class="{ active: period === 'day' }" @click="setPeriod('day')">{{ t('telemetry.period.day') }}</button>
          <button :class="{ active: period === 'week' }" @click="setPeriod('week')">{{ t('telemetry.period.week') }}</button>
        </div>
      </div>

      <div class="charts-grid stagger-1">
        <BaseCard class="chart-container">
          <template #header>
            <div class="chart-header">
              <span class="chart-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-pink"><path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/></svg>
                {{ t('telemetry.temperature') }}
              </span>
              <span class="chart-current" v-if="latestTelemetry">{{ latestTelemetry.temperature }}°C</span>
            </div>
          </template>
          <TelemetryChart :data="telemetryData" type="temperature" :loading="telemetryLoading" />
        </BaseCard>

        <BaseCard class="chart-container">
          <template #header>
            <div class="chart-header">
              <span class="chart-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-blue"><path d="M12 22a7 7 0 007-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 007 7z"/></svg>
                {{ t('telemetry.humidity') }}
              </span>
              <span class="chart-current" v-if="latestTelemetry">{{ latestTelemetry.humidity }}%</span>
            </div>
          </template>
          <TelemetryChart :data="telemetryData" type="humidity" :loading="telemetryLoading" />
        </BaseCard>

        <BaseCard class="chart-container">
          <template #header>
            <div class="chart-header">
              <span class="chart-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-yellow"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                {{ t('telemetry.light') }}
              </span>
              <span class="chart-current" v-if="latestTelemetry">{{ latestTelemetry.lightLevel }} lx</span>
            </div>
          </template>
          <TelemetryChart :data="telemetryData" type="lightLevel" :loading="telemetryLoading" />
        </BaseCard>

        <BaseCard class="chart-container">
          <template #header>
            <div class="chart-header">
              <span class="chart-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-purple"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1v-5h3v3z"/><path d="M3 19a2 2 0 002 2h1v-5H3v3z"/></svg>
                {{ t('telemetry.sound') }}
              </span>
              <span class="chart-current" v-if="latestTelemetry">{{ latestTelemetry.soundLevel }} dB</span>
            </div>
          </template>
          <TelemetryChart :data="telemetryData" type="soundLevel" :loading="telemetryLoading" />
        </BaseCard>
      </div>

      <!-- Devices Grid -->
      <div class="section-header mt-8 stagger-2">
        <h2>{{ t('rooms.devices') }}</h2>
      </div>

      <div v-if="!room.devices || room.devices.length === 0" class="empty-state stagger-3">
        <p>{{ t('rooms.noDevices') }}</p>
      </div>
      
      <div v-else class="devices-grid stagger-3">
        <DeviceCard 
          v-for="device in room.devices" 
          :key="device.id" 
          :device="device" 
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUiStore } from '@/stores/ui'
import { roomsApi } from '@/api/rooms'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import TelemetryChart from '@/components/charts/TelemetryChart.vue'
import DeviceCard from '@/components/rooms/DeviceCard.vue'

const props = defineProps({
  id: { type: String, required: true }
})

const { t } = useI18n()
const uiStore = useUiStore()

const loading = ref(true)
const room = ref(null)

const telemetryLoading = ref(false)
const telemetryData = ref([])
const period = ref('hour') // hour, day, week

const activeDevicesCount = computed(() => {
  return room.value?.devices?.filter(d => d.is_active)?.length || 0
})

const latestTelemetry = computed(() => {
  if (!telemetryData.value || telemetryData.value.length === 0) return null
  return telemetryData.value[0] // Assuming backend sorts DESC
})

async function fetchRoom() {
  try {
    const { data } = await roomsApi.getById(props.id)
    room.value = data
  } catch (error) {
    uiStore.error('Failed to load room details')
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function fetchTelemetry() {
  telemetryLoading.value = true
  try {
    const limitMap = { hour: 60, day: 24 * 12, week: 7 * 24 * 4 } // Approx limit based on interval
    const { data } = await roomsApi.getTelemetry(props.id, { limit: limitMap[period.value] })
    telemetryData.value = data
  } catch (error) {
    console.error('Failed to load telemetry', error)
  } finally {
    telemetryLoading.value = false
  }
}

function setPeriod(p) {
  period.value = p
  fetchTelemetry()
}

let pollInterval
onMounted(async () => {
  await fetchRoom()
  if (room.value) {
    fetchTelemetry()
    pollInterval = setInterval(fetchTelemetry, 30000)
  }
})

onUnmounted(() => {
  clearInterval(pollInterval)
})

watch(() => props.id, async () => {
  loading.value = true
  await fetchRoom()
  if (room.value) {
    fetchTelemetry()
  }
})
</script>

<style lang="scss" scoped>
.room-detail-view {
  display: flex;
  flex-direction: column;
}

.page-header {
  margin-bottom: $space-6;
}

.header-left {
  display: flex;
  align-items: flex-start;
  gap: $space-4;
}

.title-row {
  display: flex;
  align-items: center;
  gap: $space-4;
  margin-bottom: $space-1;
}

.page-title {
  font-size: $font-3xl;
  margin: 0;
}

.page-subtitle {
  color: $text-muted;
  font-size: $font-lg;
  margin: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $space-4;
  
  h2 {
    font-size: $font-xl;
  }
}

.period-selector {
  display: flex;
  background: rgba(255, 255, 255, 0.04);
  padding: 4px;
  border-radius: $radius-md;
  border: 1px solid $border-color;

  button {
    background: transparent;
    border: none;
    color: $text-muted;
    font-size: $font-xs;
    font-weight: 600;
    padding: 6px 12px;
    border-radius: $radius-sm;
    cursor: pointer;
    transition: all $transition-fast;

    &.active {
      background: rgba(255, 255, 255, 0.1);
      color: $text-primary;
    }

    &:hover:not(.active) {
      color: $text-secondary;
    }
  }
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: $space-6;
  
  @media (max-width: $bp-lg) {
    grid-template-columns: 1fr;
  }
}

.chart-container {
  :deep(.card-header) {
    padding: $space-4 $space-5;
  }
  :deep(.card-body) {
    padding: $space-2 $space-4 $space-4;
  }
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.chart-title {
  display: flex;
  align-items: center;
  gap: $space-2;
  font-weight: 600;
  font-size: $font-sm;
}

.chart-current {
  font-size: $font-lg;
  font-weight: 700;
  font-family: $font-mono;
}

.text-pink { color: $accent-pink; }
.text-blue { color: $accent-blue; }
.text-yellow { color: $accent-yellow; }
.text-purple { color: $accent-purple; }

.devices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: $space-4;
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
}

.mt-4 { margin-top: $space-4; }
.mt-6 { margin-top: $space-6; }
.mt-8 { margin-top: $space-8; }
.mb-6 { margin-bottom: $space-6; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: $space-6; }
</style>
