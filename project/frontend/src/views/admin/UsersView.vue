<template>
  <div class="admin-users-view fade-in">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ t('users.title') }}</h1>
        <p class="page-subtitle">{{ t('users.subtitle') }}</p>
      </div>
      <BaseButton variant="primary" @click="openCreateModal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
        {{ t('users.addUser') }}
      </BaseButton>
    </div>

    <BaseCard>
      <div v-if="loading" class="loading-state p-6">
        <SkeletonLoader variant="text" height="40px" class="mb-4" />
        <SkeletonLoader variant="text" height="40px" class="mb-4" />
        <SkeletonLoader variant="text" height="40px" />
      </div>

      <div v-else-if="users.length === 0" class="empty-state p-8">
        <p class="text-muted">{{ t('users.noUsers') }}</p>
      </div>

      <div v-else class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>{{ t('users.fullName') }}</th>
              <th>{{ t('users.email') }}</th>
              <th>{{ t('users.createdAt') }}</th>
              <th class="text-right">{{ t('users.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>
                <div class="user-cell">
                  <div class="avatar">{{ user.full_name?.charAt(0).toUpperCase() || 'U' }}</div>
                  <span class="font-medium">{{ user.full_name || 'No Name' }}</span>
                </div>
              </td>
              <td>
                <span class="mono text-muted">{{ user.email }}</span>
                <BaseBadge v-if="user.email === 'admin'" variant="purple" size="sm" class="ml-2">Admin</BaseBadge>
              </td>
              <td>{{ formatDate(user.created_at) }}</td>
              <td class="actions-cell">
                <BaseButton variant="ghost" size="sm" @click="openEditModal(user)">
                  {{ t('common.edit') }}
                </BaseButton>
                <BaseButton 
                  v-if="user.email !== 'admin'" 
                  variant="ghost" 
                  size="sm" 
                  class="text-danger"
                  @click="confirmDelete(user)"
                >
                  {{ t('common.delete') }}
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>

    <!-- Create/Edit Modal -->
    <BaseModal v-model="showModal" :title="isEditing ? t('users.editUser') : t('users.addUser')">
      <form @submit.prevent="saveUser" class="user-form">
        <div class="form-group">
          <label>{{ t('users.fullName') }}</label>
          <input v-model="form.full_name" type="text" required />
        </div>
        
        <div class="form-group">
          <label>{{ t('users.email') }}</label>
          <input v-model="form.email" type="email" required :disabled="isEditing && form.email === 'admin'" />
        </div>
        
        <div v-if="!isEditing" class="form-group">
          <label>{{ t('users.password') }}</label>
          <input v-model="form.password" type="password" required minlength="6" />
        </div>
      </form>
      
      <template #footer>
        <BaseButton variant="ghost" @click="showModal = false">{{ t('common.cancel') }}</BaseButton>
        <BaseButton variant="primary" :loading="saving" @click="saveUser">
          {{ t('common.save') }}
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUiStore } from '@/stores/ui'
import { usersApi } from '@/api/users'

import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'

const { t } = useI18n()
const uiStore = useUiStore()

const loading = ref(true)
const users = ref([])

const showModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)

const form = reactive({
  id: null,
  email: '',
  full_name: '',
  password: '',
})

async function fetchUsers() {
  try {
    const { data } = await usersApi.getAll()
    users.value = data
  } catch (error) {
    uiStore.error('Failed to load users')
  } finally {
    loading.value = false
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Intl.DateTimeFormat('default', {
    year: 'numeric', month: 'short', day: '2-digit'
  }).format(new Date(dateStr))
}

function openCreateModal() {
  isEditing.value = false
  form.id = null
  form.email = ''
  form.full_name = ''
  form.password = ''
  showModal.value = true
}

function openEditModal(user) {
  isEditing.value = true
  form.id = user.id
  form.email = user.email
  form.full_name = user.full_name
  showModal.value = true
}

async function saveUser() {
  if (!form.email || !form.full_name || (!isEditing.value && !form.password)) {
    uiStore.warning('Please fill all required fields')
    return
  }

  saving.value = true
  try {
    if (isEditing.value) {
      await usersApi.update(form.id, { email: form.email, full_name: form.full_name })
      uiStore.success('User updated')
    } else {
      await usersApi.register({ email: form.email, password: form.password, full_name: form.full_name })
      uiStore.success('User created')
    }
    showModal.value = false
    fetchUsers()
  } catch (error) {
    uiStore.error(error.message || 'Failed to save user')
  } finally {
    saving.value = false
  }
}

async function confirmDelete(user) {
  if (confirm(t('users.deleteConfirm'))) {
    try {
      await usersApi.delete(user.id)
      uiStore.success('User deleted')
      fetchUsers()
    } catch (error) {
      uiStore.error('Failed to delete user')
    }
  }
}

onMounted(() => {
  fetchUsers()
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

.table-responsive {
  overflow-x: auto;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: $space-3;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: $gradient-blue;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: $font-sm;
}

.actions-cell {
  display: flex;
  justify-content: flex-end;
  gap: $space-2;
}

.user-form {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.text-right { text-align: right; }
.ml-2 { margin-left: $space-2; }
.mb-4 { margin-bottom: $space-4; }
.p-6 { padding: $space-6; }
.p-8 { padding: $space-8; }
.font-medium { font-weight: 500; }
</style>
