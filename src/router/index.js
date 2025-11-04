// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'

// 页面引入
import Home from '../views/Home.vue'
import Account from '../views/account/Index.vue'
import GoodsDetail from '../views/goods/Detail.vue'
import Cart from '../views/Cart.vue'
import Login from '@/views/Login.vue'
import Register from '../views/Register.vue'

const routes = [
  {
    path: '/',
    redirect: '/home'  // 根路径重定向到首页
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }  // 首页需要登录访问
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: { requiresAuth: true }
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/account/Settings.vue')
      }
    ]
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../views/Checkout.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/order-success',
    name: 'OrderSuccess',
    component: () => import('../views/OrderSuccess.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/category/:id',
    name: 'CategoryGoods',
    component: () => import('../views/category/index.vue')
  },
  {
    path: '/goods/:goods_id',
    name: 'GoodsDetail',
    component: GoodsDetail,
    props: true
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  // ✅ 兜底 404 页面（防止白屏）
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ 路由守卫：登录检查
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 从 localStorage 中读取 token 判断登录状态
  const token = localStorage.getItem('access')
  const isLoggedIn = !!token

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)

  // 需要登录但未登录
  if (requiresAuth && !isLoggedIn) {
    ElMessage.warning('请先登录')
    return next('/login')
  }

  // 已登录用户访问登录页/注册页 → 重定向首页
  if (requiresGuest && isLoggedIn) {
    ElMessage.info('您已登录')
    return next('/home')
  }

  next()
})

export default router
