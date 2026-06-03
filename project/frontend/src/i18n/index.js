import { createI18n } from 'vue-i18n'
import ua from './ua.json'
import en from './en.json'

const savedLocale = localStorage.getItem('aquila_locale') || 'ua'

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: { ua, en },
})

export default i18n
