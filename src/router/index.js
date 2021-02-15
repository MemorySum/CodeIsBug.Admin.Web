import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import sysmenu from '../components/sysmenu/menus.vue'
import sysUsers from '../components/sysUsers/sysUsers.vue'
import sysRoles from '../components/sysroles/index.vue'
Vue.use(VueRouter)

const router = new VueRouter({
    routes: [{
            path: '/',
            redirect: {
                path: '/login'
            }
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/home',
            component: Home,
            redirect: {
                path: '/welcome'
            },
            children: [{
                    path: '/welcome',
                    component: Welcome
                },
                {
                    path: '/sysmenu',
                    component: sysmenu
                }, {
                    path: '/sysUsers',
                    component: sysUsers
                }, {
                    path: '/sysRoles',
                    component: sysRoles
                }
            ]
        }

    ]
})
router.beforeEach((to, from, next) => {
    if (to.path == '/login') return next()
    const user_access_Token = sessionStorage.getItem('user_access_Token')
    if (!user_access_Token) return next('/login')
    next()
})

const routerPush = VueRouter.prototype.push;

VueRouter.prototype.push = function push(location) {

     
    return routerPush.call(this, location).catch(error => error)

}

export default router