<template>
  <div class="rooms-view fade-in">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ t('rooms.title') }}</h1>
        <p class="page-subtitle">{{ t('rooms.subtitle') }}</p>
      </div>
      <div class="header-actions">
        <BaseButton v-if="authStore.isAdmin" variant="primary" @click="$router.push('/admin/system')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          {{ t('rooms.addRoom') }}
        </BaseButton>
      </div>
    </div>

    <div v-if="loading" class="rooms-grid">
      <SkeletonLoader v-for="i in 6" :key="i" variant="card" />
    </div>

    <div v-else-if="rooms.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
      </div>
      <h3>{{ t('dashboard.noRooms') }}</h3>
      <BaseButton v-if="authStore.isAdmin" variant="primary" class="mt-4" @click="$router.push('/admin/system')">
        {{ t('rooms.addRoom') }}
      </BaseButton>
    </div>

    <div v-else class="rooms-grid stagger-1">
      <RoomCard 
        v-for="room in rooms" 
        :key="room.id" 
        :room="room" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { roomsApi } from '@/api/rooms'

import BaseButton from '@/components/ui/BaseButton.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import RoomCard from '@/components/rooms/RoomCard.vue'

const { t } = useI18n()
const authStore = useAuthStore()
const uiStore = useUiStore()

const loading = ref(true)
const rooms = ref([])

async function fetchRooms() {
  try {
    const { data } = await roomsApi.getAll()
    rooms.value = data
  } catch (error) {
    uiStore.error('Failed to load rooms')
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRooms()
})
</script>

<style lang="scss" scoped>
.rooms-view {
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
}

.mt-4 { margin-top: $space-4; }
</style>
