<template>
    <el-dropdown trigger="click" @command="changeLanguage">
      <span class="language-switcher">
        {{ currentLanguage }}
        <el-icon class="el-icon--right"><arrow-down /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item 
            v-for="lang in languages" 
            :key="lang.code"
            :command="lang.code"
            :class="{ active: currentLanguage === lang.name }"
          >
            {{ lang.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { ArrowDown } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  
  const { locale, t } = useI18n()
      
  const languages = [
    { code: 'zh', name: '中文' },
    { code: 'en', name: 'English' }
  ]
      
  const currentLanguage = computed(() => {
    const lang = languages.find(l => l.code === locale.value)
    return lang ? lang.name : '中文'
  })
      
  const changeLanguage = (langCode) => {
    locale.value = langCode
    localStorage.setItem('language', langCode)
    ElMessage.success(t('languageChanged'))
  }
      
  onMounted(() => {
    const savedLang = localStorage.getItem('language')
    if (savedLang) {
      locale.value = savedLang
    }
  })
  </script>
  
  <style scoped>
  .language-switcher {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-color);
    font-weight: 500;
    cursor: pointer;
    padding: 0.5rem;
    transition: color 0.3s ease;
  }
  
  .language-switcher:hover {
    color: var(--primary-color);
  }
  
  :deep(.el-dropdown-menu__item) {
    padding: 8px 20px;
  }
  
  :deep(.el-dropdown-menu__item.active) {
    color: var(--primary-color);
    background-color: var(--primary-color-light);
  }
  </style>