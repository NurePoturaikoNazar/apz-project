<template>
  <div class="admin-audit-view fade-in">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ t('audit.title') }}</h1>
        <p class="page-subtitle">{{ t('audit.subtitle') }}</p>
      </div>
      <div class="header-actions">
        <BaseButton variant="ghost" @click="exportCSV">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          {{ t('audit.exportCsv') }}
        </BaseButton>
        <BaseButton variant="primary" @click="exportPDF">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          {{ t('audit.exportPdf') }}
        </BaseButton>
      </div>
    </div>

    <BaseCard class="stagger-1">
      <div class="filter-bar">
        <div class="filter-group">
          <label>{{ t('audit.filterByType') }}</label>
          <select v-model="filterType">
            <option value="">{{ t('audit.allTypes') }}</option>
            <option value="TEMPERATURE_HIGH">Temperature High</option>
            <option value="TEMPERATURE_LOW">Temperature Low</option>
            <option value="HUMIDITY_HIGH">Humidity High</option>
            <option value="HUMIDITY_LOW">Humidity Low</option>
            <option value="MOTION_DETECTED">Motion Detected</option>
            <option value="MANUAL">Manual</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="p-6">
        <SkeletonLoader variant="text" height="40px" class="mb-4" />
        <SkeletonLoader variant="text" height="40px" />
      </div>

      <div v-else-if="filteredAlerts.length === 0" class="empty-state">
        <p>{{ t('common.noData') }}</p>
      </div>

      <div v-else class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Message</th>
              <th>Device ID</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alert in filteredAlerts" :key="alert.id">
              <td class="mono text-muted">#{{ alert.id }}</td>
              <td>
                <BaseBadge :variant="getBadgeVariant(alert.type)">
                  {{ alert.type }}
                </BaseBadge>
              </td>
              <td>{{ alert.message }}</td>
              <td class="mono text-muted">{{ alert.device_id }}</td>
              <td>{{ formatDate(alert.created_at) }}</td>
              <td>
                <BaseBadge :variant="alert.is_read ? 'default' : 'warning'" size="sm">
                  {{ alert.is_read ? 'Read' : 'Unread' }}
                </BaseBadge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUiStore } from '@/stores/ui'
import { alertsApi } from '@/api/alerts'
import Papa from 'papaparse'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'

const { t } = useI18n()
const uiStore = useUiStore()

const loading = ref(true)
const alerts = ref([])
const filterType = ref('')

const filteredAlerts = computed(() => {
  let list = alerts.value || []
  if (filterType.value) {
    list = list.filter(a => a.type === filterType.value)
  }
  return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

async function fetchAlerts() {
  try {
    const { data } = await alertsApi.getAll()
    alerts.value = data
  } catch (error) {
    uiStore.error('Failed to load audit logs')
  } finally {
    loading.value = false
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Intl.DateTimeFormat('default', {
    year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).format(new Date(dateStr))
}

function getBadgeVariant(type) {
  if (!type) return 'default'
  if (type.includes('HIGH') || type.includes('MOTION')) return 'danger'
  if (type.includes('LOW')) return 'warning'
  return 'info'
}

function exportCSV() {
  if (filteredAlerts.value.length === 0) return
  
  const data = filteredAlerts.value.map(a => ({
    ID: a.id,
    Type: a.type,
    Message: a.message,
    DeviceID: a.device_id,
    Date: formatDate(a.created_at),
    Status: a.is_read ? 'Read' : 'Unread'
  }))
  
  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `aquila_audit_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  uiStore.success('CSV Exported successfully')
}

function exportPDF() {
  if (filteredAlerts.value.length === 0) return
  
  const doc = new jsPDF()
  doc.text('Aquila Audit Log', 14, 15)
  
  const body = filteredAlerts.value.map(a => [
    a.id,
    a.type,
    a.message,
    formatDate(a.created_at),
    a.is_read ? 'Read' : 'Unread'
  ])
  
  autoTable(doc, {
    startY: 20,
    head: [['ID', 'Type', 'Message', 'Date', 'Status']],
    body: body,
    theme: 'grid',
    headStyles: { fillColor: [0, 212, 255] }
  })
  
  doc.save(`aquila_audit_${new Date().toISOString().split('T')[0]}.pdf`)
  uiStore.success('PDF Exported successfully')
}

onMounted(() => {
  fetchAlerts()
})
</script>

<style lang="scss" scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
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

.header-actions {
  display: flex;
  gap: $space-3;
}

.filter-bar {
  padding: $space-4 $space-6;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  gap: $space-6;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: $space-3;
  
  label {
    margin: 0;
  }
  
  select {
    width: auto;
    min-width: 200px;
  }
}

.table-responsive {
  overflow-x: auto;
}

.empty-state {
  padding: $space-12;
  text-align: center;
  color: $text-muted;
}

.mb-4 { margin-bottom: $space-4; }
.p-6 { padding: $space-6; }
</style>
