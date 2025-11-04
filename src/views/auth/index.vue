<template>
    <div class="auth-page min-h-screen flex items-center justify-center">
        <div class="container" :class="{ 'right-panel-active': isRightPanelActive }">
            <!-- 注册框 -->
            <div class="container__form container--signup">
                <form @submit.prevent="handleSignUp" class="form">
                    <h2 class="form__title">{{ $t('auth.register') }}</h2>
                    <input 
                        v-model="signUpForm.username" 
                        type="text" 
                        :placeholder="$t('auth.usernamePlaceholder')"
                        :title="$t('auth.usernameTip')"
                        pattern="^[a-zA-Z0-9]+$"
                        class="input" 
                        required 
                    />
                    <input 
                        v-model="signUpForm.account" 
                        type="text" 
                        :placeholder="$t('auth.account')" 
                        class="input" 
                        required 
                    />
                    <input 
                        v-model="signUpForm.password" 
                        type="password" 
                        :placeholder="$t('auth.password')" 
                        class="input" 
                        required 
                    />
                    <button class="btn" type="submit">{{ $t('auth.registerButton') }}</button>
                </form>
            </div>

            <!-- 登录框 -->
            <div class="container__form container--signin">
                <form @submit.prevent="handleSignIn" class="form">
                    <h2 class="form__title">{{ $t('auth.login') }}</h2>
                    <input v-model="signInForm.account" type="text" :placeholder="$t('auth.account')" class="input" required />
                    <input v-model="signInForm.password" type="password" :placeholder="$t('auth.password')" class="input" required />
                    <button class="btn" type="submit">{{ $t('auth.loginButton') }}</button>
                </form>
            </div>

            <div class="container__overlay">
                <div class="overlay">
                    <div class="overlay__panel overlay--left">
                        <button class="btn" @click="togglePanel(false)">{{ $t('auth.haveAccount') }}</button>
                    </div>
                    <div class="overlay__panel overlay--right">
                        <button class="btn" @click="togglePanel(true)">{{ $t('auth.noAccount') }}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../stores/user';
import { auth } from '../../api/user';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();
const isRightPanelActive = ref(false);
// //修改登陆失败问题
// const errorMessage = ref('');

// onMounted(() => {
//   // 页面加载时强制重置状态
//   errorMessage.value = '';
// });
// //修改登陆失败问题结束

const signUpForm = reactive({
    username: '',
    account: '',
    password: ''
});

const signInForm = reactive({
    account: '',
    password: ''
});

const togglePanel = (isRight) => {
    isRightPanelActive.value = isRight;
};

const handleSignUp = async () => {
    try {
        await auth({
            action: 'register',
            username: signUpForm.username,
            account: signUpForm.account,
            password: signUpForm.password
        });
        ElMessage.success(t('auth.registerSuccess'));
        togglePanel(false); // 切换到登录面板
    } catch (error) {
        // 错误处理已在请求拦截器中完成
    }
};

const handleSignIn = async () => {
    try {


        const response = await auth({
            action: 'login',
            account: signInForm.account,
            password: signInForm.password
        });

        console.log('登录响应:', response);

        // 检查响应格式
        if (response.data.error) {
        console.error('后端返回的错误信息:', response.data.error); // 在控制台输出后端错误信息
        switch (response.data.error) {
            case 'The account does not exist':
            ElMessage.error(t('auth.loginError.userNotFound'));
            break;
            case 'wrong password':
            ElMessage.error(t('auth.loginError.invalidPassword'));
            break;
            default:
            ElMessage.error(t('auth.loginError.default'));
        }
        return;
        }
        
        // ✅ 关键修改点：确保存储的是有效的 Token（不带 "Bearer" 前缀）
        const accessToken = response.data.access.replace(/^Bearer\s+/i, ''); // 假设后端返回的 Token 字段是 access
        if (!accessToken) {
            throw new Error('Token 未返回');
        }
        // 第三次存储到 localStorage
        localStorage.setItem('token', accessToken);
        userStore.setUser({ token: accessToken }); // Pinia 也存储原始Token
        console.log('Token 已存储:', accessToken?.slice(0, 10) + '...'); // 调试用
        // 存储用户信息
        await userStore.setUser({
            token: accessToken,
            refreshToken: response.data.refresh,
            username: response.data.username || signInForm.account,
            account: signInForm.account,
            userId: response.data.userId
        });


    ElMessage.success(t('auth.loginSuccess'));
    await router.push('/home');
  } catch (error) {
    console.error('登录错误:', error); // 在控制台输出错误信息
    ElMessage.error(t('auth.loginError.default')); // 显示前端设置的通用错误信息
  }
};
</script>

<style scoped>
.auth-page {
    background: url('../../assets/背景.png') no-repeat center center fixed;
    background-size: cover;
    position: relative;
}

.auth-page::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4); /* 添加一个半透明的遮罩，使背景不那么刺眼 */
    z-index: 0;
}

.container {
    position: relative;
    width: 850px;
    height: 550px;
    max-width: var(--max-width);
    max-height: var(--max-height);
    background-color: rgba(233, 233, 233, 0.95); /* 稍微增加透明度 */
    border-radius: var(--button-radius);
    box-shadow: 0 0.9rem 1.7rem rgba(0, 0, 0, 0.3);
    overflow: hidden;
    z-index: 1; /* 确保登录框在遮罩层上面 */
}

.container__form {
    position: absolute;
    top: 0;
    height: 100%;
    transition: all 0.6s ease-in-out;
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container__form h2 {
  color: #333;
}

.container--signin {
    left: 0;
    z-index: 2;
    opacity: 1;
    transition: transform 0.6s ease-in-out, opacity 0.6s;
}

.container--signup {
    left: 0;
    opacity: 0;
    z-index: 1;
    pointer-events: none;
    transition: transform 0.6s ease-in-out, opacity 0.6s;
}

.container.right-panel-active .container--signup {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(100%);
    z-index: 5;
}

.container.right-panel-active .container--signin {
    opacity: 0;
    pointer-events: none;
    transform: translateX(100%);
}

.container__overlay {
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: transform 0.6s ease-in-out;
    z-index: 100;
}

.container.right-panel-active .container__overlay {
    transform: translateX(-100%);
}

.overlay {
    position: relative;
    left: -100%;
    height: 100%;
    width: 200%;
    background: url(../../assets/背景.png) fixed center/cover;
    transition: transform 0.6s ease-in-out;
    backdrop-filter: blur(8px); /* 添加模糊效果 */
}

.container.right-panel-active .overlay {
    transform: translateX(50%);
}

.overlay__panel {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 50%;
    height: 100%;
    text-align: center;
    transition: transform 0.6s ease-in-out;
}

.overlay--left {
    transform: translateX(-20%);
}

.overlay--right {
    right: 0;
    transform: translateX(0);
}

.container.right-panel-active .overlay--left {
    transform: translateX(0);
}

.container.right-panel-active .overlay--right {
    transform: translateX(20%);
}

.form {
    padding: 0 3rem;
    width: 100%;
    text-align: center;
}

.form__title {
    font-weight: 500;
    margin: 0 0 1.25rem;
    color: var(--gray);
    text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.5);
    text-align: center;
    font-size: 1.2rem;
}

.input {
    background-color: rgba(232, 227, 227, 0.9);
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 0.9rem;
    margin: 0.5rem 0;
    width: 100%;
    color: var(--gray);
    border-radius: 4px;
    transition: all 0.3s ease;
}

.input:focus {
    outline: none;
    border-color: var(--blue);
    box-shadow: 0 0 0 2px rgba(3, 103, 166, 0.1);
}

.btn {
    background-color: #0056b3;
    background-image: linear-gradient(90deg, #0056b3 0%, #007bff 74%);
    border: none;
    color: white;
    cursor: pointer;
    font-size: 0.7rem;
    padding: 0.8rem 3.5rem;
    border-radius: 20px;
    text-transform: uppercase;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    background-image: linear-gradient(90deg, #004494 0%, #0056b3 74%);
}

@keyframes show {
  0%, 49.99% { opacity: 0; z-index: 1; }
  50%, 100% { opacity: 1; z-index: 5; }
}
</style> 