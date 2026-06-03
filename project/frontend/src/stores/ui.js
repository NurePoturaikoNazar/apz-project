import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUiStore = defineStore('ui', () => {
  // Language
  const locale = ref(localStorage.getItem('aquila_locale') || 'ua')

  function setLocale(lang) {
    locale.value = lang
    localStorage.setItem('aquila_locale', lang)
  }

  // Sidebar
  const sidebarCollapsed = ref(false)

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  // Toast notifications
  const toasts = ref([])
  let toastId = 0

  function addToast(message, type = 'info', duration = 4000) {
    const id = ++toastId
    toasts.value.push({ id, message, type })
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
  }

  function removeToast(id) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function success(message) {
    addToast(message, 'success')
  }

  function error(message) {
    addToast(message, 'error', 6000)
  }

  function warning(message) {
    addToast(message, 'warning', 5000)
  }

  function info(message) {
    addToast(message, 'info')
  }

  return {
    locale,
    setLocale,
    sidebarCollapsed,
    toggleSidebar,
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  }
})
