import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from "../components/Home"
import Welcome from "../components/Welcome"
import Authorization from "../components/user/Authorization"
import Client from "../components/user/Client";
import Scene from "../components/project/Scene";
import Route from "../components/project/Route";
import Activity from "../components/project/Activity";
import StickyScene from "../components/sticky/StickyScene";
import StickyRoute from "../components/sticky/StickyRoute";
import StickyActivity from "../components/sticky/StickyActivity";
import Homepage from "../components/pageManage/Homepage";

Vue.use(VueRouter)

const routes = [
  //注册登陆路由，并将/请求重定向到登陆路径
  {path: '/login', component: Login},
  {path: '/', redirect: '/login'},

  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {path: '/welcome', component: Welcome},
      {
        path: '/authorization',
        component: Authorization
      },
      {
        path: '/client',
        component: Client
      },
      {
        path: '/scene',
        component: Scene
      },
      {
        path: '/route',
        component: Route
      },
      {
        path: '/activity',
        component: Activity
      },
      {
        path: '/stickyScene',
        component: StickyScene
      },
      {
        path: '/stickyRoute',
        component: StickyRoute
      },
      {
        path: '/stickyActivity',
        component: StickyActivity
      },
      {
        path: '/homepage',
        component: Homepage
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //访问登录页，直接放行
  if (to.path === '/login') return next()
  //访问权限页，则先尝试提取token
  let token = window.sessionStorage.getItem('token')
  //无token，重定向到登录页
  if (!token) return next('/login')
  //有token，放行
  next()
})

export default router
