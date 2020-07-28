import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'
import sysmenu from '../views/sysmenu/menus.vue'
import sysUsers from '../views/sysUsers/sysUsers.vue'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
      path: '/',
      redirect: {
        path: '/login'
      },
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect:{
        path:'/welcome'
      },
      children:[
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/sysmenu',
          component: sysmenu
        },{
          path: '/sysUsers',
          component: sysUsers
        }
      ]
    }

  ]
})
router.beforeEach((to, from, next) => {
   if (to.path == '/login') return next()
   let user_access_Token = sessionStorage.getItem('user_access_Token')
   if (!user_access_Token) return next('/login')
  next()
})


const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}
export default router
