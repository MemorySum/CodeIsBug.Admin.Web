import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'

// 引入ajax请求组件 设置api前缀
axios.defaults.baseURI = 'http://localhost:8099/'
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
