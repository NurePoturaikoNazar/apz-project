<template>
  <header class="app-header">
    <div class="header-left">
      <button class="mobile-menu" @click="uiStore.toggleSidebar">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <div class="breadcrumb">
        <span class="breadcrumb-current">{{ currentPageTitle }}</span>
      </div>
    </div>

    <div class="header-right">
      <!-- Language Switcher -->
      <div class="lang-switcher">
        <button
          class="lang-btn"
          :class="{ active: uiStore.locale === 'ua' }"
          @click="switchLang('ua')"
        >UA</button>
        <button
          class="lang-btn"
          :class="{ active: uiStore.locale === 'en' }"
          @click="switchLang('en')"
        >EN</button>
      </div>

      <!-- Alert Bell -->
      <button class="header-icon-btn" @click="$router.push('/events')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        <span v-if="unreadCount > 0" class="bell-badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
      </button>

      <!-- User Menu -->
      <div class="user-menu" @click="showUserMenu = !showUserMenu">
        <div class="user-avatar">
          {{ authStore.userName.charAt(0).toUpperCase() }}
        </div>
        <Transition name="fade">
          <div v-if="showUserMenu" class="user-dropdown" @click.stop>
            <div class="dropdown-header">
              <strong>{{ authStore.userName }}</strong>
              <span>{{ authStore.user?.email }}</span>
            </div>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item danger" @click="handleLogout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              {{ t('nav.logout') }}
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { alertsApi } from '@/api/alerts'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const authStore = useAuthStore()
const uiStore = useUiStore()

const showUserMenu = ref(false)
const unreadCount = ref(0)

const currentPageTitle = computed(() => {
  const name = route.name
  const map = {
    Dashboard: t('nav.dashboard'),
    Rooms: t('nav.rooms'),
    RoomDetail: t('nav.rooms'),
    Analytics: t('nav.analytics'),
    Events: t('nav.events'),
    AdminUsers: t('nav.users'),
    AdminSystem: t('nav.system'),
    AdminAudit: t('nav.audit'),
  }
  return map[name] || 'Aquila'
})

function switchLang(lang) {
  locale.value = lang
  uiStore.setLocale(lang)
}

async function fetchUnreadCount() {
  try {
    const { data } = await alertsApi.getUnreadCount()
    unreadCount.value = data.count || 0
  } catch {
    // Silent fail
  }
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

// Close dropdown on outside click
function handleOutsideClick(e) {
  if (!e.target.closest('.user-menu')) {
    showUserMenu.value = false
  }
}

let pollInterval
onMounted(() => {
  fetchUnreadCount()
  pollInterval = setInterval(fetchUnreadCount, 30000)
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  clearInterval(pollInterval)
  document.removeEventListener('click', handleOutsideClick)
})
</script>

<style lang="scss" scoped>
.app-header {
  height: $header-height;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $space-6;
  background: rgba(11, 14, 20, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid $border-color;
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-left {
  display: flex;
  align-items: center;
  gap: $space-4;
}

.mobile-menu {
  display: none;
  background: none;
  border: none;
  color: $text-secondary;
  cursor: pointer;
  padding: $space-2;
  border-radius: $radius-sm;

  &:hover { color: $text-primary; }

  @media (max-width: $bp-md) {
    display: flex;
  }
}

.breadcrumb-current {
  font-size: $font-lg;
  font-weight: 600;
  color: $text-primary;
}

.header-right {
  display: flex;
  align-items: center;
  gap: $space-4;
}

.lang-switcher {
  display: flex;
  background: rgba(255, 255, 255, 0.04);
  border-radius: $radius-md;
  overflow: hidden;
  border: 1px solid $border-color;
}

.lang-btn {
  background: none;
  border: none;
  color: $text-muted;
  font-size: $font-xs;
  font-weight: 700;
  font-family: $font-family;
  padding: 6px 12px;
  cursor: pointer;
  transition: all $transition-fast;
  letter-spacing: 0.05em;

  &.active {
    background: rgba(0, 212, 255, 0.12);
    color: $accent-blue;
  }

  &:hover:not(.active) {
    color: $text-secondary;
  }
}

.header-icon-btn {
  position: relative;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid $border-color;
  color: $text-secondary;
  padding: $space-2;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all $transition-fast;
  display: flex;

  &:hover {
    border-color: $border-active;
    color: $accent-blue;
    background: rgba(0, 212, 255, 0.06);
  }
}

.bell-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: $accent-red;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: $radius-full;
  min-width: 16px;
  text-align: center;
  animation: glowPulseRed 2s ease-in-out infinite;
}

.user-menu {
  position: relative;
  cursor: pointer;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: $radius-full;
  background: $gradient-blue;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: $font-sm;
  color: #fff;
  transition: all $transition-fast;

  &:hover {
    box-shadow: $shadow-glow-blue;
    transform: scale(1.05);
  }
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 220px;
  background: $bg-secondary;
  border: 1px solid $bg-glass-border;
  border-radius: $radius-lg;
  box-shadow: $shadow-lg;
  overflow: hidden;
  z-index: 100;
}

.dropdown-header {
  padding: $space-4;
  display: flex;
  flex-direction: column;
  gap: 2px;

  strong {
    font-size: $font-sm;
    color: $text-primary;
  }

  span {
    font-size: $font-xs;
    color: $text-muted;
  }
}

.dropdown-divider {
  height: 1px;
  background: $border-color;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: $space-3;
  width: 100%;
  padding: $space-3 $space-4;
  background: none;
  border: none;
  color: $text-secondary;
  font-family: $font-family;
  font-size: $font-sm;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: $text-primary;
  }

  &.danger:hover {
    background: rgba(255, 71, 87, 0.08);
    color: $accent-red;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
