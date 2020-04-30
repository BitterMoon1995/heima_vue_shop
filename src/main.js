import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//导入饿了么
// import './plugins/element.js'

//  手动配置饿了么
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//  .use给Vue配置插件
Vue.use(ElementUI)

//导入全局样式表
import './assets/css/global.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)// = component:App
}).$mount('#app')// = el:#app
