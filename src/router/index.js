import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'

const Login = () =>
    import ('../view/Login.vue')
const Home = () =>
    import ('../view/Home.vue')
const Welcome = () =>
    import ('../view/Welcome.vue')

const sysmenu = () =>
    import ('../view/sysmenu/index.vue')

const sysUsers = () =>
    import ('../view/sysUsers/index.vue')

const sysRoles = () =>
    import ('../view/sysroles/index.vue')

const sysUserRoleComparison = () =>
    import ('../view/sysUserRoleComparison/index.vue')

const SysRoleMenuComparison = () =>
    import ('../view/SysRoleMenuComparison/index.vue')

const cityInfo = () =>
    import ('../view/CityInfo/index.vue')
const syserrorlog = () =>
    import ('../view/SysErrorLog/index.vue')

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
                }, {
                    path: '/sysUserRoleComparison',
                    component: sysUserRoleComparison
                }, {
                    path: '/cityInfo',
                    component: cityInfo
                }, {
                    path: '/SysRoleMenuComparison',
                    component: SysRoleMenuComparison
                },
                {
                    path: '/syserrorlog',
                    component: syserrorlog
                }

            ]
        }

    ]
})
router.beforeEach((to, from, next) => {
    if (to.path == '/login') return next()
    const user_access_Token = sessionStorage.getItem('user_access_Token')
    if (!user_access_Token) {
        ElementUI.Message.error('登录过期，请重新登录')
        sessionStorage.clear();
        return next('/login')

    }
    next()
})

const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error)

}

export default router