<template>
    <section class="featured-products">
      <div class="container">
        <h2>{{ $t('products.title') }}</h2>
        <div class="product-grid">
          <div 
            v-for="product in products" 
            :key="product.id"
            class="product-card"
          >
            <img :src="product.image" :alt="$t(`products.items.${product.id}.name`)">
            <div class="product-info">
              <h3>{{ $t(`products.items.${product.id}.name`) }}</h3>
              <p class="price">¥{{ product.price }}</p>
              <button 
                class="add-to-cart"
                @click="addToCart(product)"
              >
                {{ $t('products.addToCart') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  import { ref } from 'vue'
  import { useCartStore } from '../stores/cart'
  
  export default {
    name: 'FeaturedProducts',
    setup() {
      const cartStore = useCartStore()
      
      const products = ref([
        {
          id: 1,
          price: 299,
          image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        },
        {
          id: 2,
          price: 999,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        },
        {
          id: 3,
          price: 1999,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        },
        {
          id: 4,
          price: 599,
          image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        }
      ])
  
      const addToCart = (product) => {
        cartStore.addItem(product)
      }
      
      return {
        products,
        addToCart
      }
    }
  }
  </script>
  
  <style scoped>
  .featured-products {
    padding: 4rem 0;
  }
  
  .featured-products h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: var(--text-color);
  }
  
  .product-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
  
  .product-card {
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
  }
  
  .product-card:hover {
    transform: translateY(-5px);
  }
  
  .product-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .product-info {
    padding: 1rem;
  }
  
  .product-info h3 {
    margin: 0 0 0.5rem;
    color: var(--text-color);
  }
  
  .price {
    color: var(--primary-color);
    font-weight: bold;
    font-size: 1.2rem;
    margin: 0.5rem 0;
  }
  
  .add-to-cart {
    width: 100%;
    padding: 0.5rem;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .add-to-cart:hover {
    background-color: var(--primary-color-dark);
  }
  
  @media (max-width: 1024px) {
    .product-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 480px) {
    .product-grid {
      grid-template-columns: 1fr;
    }
  }
  </style> 