import Vue from 'vue'
import './plugins/axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import './assets/iconfont/iconfont.css'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import iconPicker from 'e-icon-picker'
import 'element-ui/lib/theme-chalk/icon.css' // element-ui 图标库
import 'e-icon-picker/dist/symbol.js' // 基本彩色图标库
import 'e-icon-picker/dist/index.css' // 基本样式，包含基本图标
import 'font-awesome/css/font-awesome.min.css' // font-awesome 图标库

// 统一处理token请求头信息
axios.interceptors.request.use(config => {
    const user_access_Token = sessionStorage.getItem('user_access_Token')
    config.headers.Authorization = 'Bearer ' + user_access_Token
    return config
}, error => {
    return Promise.reject(error)
})


axios.interceptors.response.use(response => {
    if (response.status === 200) {

    }
    return response;
}, error => {

    if (error.response.status === 401) {
        // iView.Message.warning('未获取到登录状态');
        router.push({
            name: '/login'
        });

    }
    return Promise.resolve(error.response);
});


// 引入ajax请求组件 设置api前缀
Vue.prototype.$http = axios
axios.defaults.baseURL = 'api'
axios.defaults.headers.post['Content-Type'] = 'application/json'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(iconPicker, {
    ElementUI: true,
    eIcon: true,
    FontAwesome: true,
    eIconSymbol: true
})
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')