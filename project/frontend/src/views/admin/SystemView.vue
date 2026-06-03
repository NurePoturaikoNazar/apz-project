<template>
  <div class="admin-system-view fade-in">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ t('system.title') }}</h1>
        <p class="page-subtitle">{{ t('system.subtitle') }}</p>
      </div>
    </div>

    <div class="system-grid">
      <!-- Rooms Management -->
      <BaseCard class="system-panel stagger-1">
        <template #header>
          <h2 class="panel-title">{{ t('system.roomManagement') }}</h2>
          <BaseButton variant="primary" size="sm" @click="openRoomModal()">
            {{ t('rooms.addRoom') }}
          </BaseButton>
        </template>
        
        <div v-if="loading" class="p-4">
          <SkeletonLoader variant="text" height="40px" class="mb-2" />
          <SkeletonLoader variant="text" height="40px" />
        </div>
        
        <div v-else-if="rooms.length === 0" class="empty-list">
          <p>{{ t('dashboard.noRooms') }}</p>
        </div>
        
        <div v-else class="list-group">
          <div v-for="room in rooms" :key="room.id" class="list-item" :class="{ selected: selectedRoom?.id === room.id }" @click="selectRoom(room)">
            <div class="item-info">
              <span class="item-title">{{ room.name }}</span>
              <span class="item-subtitle">{{ t(`rooms.types.${room.type}`) || room.type }}</span>
            </div>
            <div class="item-actions">
              <BaseBadge>{{ room.devices?.length || 0 }} dev</BaseBadge>
              <button class="icon-btn" @click.stop="openRoomModal(room)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="icon-btn text-danger" @click.stop="deleteRoom(room)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              </button>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Devices Management -->
      <BaseCard class="system-panel stagger-2">
        <template #header>
          <h2 class="panel-title">{{ t('system.deviceManagement') }}</h2>
          <BaseButton variant="primary" size="sm" :disabled="!selectedRoom" @click="openDeviceModal()">
            {{ t('devices.addDevice') }}
          </BaseButton>
        </template>
        
        <div v-if="!selectedRoom" class="empty-list">
          <p>Select a room to manage its devices</p>
        </div>
        
        <div v-else-if="!selectedRoom.devices || selectedRoom.devices.length === 0" class="empty-list">
          <p>{{ t('rooms.noDevices') }}</p>
        </div>
        
        <div v-else class="list-group">
          <div v-for="device in selectedRoom.devices" :key="device.id" class="list-item">
            <div class="item-info">
              <span class="item-title">{{ device.name }}</span>
              <span class="item-subtitle mono">{{ device.mac_address || device.macAddress }}</span>
            </div>
            <div class="item-actions">
              <BaseBadge :variant="device.is_active ? 'success' : 'danger'" dot></BaseBadge>
              <button class="icon-btn" @click="openDeviceModal(device)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="icon-btn text-danger" @click="deleteDevice(device)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              </button>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Room Modal -->
    <BaseModal v-model="showRoomModal" :title="roomForm.id ? t('rooms.editRoom') : t('rooms.addRoom')">
      <form @submit.prevent="saveRoom" class="form-layout">
        <div class="form-group">
          <label>{{ t('rooms.name') }}</label>
          <input v-model="roomForm.name" type="text" required />
        </div>
        <div class="form-group">
          <label>{{ t('rooms.type') }}</label>
          <select v-model="roomForm.type" required>
            <option value="living_room">{{ t('rooms.types.living_room') }}</option>
            <option value="bedroom">{{ t('rooms.types.bedroom') }}</option>
            <option value="kitchen">{{ t('rooms.types.kitchen') }}</option>
            <option value="bathroom">{{ t('rooms.types.bathroom') }}</option>
            <option value="office">{{ t('rooms.types.office') }}</option>
            <option value="garage">{{ t('rooms.types.garage') }}</option>
            <option value="other">{{ t('rooms.types.other') }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>{{ t('rooms.description') }}</label>
          <textarea v-model="roomForm.description" rows="3"></textarea>
        </div>
      </form>
      <template #footer>
        <BaseButton variant="ghost" @click="showRoomModal = false">{{ t('common.cancel') }}</BaseButton>
        <BaseButton variant="primary" :loading="saving" @click="saveRoom">{{ t('common.save') }}</BaseButton>
      </template>
    </BaseModal>

    <!-- Device Modal -->
    <BaseModal v-model="showDeviceModal" :title="deviceForm.id ? t('devices.editDevice') : t('devices.addDevice')">
      <form @submit.prevent="saveDevice" class="form-layout">
        <div class="form-group">
          <label>{{ t('devices.name') }}</label>
          <input v-model="deviceForm.name" type="text" required placeholder="Main Sensor" />
        </div>
        <div class="form-group">
          <label>{{ t('devices.macAddress') }}</label>
          <input v-model="deviceForm.macAddress" type="text" required placeholder="AA:BB:CC:DD:EE:FF" class="mono" />
        </div>
        <div class="form-group">
          <label>{{ t('devices.type') }}</label>
          <select v-model="deviceForm.type" required>
            <option value="temperature_sensor">Environment Sensor (ESP32)</option>
            <option value="camera">Camera Sensor</option>
            <option value="motion_sensor">Motion Sensor</option>
          </select>
        </div>
      </form>
      <template #footer>
        <BaseButton variant="ghost" @click="showDeviceModal = false">{{ t('common.cancel') }}</BaseButton>
        <BaseButton variant="primary" :loading="saving" @click="saveDevice">{{ t('common.save') }}</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUiStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import { roomsApi } from '@/api/rooms'
import { devicesApi } from '@/api/devices'

import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'

const { t } = useI18n()
const uiStore = useUiStore()
const authStore = useAuthStore()

const loading = ref(true)
const rooms = ref([])
const selectedRoom = ref(null)

const saving = ref(false)
const showRoomModal = ref(false)
const showDeviceModal = ref(false)

const roomForm = reactive({
  id: null,
  name: '',
  type: 'living_room',
  description: ''
})

const deviceForm = reactive({
  id: null,
  roomId: '',
  name: '',
  macAddress: '',
  type: 'temperature_sensor'
})

async function fetchRooms() {
  try {
    const { data } = await roomsApi.getAll()
    rooms.value = data
    if (selectedRoom.value) {
      selectedRoom.value = data.find(r => r.id === selectedRoom.value.id)
    }
  } catch (error) {
    uiStore.error('Failed to load system config')
  } finally {
    loading.value = false
  }
}

function selectRoom(room) {
  selectedRoom.value = room
}

// Room Actions
function openRoomModal(room = null) {
  if (room) {
    roomForm.id = room.id
    roomForm.name = room.name
    roomForm.type = room.type || 'living_room'
    roomForm.description = room.description || ''
  } else {
    roomForm.id = null
    roomForm.name = ''
    roomForm.type = 'living_room'
    roomForm.description = ''
  }
  showRoomModal.value = true
}

async function saveRoom() {
  if (!roomForm.name) return
  saving.value = true
  try {
    const payload = { ...roomForm }
    if (!payload.id) payload.userId = authStore.user?.id
    
    if (payload.id) {
      await roomsApi.update(payload.id, payload)
      uiStore.success('Room updated')
    } else {
      await roomsApi.create(payload)
      uiStore.success('Room created')
    }
    showRoomModal.value = false
    fetchRooms()
  } catch (error) {
    uiStore.error('Failed to save room')
  } finally {
    saving.value = false
  }
}

async function deleteRoom(room) {
  if (confirm(t('rooms.deleteConfirm'))) {
    try {
      await roomsApi.delete(room.id)
      uiStore.success('Room deleted')
      if (selectedRoom.value?.id === room.id) selectedRoom.value = null
      fetchRooms()
    } catch (error) {
      uiStore.error('Failed to delete room')
    }
  }
}

// Device Actions
function openDeviceModal(device = null) {
  if (device) {
    deviceForm.id = device.id
    deviceForm.roomId = device.room_id || selectedRoom.value.id
    deviceForm.name = device.name
    deviceForm.macAddress = device.mac_address || device.macAddress
    deviceForm.type = device.type || 'temperature_sensor'
  } else {
    deviceForm.id = null
    deviceForm.roomId = selectedRoom.value.id
    deviceForm.name = ''
    deviceForm.macAddress = ''
    deviceForm.type = 'temperature_sensor'
  }
  showDeviceModal.value = true
}

async function saveDevice() {
  if (!deviceForm.name || !deviceForm.macAddress) return
  saving.value = true
  try {
    if (deviceForm.id) {
      await devicesApi.update(deviceForm.id, deviceForm)
      uiStore.success('Device updated')
    } else {
      await devicesApi.create(deviceForm)
      uiStore.success('Device created')
    }
    showDeviceModal.value = false
    fetchRooms()
  } catch (error) {
    uiStore.error('Failed to save device')
  } finally {
    saving.value = false
  }
}

async function deleteDevice(device) {
  if (confirm('Delete this device?')) {
    try {
      await devicesApi.delete(device.id)
      uiStore.success('Device deleted')
      fetchRooms()
    } catch (error) {
      uiStore.error('Failed to delete device')
    }
  }
}

onMounted(() => {
  fetchRooms()
})
</script>

<style lang="scss" scoped>
.page-header {
  margin-bottom: $space-6;
}

.page-title {
  font-size: $font-3xl;
  margin-bottom: $space-1;
}

.page-subtitle {
  color: $text-muted;
  font-size: $font-lg;
}

.system-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-6;
  
  @media (max-width: $bp-lg) {
    grid-template-columns: 1fr;
  }
}

.system-panel {
  :deep(.card-header) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  :deep(.card-body) {
    padding: 0;
    max-height: 600px;
    overflow-y: auto;
  }
}

.panel-title {
  font-size: $font-lg;
  margin: 0;
}

.list-group {
  display: flex;
  flex-direction: column;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-4 $space-6;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }

  &.selected {
    background: rgba(0, 212, 255, 0.08);
    border-left: 3px solid $accent-blue;
  }
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-title {
  font-weight: 600;
  color: $text-primary;
}

.item-subtitle {
  font-size: $font-xs;
  color: $text-muted;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: $space-2;
}

.icon-btn {
  background: none;
  border: none;
  color: $text-secondary;
  padding: $space-2;
  border-radius: $radius-sm;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: $text-primary;
  }

  &.text-danger:hover {
    background: rgba(255, 71, 87, 0.15);
    color: $accent-red;
  }
}

.empty-list {
  padding: $space-8;
  text-align: center;
  color: $text-muted;
}

.form-layout {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.mb-2 { margin-bottom: $space-2; }
.p-4 { padding: $space-4; }
</style>
