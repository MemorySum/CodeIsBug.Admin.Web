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

axios.interceptors.request.use(config => {

  let user_access_Token = sessionStorage.getItem('user_access_Token')
  config.headers.Authorization = 'Bearer ' + user_access_Token
  return config
}, error => {
  return Promise.reject(error)
})


// 引入ajax请求组件 设置api前缀
Vue.prototype.$http = axios
axios.defaults.baseURL = 'api'
axios.defaults.headers.post['Content-Type'] = 'application/json';

Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
