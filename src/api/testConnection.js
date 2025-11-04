import axios from 'axios';

axios.get('/api/test/')
  .then(response => {
    console.log('后端连接成功！', response.data);
  })
  .catch(error => {
    console.error('连接后端失败:', error);
  });