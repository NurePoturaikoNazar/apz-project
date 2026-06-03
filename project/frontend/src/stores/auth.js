import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { usersApi } from '@/api/users'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('aquila_user') || 'null'))
  const token = ref(localStorage.getItem('aquila_token') || null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.email === 'admin')
  const userName = computed(() => user.value?.full_name || 'User')

  async function login(email, password) {
    const { data } = await usersApi.login({ email, password })
    token.value = data.token || 'demo-token'
    
    // Determine role from email
    const role = email === 'admin' ? 'admin' : 'user'
    
    user.value = {
      id: data.user?.id || data.id,
      email: data.user?.email || email,
      full_name: data.user?.full_name || email,
      role,
      ...data.user,
    }

    localStorage.setItem('aquila_token', token.value)
    localStorage.setItem('aquila_user', JSON.stringify(user.value))

    return user.value
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('aquila_token')
    localStorage.removeItem('aquila_user')
  }

  function updateProfile(updates) {
    if (user.value) {
      user.value = { ...user.value, ...updates }
      localStorage.setItem('aquila_user', JSON.stringify(user.value))
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    userName,
    login,
    logout,
    updateProfile,
  }
})
