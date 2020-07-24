import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//引入阿里图标库
import './assets/css/iconfont/iconfont.css'
import './assets/css/font_0se29rc0hdg9/iconfont.css'
import './assets/css/font_v5zvv6kz0yc/iconfont.css'
import './assets/css/font_fwly4f38jwo/iconfont.css' //大数据两个
import './assets/css/xiangmu/iconfont.css'
//手动配置饿了么
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

//  .use给Vue配置插件
Vue.use(ElementUI)
//  给Vue原型挂载饿了么的组件
Vue.prototype.$message = ElementUI.Message//Message消息提示框
Vue.prototype.$confirm = ElementUI.MessageBox.confirm//确认提示框，例如删除操作

//导入全局样式表
import './assets/css/global.css'

//导入axios
import axios from 'axios'
Vue.prototype.axios = axios

//导入cookies
import vueCookies from 'vue-cookies'
Vue.use(vueCookies)

//配置请求拦截器，将token添加到请求头的字段
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  config.headers.Account = window.sessionStorage.getItem('username')
  return config
})
//引入百度的图表组件库echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)// = component:App
}).$mount('#app')// = el:#app

/*  小问题：1.Vue.use(x)和Vue.prototype.x区别？
           2.import和require？
 */
