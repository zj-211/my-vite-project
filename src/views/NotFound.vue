<template>
  <div class="not-found">
    <h1>404 页面不存在</h1>
    <p>您访问的页面可能已被删除或地址错误。</p>
    <router-link to="/home" class="back-home">返回首页</router-link>
  </div>
</template>

<script setup>
</script>

<style scoped>
.not-found {
  text-align: center;
  margin-top: 150px;
  color: #333;
}
h1 {
  font-size: 40px;
  color: #42b983;
}
p {
  margin: 20px 0;
  font-size: 16px;
}
.back-home {
  display: inline-block;
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border-radius: 5px;
  text-decoration: none;
}
.back-home:hover {
  background-color: #359e6d;
}
</style>
