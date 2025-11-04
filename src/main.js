import { createApp, defineAsyncComponent } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './styles/element-plus-override.css'
import './style.css'
import App from './App.vue'
import router from './router'
import messages from '@/i18n/index.json'

// ✅ 创建 app 实例（只创建一次）
const app = createApp(App)

// ✅ 创建 Pinia 实例
const pinia = createPinia()

// ✅ 创建 i18n 实例
const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('language') || 'zh',
  fallbackLocale: 'en',
  messages,
  silentTranslationWarn: false,
  silentFallbackWarn: false,
  missing: (locale, key) => {
    console.warn(`[i18n] Missing ${key} in ${locale} locale`)
    return `[MISSING: ${key} in ${locale}]`
  }
})

// ✅ 注册插件（顺序很重要）
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.use(i18n)

// ✅ 异步注册全局组件
app.component('LanguageSwitcher', defineAsyncComponent(() =>
  import('./components/LanguageSwitcher.vue'))
)

// ✅ 挂载应用（只挂载一次）
app.mount('#app')