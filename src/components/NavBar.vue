<template>
    <nav class="navbar">
      <div class="container">
        <router-link to="/" class="logo">
          <img src="../assets/logo.svg" alt="GlobalShop Logo">
        </router-link>
        
        <div class="nav-links">
          <router-link to="/" class="nav-link">{{ $t('nav.home') }}</router-link>
          
          <div class="dropdown">
            <button class="dropdown-toggle">
              {{ $t('nav.categories') }}
              <span class="arrow">▼</span>
            </button>
            <div class="dropdown-menu">
              <router-link to="/category/electronics" class="dropdown-item">
                {{ $t('categories.electronics') }}
              </router-link>
              <router-link to="/category/clothing" class="dropdown-item">
                {{ $t('categories.clothing') }}
              </router-link>
              <router-link to="/category/books" class="dropdown-item">
                {{ $t('categories.books') }}
              </router-link>
              <router-link to="/category/home" class="dropdown-item">
                {{ $t('categories.home') }}
              </router-link>
              <router-link to="/category/sports" class="dropdown-item">
                {{ $t('categories.sports') }}
              </router-link>
              <router-link to="/category/beauty" class="dropdown-item">
                {{ $t('categories.beauty') }}
              </router-link>
              <router-link to="/category/food" class="dropdown-item">
                {{ $t('categories.food') }}
              </router-link>
              <router-link to="/category/toys" class="dropdown-item">
                {{ $t('categories.toys') }}
              </router-link>
            </div>
          </div>
          
          <router-link to="/cart" class="nav-link">
            {{ $t('nav.cart') }}
            <span v-if="cartStore.itemCount" class="badge">{{ cartStore.itemCount }}</span>
          </router-link>
          
          <div v-if="userStore.isLoggedIn" class="dropdown">
            <button class="dropdown-toggle">
              {{ userStore.username }}
              <span class="arrow">▼</span>
            </button>
            <div class="dropdown-menu">
              <router-link to="/account" class="dropdown-item">{{ $t('nav.account') }}</router-link>
              <router-link to="/orders" class="dropdown-item">{{ $t('nav.orders') }}</router-link>
              <a href="#" class="dropdown-item" @click.prevent="logout">{{ $t('nav.logout') }}</a>
            </div>
          </div>
          <template v-else>
            <router-link to="/login" class="nav-link">{{ $t('nav.login') }}</router-link>
            <router-link to="/register" class="nav-link">{{ $t('nav.register') }}</router-link>
          </template>
        </div>
        
        <LanguageSwitcher />
      </div>
    </nav>
  </template>
  
  <script>
  import { useCartStore } from '../stores/cart'
  import { useUserStore } from '../stores/user'
  import LanguageSwitcher from './LanguageSwitcher.vue'
  
  export default {
    name: 'NavBar',
    components: {
      LanguageSwitcher
    },
    setup() {
      const cartStore = useCartStore()
      const userStore = useUserStore()
      
      const logout = () => {
        userStore.logout()
      }
      
      return {
        cartStore,
        userStore,
        logout
      }
    }
  }
  </script>
  
  <style scoped>
  .navbar {
    background-color: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
  }
  
  .logo {
    display: flex;
    align-items: center;
    text-decoration: none;
  }
  
  .logo img {
    height: 40px;
    width: auto;
    display: block;
    object-fit: contain;
  }
  
  .nav-links {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  
  .nav-link {
    color: var(--text-color);
    text-decoration: none;
    font-weight: 500;
    position: relative;
  }
  
  .nav-link:hover {
    color: var(--primary-color);
  }
  
  .badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: var(--primary-color);
    color: white;
    font-size: 0.8rem;
    padding: 0.2rem 0.5rem;
    border-radius: 10px;
  }
  
  .dropdown {
    position: relative;
  }
  
  .dropdown-toggle {
    background: none;
    border: none;
    color: var(--text-color);
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .dropdown-toggle:hover {
    color: var(--primary-color);
  }
  
  .arrow {
    font-size: 0.8rem;
  }
  
  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: white;
    border: 1px solid var(--border-color);
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    min-width: 200px;
    display: none;
    z-index: 1000;
  }
  
  .dropdown:hover .dropdown-menu {
    display: block;
  }
  
  .dropdown-item {
    display: block;
    padding: 0.8rem 1rem;
    color: var(--text-color);
    text-decoration: none;
    transition: background-color 0.3s ease;
  }
  
  .dropdown-item:hover {
    background-color: var(--light-gray);
    color: var(--primary-color);
  }
  
  @media (max-width: 768px) {
    .nav-links {
      display: none;
    }
  }
  </style> 