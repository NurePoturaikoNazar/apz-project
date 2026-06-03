<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-left">
        <div class="brand">
          <div class="logo-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="url(#grad2)" stroke-width="2" stroke-linejoin="round"/>
              <path d="M2 17l10 5 10-5" stroke="url(#grad2)" stroke-width="2" stroke-linejoin="round"/>
              <path d="M2 12l10 5 10-5" stroke="url(#grad2)" stroke-width="2" stroke-linejoin="round"/>
              <defs>
                <linearGradient id="grad2" x1="2" y1="2" x2="22" y2="22">
                  <stop stop-color="#00D4FF"/>
                  <stop offset="1" stop-color="#00FFC8"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1>Aquila</h1>
          <p>{{ t('app.tagline') }}</p>
        </div>
        
        <div class="system-stats">
          <div class="stat-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/><path d="M2 12h20"/></svg>
            <span>{{ t('auth.stats.telemetry') }}</span>
          </div>
          <div class="stat-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span>{{ t('auth.stats.acid') }}</span>
          </div>
          <div class="stat-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12a2 2 0 100 4 2 2 0 000-4z"/></svg>
            <span>{{ t('auth.stats.analytics') }}</span>
          </div>
        </div>
      </div>
      
      <div class="login-right">
        <BaseCard class="login-card">
          <div class="login-header">
            <h2>{{ t('auth.loginTitle') }}</h2>
            <p class="text-muted">{{ t('auth.loginSubtitle') }}</p>
          </div>
          
          <form class="login-form" @submit.prevent="handleLogin">
            <div class="form-group">
              <label>{{ t('auth.email') }}</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input 
                  v-model="form.email" 
                  type="email" 
                  required 
                  :placeholder="t('auth.emailPlaceholder')"
                >
              </div>
            </div>
            
            <div class="form-group">
              <label>{{ t('auth.password') }}</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                <input 
                  v-model="form.password" 
                  type="password" 
                  required 
                  :placeholder="t('auth.passwordPlaceholder')"
                >
              </div>
            </div>
            
            <!-- For demonstration purposes: quick login buttons -->
            <div class="demo-logins">
              <span class="demo-label">Demo access:</span>
              <div class="demo-buttons">
                <button type="button" class="demo-btn" @click="setDemo('admin@admin.ua', 'admin')">Admin</button>
                <button type="button" class="demo-btn" @click="setDemo('nazar@gmail.com', 'nazar123')">User</button>
              </div>
            </div>

            <div v-if="error" class="error-message fade-in">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {{ error }}
            </div>
            
            <BaseButton 
              type="submit" 
              class="submit-btn" 
              full-width 
              :loading="loading"
            >
              {{ loading ? t('auth.loggingIn') : t('auth.login') }}
            </BaseButton>
          </form>
        </BaseCard>
        
        <div class="lang-switch">
          <button :class="{ active: uiStore.locale === 'ua' }" @click="switchLang('ua')">UA</button>
          <button :class="{ active: uiStore.locale === 'en' }" @click="switchLang('en')">EN</button>
        </div>
      </div>
    </div>
    
    <!-- Decorative elements -->
    <div class="bg-shape shape-1"></div>
    <div class="bg-shape shape-2"></div>
    <div class="bg-shape shape-3"></div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const { t, locale } = useI18n()
const authStore = useAuthStore()
const uiStore = useUiStore()

const loading = ref(false)
const error = ref('')

const form = reactive({
  email: '',
  password: '',
})

function switchLang(lang) {
  locale.value = lang
  uiStore.setLocale(lang)
}

function setDemo(email, password) {
  form.email = email
  form.password = password
}

async function handleLogin() {
  loading.value = true
  error.value = ''
  
  try {
    await authStore.login(form.email, form.password)
    uiStore.success(t('auth.success') || 'Login successful')
    
    if (authStore.isAdmin) {
      router.push('/admin/users')
    } else {
      router.push('/')
    }
  } catch (err) {
    if (err.response && (err.response.status === 401 || err.response.status === 404)) {
      error.value = t('auth.invalidCredentials')
    } else {
      error.value = err.message || 'An error occurred during login'
    }
    uiStore.error(error.value)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $bg-primary;
  position: relative;
  overflow: hidden;
  padding: $space-4;
}

.bg-shape {
  position: absolute;
  filter: blur(80px);
  z-index: 0;
  border-radius: 50%;
  opacity: 0.15;
  animation: float 10s infinite ease-in-out alternate;
}

.shape-1 {
  width: 600px;
  height: 600px;
  background: $accent-blue;
  top: -200px;
  left: -200px;
}

.shape-2 {
  width: 500px;
  height: 500px;
  background: $accent-purple;
  bottom: -100px;
  right: -100px;
  animation-delay: -5s;
}

.shape-3 {
  width: 300px;
  height: 300px;
  background: $accent-cyan;
  top: 40%;
  left: 30%;
  animation-duration: 15s;
}

.login-wrapper {
  position: relative;
  z-index: 10;
  display: flex;
  width: 100%;
  max-width: 1000px;
  min-height: 560px;
  background: rgba(17, 22, 32, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: $radius-xl;
  overflow: hidden;
  box-shadow: $shadow-lg, 0 0 40px rgba(0, 212, 255, 0.05);
  animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: $bp-md) {
    flex-direction: column;
    min-height: auto;
  }
}

.login-left {
  flex: 1;
  padding: $space-10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.05) 0%, transparent 100%);

  @media (max-width: $bp-md) {
    padding: $space-6;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
}

.brand {
  margin-bottom: $space-10;

  @media (max-width: $bp-md) {
    margin-bottom: $space-6;
    text-align: center;
  }

  .logo-icon {
    width: 64px;
    height: 64px;
    margin-bottom: $space-4;
    filter: drop-shadow(0 0 10px rgba(0, 212, 255, 0.3));

    @media (max-width: $bp-md) {
      margin: 0 auto $space-4;
    }
  }

  h1 {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: $space-1;
    background: $gradient-cyan;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.02em;
  }

  p {
    font-size: $font-lg;
    color: $text-secondary;
  }
}

.system-stats {
  display: flex;
  flex-direction: column;
  gap: $space-4;

  @media (max-width: $bp-md) {
    display: none; // Hide on mobile to save space
  }
}

.stat-item {
  display: flex;
  align-items: center;
  gap: $space-4;
  color: $text-secondary;
  font-weight: 500;
  padding: $space-3 $space-4;
  background: rgba(255, 255, 255, 0.02);
  border-radius: $radius-lg;
  border: 1px solid rgba(255, 255, 255, 0.02);
  transition: all $transition-fast;

  svg {
    color: $accent-blue;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(4px);
    color: $text-primary;
  }
}

.login-right {
  flex: 1;
  padding: $space-10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: $bp-md) {
    padding: $space-6;
  }
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;

  :deep(.card-body) {
    padding: 0;
  }
}

.login-header {
  margin-bottom: $space-8;
  text-align: center;

  h2 {
    font-size: $font-2xl;
    margin-bottom: $space-2;
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: $space-5;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.input-wrapper {
  position: relative;
  
  .input-icon {
    position: absolute;
    left: $space-3;
    top: 50%;
    transform: translateY(-50%);
    color: $text-muted;
    pointer-events: none;
    transition: color $transition-fast;
  }

  input {
    padding-left: 42px;
    height: 48px;
    background: rgba(0, 0, 0, 0.2);
    
    &:focus {
      background: rgba(0, 0, 0, 0.3);
      + .input-icon {
        color: $accent-blue;
      }
    }
  }
}

.demo-logins {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-3;
  background: rgba(0, 212, 255, 0.05);
  border: 1px dashed rgba(0, 212, 255, 0.2);
  border-radius: $radius-md;
  margin-top: -$space-2;

  .demo-label {
    font-size: 11px;
    color: $text-muted;
    text-transform: uppercase;
  }

  .demo-buttons {
    display: flex;
    gap: $space-2;
  }

  .demo-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: $text-secondary;
    font-size: 11px;
    padding: 4px 10px;
    border-radius: $radius-sm;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: rgba(0, 212, 255, 0.1);
      color: $accent-blue;
      border-color: rgba(0, 212, 255, 0.3);
    }
  }
}

.error-message {
  display: flex;
  align-items: center;
  gap: $space-2;
  padding: $space-3;
  background: rgba(255, 71, 87, 0.1);
  border: 1px solid rgba(255, 71, 87, 0.2);
  border-radius: $radius-md;
  color: $accent-red;
  font-size: $font-sm;
  font-weight: 500;
}

.submit-btn {
  height: 48px;
  font-size: $font-lg;
  margin-top: $space-2;
}

.lang-switch {
  position: absolute;
  top: $space-6;
  right: $space-6;
  display: flex;
  gap: 4px;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px;
  border-radius: $radius-lg;

  button {
    background: transparent;
    border: none;
    color: $text-muted;
    font-size: 11px;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: $radius-md;
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
</style>
