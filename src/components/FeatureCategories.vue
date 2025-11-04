<template>
  <section class="featured-categories">
    <div class="container">
      <h2>{{ $t('categories.title') }}</h2>
      <div class="category-grid">
        <router-link 
          v-for="category in categories" 
          :key="category.id"
          :to="'/category/' + category.id"
          class="category-card"
        >
          <img :src="category.image" :alt="$t(`categories.${category.id}`)">
          <h3>{{ $t(`categories.${category.id}`) }}</h3>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'FeaturedCategories',
  setup() {
    // 只用本地静态英文字符串id的分类数组
    const categories = ref([
      {
        id: 'bag',  // 包包
        image: '/src/assets/images/categories/包包.png'
      },
      {
        id: 'beauty',  // 美妆
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 'fashion',  // 衣服
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 'electronics',  // 首饰
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 'home',  // 鞋子
        image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
      }
    ])
    // 打印当前分类数组，调试用
    setTimeout(() => {
      console.log('当前分类数组:', categories.value)
    }, 1000)
    return {
      categories
    }
  }
}
</script>

<style scoped>
.featured-categories {
  padding: 4rem 0;
  background-color: var(--light-gray);
}

.featured-categories h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text-color);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.category-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
}

.category-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.category-card h3 {
  padding: 1rem;
  margin: 0;
  text-align: center;
  color: var(--text-color);
}

@media (max-width: 1024px) {
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .category-grid {
    grid-template-columns: 1fr;
  }
}
</style> 