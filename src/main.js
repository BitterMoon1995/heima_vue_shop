import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//引入阿里图标库
import './assets/css/iconfont/iconfont.css'
import './assets/css/font_0se29rc0hdg9/iconfont.css'
import './assets/css/font_v5zvv6kz0yc/iconfont.css'
//  手动配置饿了么
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//  .use给Vue配置插件
Vue.use(ElementUI)
//  给Vue原型挂载饿了么的组件
Vue.prototype.$message=ElementUI.Message//Message消息提示框
Vue.prototype.$confirm=ElementUI.MessageBox.confirm//确认提示框，例如删除操作

//导入全局样式表
import './assets/css/global.css'

//导入axios
import axios from 'axios'
Vue.prototype.axios = axios
// axios.defaults.baseURL='http://localhost:2020/evenstar'

//配置请求拦截器，将token添加到请求头的字段
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})
//

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)// = component:App
}).$mount('#app')// = el:#app
