<template>
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h2>{{ $t('hero.title') }}</h2>
          <p>{{ $t('hero.subtitle') }}</p>
          <router-link to="/category/all" class="btn btn-primary">
            {{ $t('hero.explore') }}
          </router-link>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    name: 'HeroSection'
  }
  </script>
  
  <style scoped>
  .hero {
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
                url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80');
    background-size: cover;
    background-position: center;
    height: 500px;
    display: flex;
    align-items: center;
    color: white;
    text-align: center;
  }
  
  .hero-content {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .hero-content h2 {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .hero-content p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
  }
  
  .hero-content .btn {
    font-size: 1.1rem;
    padding: 1rem 2rem;
  }
  
  @media (max-width: 768px) {
    .hero {
      height: 400px;
    }
    
    .hero-content h2 {
      font-size: 2rem;
    }
    
    .hero-content p {
      font-size: 1rem;
    }
  }
  </style> 