<template>
  <aside class="sidebar" :class="{ collapsed: uiStore.sidebarCollapsed }">
    <!-- Logo -->
    <div class="sidebar-logo">
      <div class="logo-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="url(#grad)" stroke-width="2" stroke-linejoin="round"/>
          <path d="M2 17l10 5 10-5" stroke="url(#grad)" stroke-width="2" stroke-linejoin="round"/>
          <path d="M2 12l10 5 10-5" stroke="url(#grad)" stroke-width="2" stroke-linejoin="round"/>
          <defs>
            <linearGradient id="grad" x1="2" y1="2" x2="22" y2="22">
              <stop stop-color="#00D4FF"/>
              <stop offset="1" stop-color="#00FFC8"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <Transition name="fade">
        <div v-if="!uiStore.sidebarCollapsed" class="logo-text">
          <span class="logo-name">Aquila</span>
          <span class="logo-sub">{{ t('app.tagline') }}</span>
        </div>
      </Transition>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <div class="nav-section">
        <RouterLink
          v-for="item in mainNav"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
        >
          <span class="nav-icon" v-html="item.icon"></span>
          <Transition name="fade">
            <span v-if="!uiStore.sidebarCollapsed" class="nav-label">{{ item.label }}</span>
          </Transition>
          <span v-if="item.badge && !uiStore.sidebarCollapsed" class="nav-badge">{{ item.badge }}</span>
        </RouterLink>
      </div>

      <div v-if="authStore.isAdmin" class="nav-section">
        <Transition name="fade">
          <span v-if="!uiStore.sidebarCollapsed" class="nav-divider-label">{{ t('nav.admin') }}</span>
        </Transition>
        <RouterLink
          v-for="item in adminNav"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
        >
          <span class="nav-icon" v-html="item.icon"></span>
          <Transition name="fade">
            <span v-if="!uiStore.sidebarCollapsed" class="nav-label">{{ item.label }}</span>
          </Transition>
        </RouterLink>
      </div>
    </nav>

    <!-- Bottom -->
    <div class="sidebar-bottom">
      <button class="nav-item collapse-btn" @click="uiStore.toggleSidebar">
        <span class="nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path v-if="uiStore.sidebarCollapsed" d="M9 18l6-6-6-6"/>
            <path v-else d="M15 18l-6-6 6-6"/>
          </svg>
        </span>
        <Transition name="fade">
          <span v-if="!uiStore.sidebarCollapsed" class="nav-label">Collapse</span>
        </Transition>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'

const route = useRoute()
const { t } = useI18n()
const authStore = useAuthStore()
const uiStore = useUiStore()

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const mainNav = computed(() => [
  {
    path: '/',
    label: t('nav.dashboard'),
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  },
  {
    path: '/rooms',
    label: t('nav.rooms'),
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>',
  },
  {
    path: '/analytics',
    label: t('nav.analytics'),
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12a2 2 0 100 4 2 2 0 000-4z"/></svg>',
  },
  {
    path: '/events',
    label: t('nav.events'),
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>',
  },
])

const adminNav = computed(() => [
  {
    path: '/admin/users',
    label: t('nav.users'),
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
  },
  {
    path: '/admin/system',
    label: t('nav.system'),
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
  },
  {
    path: '/admin/audit',
    label: t('nav.audit'),
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>',
  },
])
</script>

<style lang="scss" scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: $sidebar-width;
  background: $bg-secondary;
  border-right: 1px solid $border-color;
  display: flex;
  flex-direction: column;
  transition: width $transition-base;
  z-index: 100;
  overflow: hidden;

  &.collapsed {
    width: $sidebar-collapsed;
  }
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-6 $space-5;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.logo-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  white-space: nowrap;
}

.logo-name {
  font-size: $font-lg;
  font-weight: 700;
  background: $gradient-cyan;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-sub {
  font-size: 10px;
  color: $text-muted;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.sidebar-nav {
  flex: 1;
  padding: $space-4 $space-3;
  overflow-y: auto;
  overflow-x: hidden;
}

.nav-section {
  margin-bottom: $space-4;
}

.nav-divider-label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  color: $text-muted;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: $space-4 $space-3 $space-2;
  overflow: hidden;
  white-space: nowrap;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-3 $space-3;
  border-radius: $radius-md;
  color: $text-secondary;
  text-decoration: none;
  transition: all $transition-fast;
  margin-bottom: 2px;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  font-family: $font-family;
  font-size: $font-sm;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: $text-primary;
  }

  &.active {
    background: rgba(0, 212, 255, 0.08);
    color: $accent-blue;

    .nav-icon {
      color: $accent-blue;
      filter: drop-shadow(0 0 4px rgba(0, 212, 255, 0.4));
    }
  }
}

.nav-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-label {
  overflow: hidden;
  white-space: nowrap;
  font-weight: 500;
}

.nav-badge {
  margin-left: auto;
  background: rgba(255, 71, 87, 0.15);
  color: $accent-red;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: $radius-full;
}

.sidebar-bottom {
  padding: $space-3;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

.collapse-btn {
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
}

// Fade transition
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: $bp-md) {
  .sidebar {
    transform: translateX(-100%);

    &:not(.collapsed) {
      transform: translateX(0);
    }
  }
}
</style>
