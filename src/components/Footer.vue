<template>
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>{{ $t('footer.about.title') }}</h3>
            <p>{{ $t('footer.about.description') }}</p>
          </div>
          
          <div class="footer-section">
            <h3>{{ $t('footer.service.title') }}</h3>
            <ul>
              <li><a href="#" @click.prevent="showDialog('help')">{{ $t('footer.service.help') }}</a></li>
              <li><a href="#" @click.prevent="showDialog('shipping')">{{ $t('footer.service.shipping') }}</a></li>
              <li><a href="#" @click.prevent="showDialog('returns')">{{ $t('footer.service.returns') }}</a></li>
              <li><a href="#" @click.prevent="showDialog('contact')">{{ $t('footer.service.contact') }}</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h3>{{ $t('footer.social.title') }}</h3>
            <div class="social-links">
              <a href="#" class="social-link">
                <i class="fab fa-weixin"></i>
              </a>
              <a href="#" class="social-link">
                <i class="fab fa-weibo"></i>
              </a>
              <a href="#" class="social-link">
                <i class="fab fa-qq"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2024 GlobalShop. {{ $t('footer.copyright') }}</p>
        </div>
      </div>
  
      <!-- 服务弹窗 -->
      <el-dialog
        v-model="dialogVisible"
        :title="currentDialog ? $t(`footer.service.dialog.${currentDialog}.title`) : ''"
        width="30%"
        :before-close="handleClose"
      >
        <div class="dialog-content">
          <template v-if="currentDialog === 'help'">
            <h4 class="dialog-subtitle">{{ $t('footer.service.dialog.help.welcome') }}</h4>
            <ul class="dialog-list">
              <template v-for="(item, index) in helpItems" :key="index">
                <li>{{ item }}</li>
              </template>
            </ul>
          </template>
          
          <template v-if="currentDialog === 'shipping'">
            <h4 class="dialog-subtitle">{{ $t('footer.service.dialog.shipping.intro') }}</h4>
            <ul class="dialog-list">
              <template v-for="(item, index) in shippingItems" :key="index">
                <li>{{ item }}</li>
              </template>
            </ul>
          </template>
          
          <template v-if="currentDialog === 'returns'">
            <h4 class="dialog-subtitle">{{ $t('footer.service.dialog.returns.intro') }}</h4>
            <ul class="dialog-list">
              <template v-for="(item, index) in returnsItems" :key="index">
                <li>{{ item }}</li>
              </template>
            </ul>
          </template>
          
          <template v-if="currentDialog === 'contact'">
            <h4 class="dialog-subtitle">{{ $t('footer.service.dialog.contact.intro') }}</h4>
            <ul class="dialog-list">
              <template v-for="(item, index) in contactItems" :key="index">
                <li>{{ item }}</li>
              </template>
            </ul>
          </template>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">{{ $t('footer.service.dialog.close') }}</el-button>
          </span>
        </template>
      </el-dialog>
    </footer>
  </template>
  
  <script>
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import messages from '@/i18n/index.json'
  
  export default {
    name: 'Footer',
    setup() {
      const { t , locale, availableLocales, messages } = useI18n()
      const dialogVisible = ref(false)
      const currentDialog = ref('')
  
      // 调试信息
      console.log('[Footer] Current locale:', locale.value)
      console.log('[Footer] Available locales:', availableLocales)
      console.log('[Footer] Messages:', {
        zh: messages.value.zh?.footer,
        en: messages.value.en?.footer
      })
  
      const getTranslatedItems = (path) => {
        try {
  
        //    // 直接访问 messages 对象中的值
        // const items = messages.value[locale.value]?.footer?.service?.dialog?.[currentDialog.value]?.items
      
        // if (items) {
        //   console.log(`Found items for ${path}:`, items)
        //   return items;
        // }
          // 分割路径
          const pathParts = path.split('.');
          let result = messages.value[locale.value];
          
          for (const part of pathParts) {
            result = result?.[part];
            if (result === undefined) break;
          }
          
          if (result !== undefined) {
            console.log(`Found translation for ${path}:`, result);
            return Array.isArray(result) ? result : [result];
          }
  
          
          // 使用i18n的t函数获取翻译
          const fallbackItems  = t(path, [], { list: true })
          console.log(`Translation for ${path}:`, fallbackItems ) // 添加调试信息
          // 确保返回的是数组
          return Array.isArray(fallbackItems ) ? fallbackItems  : [fallbackItems ]
        } catch (e) {
          console.error(`Translation error for ${path}:`, e)
          return ['翻译数据获取错误，请联系管理员'] // 返回空数组避免模板错误
        }
      }
  
      // 计算属性获取翻译后的列表项
      const helpItems = computed(() => getTranslatedItems('footer.service.dialog.help.items'))
      const shippingItems = computed(() => getTranslatedItems('footer.service.dialog.shipping.items'))
      const returnsItems = computed(() => getTranslatedItems('footer.service.dialog.returns.items'))
      const contactItems = computed(() => getTranslatedItems('footer.service.dialog.contact.items'))
  
      const showDialog = (type) => {
        currentDialog.value = type
        dialogVisible.value = true
      }
  
      const handleClose = () => {
        dialogVisible.value = false
      }
  
      return {
        dialogVisible,
        currentDialog,
        showDialog,
        handleClose,
        helpItems,
        shippingItems,
        returnsItems,
        contactItems
      }
    }
  }
  </script>
  
  <style scoped>
  .footer {
    background-color: #f8f9fa;
    padding: 4rem 0 2rem;
    margin-top: 0;
    border-top: 1px solid #eee;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .footer-content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    padding: 3rem 0;
  }
  
  .footer-section {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    transition: transform 0.3s ease;
  }
  
  .footer-section:hover {
    transform: translateY(-5px);
  }
  
  .footer-section h3 {
    color: #333;
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
    font-weight: 600;
    position: relative;
    padding-bottom: 0.5rem;
  }
  
  .footer-section h3::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 2px;
    background-color: var(--primary-color, #1a73e8);
  }
  
  .footer-section p {
    color: #666;
    line-height: 1.6;
    margin-bottom: 1rem;
  }
  
  .footer-section ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .footer-section ul li {
    margin-bottom: 0.8rem;
  }
  
  .footer-section ul li a {
    color: #666;
    text-decoration: none;
    transition: color 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .footer-section ul li a:hover {
    color: var(--primary-color, #1a73e8);
  }
  
  .social-links {
    display: flex;
    gap: 1.5rem;
  }
  
  .social-link {
    color: #666;
    font-size: 1.5rem;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #f5f5f5;
  }
  
  .social-link:hover {
    color: var(--primary-color, #1a73e8);
    background-color: #e8f0fe;
    transform: translateY(-2px);
  }
  
  .footer-bottom {
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid #eee;
    color: #666;
  }
  
  .dialog-content {
    padding: 20px;
  }
  
  .dialog-subtitle {
    color: #333;
    margin-bottom: 15px;
    font-size: 18px;
    font-weight: 600;
  }
  
  .dialog-list {
    list-style: none;
    padding: 0;
  }
  
  .dialog-list li {
    color: #666;
    margin-bottom: 10px;
    padding-left: 20px;
    position: relative;
  }
  
  .dialog-list li::before {
    content: "•";
    color: var(--primary-color, #1a73e8);
    position: absolute;
    left: 0;
  }
  
  @media (max-width: 768px) {
    .footer-content {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .footer-section {
      text-align: center;
    }
    
    .footer-section h3::after {
      left: 50%;
      transform: translateX(-50%);
    }
    
    .social-links {
      justify-content: center;
    }
    
    .footer-section ul li a {
      justify-content: center;
    }
  }
  </style> 