import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'

Vue.use(VueRouter)

const routes = [
  //注册登陆路由，并将/请求重定向到登陆路径
  {path: '/login', component: Login},
  {path: '/', redirect: '/login'}
]

const router = new VueRouter({
  routes
})

export default router
