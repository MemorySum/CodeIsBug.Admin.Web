import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () =>
    import ( /* webpackChunkName: 'Index' */ '../view/Login.vue')
const Home = () =>
    import ( /* webpackChunkName: 'Index' */ '../view/Home.vue')
const Welcome = () =>
    import ( /* webpackChunkName: 'Index' */ '../view/Welcome.vue')

const sysmenu = () =>
    import ( /* webpackChunkName: 'sysmenu' */ '../view/sysmenu/index.vue')

const sysUsers = () =>
    import ( /* webpackChunkName: 'sysUsers' */ '../view/sysUsers/index.vue')

const sysRoles = () =>
    import ( /* webpackChunkName: 'sysRoles' */ '../view/sysroles/index.vue')

const sysUserRoleComparison = () =>
    import ( /* webpackChunkName: 'sysUserRoleComparison' */ '../view/sysUserRoleComparison/index.vue')

const SysRoleMenuComparison = () =>
    import ( /* webpackChunkName: 'SysRoleMenuComparison' */ '../view/SysRoleMenuComparison/index.vue')

const cityInfo = () =>
    import ( /* webpackChunkName: 'cityInfo' */ '../view/CityInfo/index.vue')

const EmailSmtpSetting = () =>
    import ( /* webpackChunkName: 'EmailSmtpSetting' */ '../view/EmailSmtpSetting/index.vue')

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
                }, {
                    path: '/EmailSmtpSetting',
                    component: EmailSmtpSetting
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