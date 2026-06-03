<template>
  <div class="events-view fade-in">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ t('events.title') }}</h1>
        <p class="page-subtitle">{{ t('events.subtitle') }}</p>
      </div>
      
      <div class="tabs">
        <button 
          class="tab-btn" 
          :class="{ active: currentTab === 'alerts' }"
          @click="currentTab = 'alerts'"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
          {{ t('events.tabAlerts') }}
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: currentTab === 'snapshots' }"
          @click="currentTab = 'snapshots'"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          {{ t('events.tabSnapshots') }}
        </button>
      </div>
    </div>

    <!-- Alerts Tab -->
    <div v-if="currentTab === 'alerts'" class="tab-content stagger-1">
      <div class="filter-bar">
        <div class="filter-chips">
          <button class="chip" :class="{ active: alertFilter === 'all' }" @click="alertFilter = 'all'">
            {{ t('alerts.all') }}
          </button>
          <button class="chip" :class="{ active: alertFilter === 'unread' }" @click="alertFilter = 'unread'">
            {{ t('alerts.unread') }}
          </button>
        </div>
      </div>
      
      <div v-if="loadingAlerts" class="list-layout">
        <SkeletonLoader v-for="i in 5" :key="i" variant="text" height="80px" />
      </div>
      
      <div v-else-if="filteredAlerts.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
        <p>{{ t('alerts.noAlerts') }}</p>
      </div>
      
      <div v-else class="list-layout">
        <AlertItem 
          v-for="alert in filteredAlerts" 
          :key="alert.id" 
          :alert="alert"
        >
          <template #actions>
            <BaseButton 
              v-if="!alert.is_read" 
              variant="ghost" 
              size="sm" 
              @click="markAlertRead(alert.id)"
            >
              {{ t('alerts.markRead') }}
            </BaseButton>
            <BaseButton 
              v-else 
              variant="ghost" 
              size="sm" 
              class="text-muted"
              @click="markAlertUnread(alert.id)"
            >
              {{ t('alerts.markUnread') }}
            </BaseButton>
          </template>
        </AlertItem>
      </div>
    </div>

    <!-- Snapshots Tab -->
    <div v-if="currentTab === 'snapshots'" class="tab-content stagger-1">
      <div v-if="loadingSnapshots" class="grid-layout">
        <SkeletonLoader v-for="i in 6" :key="i" variant="card" height="200px" />
      </div>
      
      <div v-else-if="snapshots.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        <p>{{ t('snapshots.noSnapshots') }}</p>
      </div>
      
      <div v-else class="grid-layout">
        <SnapshotCard 
          v-for="snapshot in snapshots" 
          :key="snapshot.id" 
          :snapshot="snapshot"
          @view="viewSnapshot"
        />
      </div>
    </div>

    <!-- Image Modal -->
    <BaseModal v-model="showImageModal" size="lg" :title="t('snapshots.gallery')">
      <div v-if="selectedSnapshot" class="modal-image-container">
        <img :src="selectedSnapshot.image_url || selectedSnapshot.imageUrl" alt="Snapshot" />
        <div class="modal-image-info">
          <p><strong>{{ t('snapshots.timestamp') }}:</strong> {{ formatTime(selectedSnapshot.created_at) }}</p>
          <p><strong>{{ t('snapshots.reason') }}:</strong> {{ selectedSnapshot.trigger_reason }}</p>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUiStore } from '@/stores/ui'
import { alertsApi } from '@/api/alerts'
import { snapshotsApi } from '@/api/snapshots'

import AlertItem from '@/components/rooms/AlertItem.vue'
import SnapshotCard from '@/components/rooms/SnapshotCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import BaseModal from '@/components/ui/BaseModal.vue'

const { t } = useI18n()
const uiStore = useUiStore()

const currentTab = ref('alerts')
const alertFilter = ref('all') // all, unread

const alerts = ref([])
const loadingAlerts = ref(true)

const snapshots = ref([])
const loadingSnapshots = ref(false)

const showImageModal = ref(false)
const selectedSnapshot = ref(null)

const filteredAlerts = computed(() => {
  let list = alerts.value || []
  if (alertFilter.value === 'unread') {
    list = list.filter(a => !a.is_read)
  }
  return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

async function fetchAlerts() {
  loadingAlerts.value = true
  try {
    const { data } = await alertsApi.getAll()
    alerts.value = data
  } catch (error) {
    uiStore.error('Failed to load alerts')
  } finally {
    loadingAlerts.value = false
  }
}

async function fetchSnapshots() {
  loadingSnapshots.value = true
  try {
    const { data } = await snapshotsApi.getAll()
    snapshots.value = data
  } catch (error) {
    uiStore.error('Failed to load snapshots')
  } finally {
    loadingSnapshots.value = false
  }
}

async function markAlertRead(id) {
  try {
    await alertsApi.markAsRead(id)
    const alert = alerts.value.find(a => a.id === id)
    if (alert) alert.is_read = true
  } catch (error) {
    uiStore.error('Failed to update alert')
  }
}

async function markAlertUnread(id) {
  try {
    await alertsApi.markAsUnread(id)
    const alert = alerts.value.find(a => a.id === id)
    if (alert) alert.is_read = false
  } catch (error) {
    uiStore.error('Failed to update alert')
  }
}

function viewSnapshot(snapshot) {
  selectedSnapshot.value = snapshot
  showImageModal.value = true
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  
  const currentLocale = uiStore.locale === 'ua' ? 'uk-UA' : 'en-US'
  const is12Hour = uiStore.locale === 'en'
  
  return new Intl.DateTimeFormat(currentLocale, {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    day: '2-digit', month: 'short', year: 'numeric',
    hour12: is12Hour
  }).format(new Date(dateStr))
}

onMounted(() => {
  fetchAlerts()
  fetchSnapshots()
})
</script>

<style lang="scss" scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: $space-6;
  
  @media (max-width: $bp-md) {
    flex-direction: column;
    align-items: flex-start;
    gap: $space-4;
  }
}

.page-title {
  font-size: $font-3xl;
  margin-bottom: $space-1;
}

.page-subtitle {
  color: $text-muted;
  font-size: $font-lg;
}

.tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.04);
  padding: 4px;
  border-radius: $radius-lg;
  border: 1px solid $border-color;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: $space-2;
  background: transparent;
  border: none;
  color: $text-muted;
  font-size: $font-sm;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all $transition-fast;

  &.active {
    background: rgba(255, 255, 255, 0.1);
    color: $text-primary;
    box-shadow: $shadow-sm;
  }

  &:hover:not(.active) {
    color: $text-secondary;
  }
}

.filter-bar {
  margin-bottom: $space-4;
}

.filter-chips {
  display: flex;
  gap: $space-2;
}

.chip {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid transparent;
  color: $text-secondary;
  font-size: $font-sm;
  padding: 4px 12px;
  border-radius: $radius-full;
  cursor: pointer;
  transition: all $transition-fast;

  &.active {
    background: rgba(0, 212, 255, 0.1);
    color: $accent-blue;
    border-color: rgba(0, 212, 255, 0.3);
  }

  &:hover:not(.active) {
    background: rgba(255, 255, 255, 0.1);
  }
}

.list-layout {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.grid-layout {
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
  color: $text-muted;
  
  svg {
    opacity: 0.5;
    margin-bottom: $space-4;
  }
}

.modal-image-container {
  display: flex;
  flex-direction: column;
  gap: $space-4;
  
  img {
    width: 100%;
    border-radius: $radius-md;
    border: 1px solid $border-color;
  }
}

.modal-image-info {
  padding: $space-4;
  background: rgba(255, 255, 255, 0.02);
  border-radius: $radius-md;
  
  p {
    margin-bottom: $space-2;
    &:last-child { margin-bottom: 0; }
  }
}
</style>
