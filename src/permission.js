import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
// import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权
import Layout from '@/views/layout/Layout'
const _import = require('./router/import_component')
// const whiteList = ['/login'] // 不重定向白名单
// 路由钩子
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.path === '/login') {
    // 如果是访问登录界面，如果用户会话信息存在，代表已登录过，跳转到主页
    if (getToken()) {
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    if (!getToken()) {
      // 如果访问非登录界面，且户会话信息不存在，代表未登录，则跳转到登录界面
      next({ path: '/login' })
    } else {
      // 加载动态菜单和路由
      addDynamicMenuAndRoutes(to, next)
    }
  }
})

// 加载动态菜单和路由
function addDynamicMenuAndRoutes(to, next) {
  if (store.state.app.menuRouteLoaded) {
    console.log('动态菜单和路由已经存在.')
    next()
    return
  }
  store.dispatch('GetInfo').then(res => { // 拉取user_info
    const dynamicRoutes = generateRoutesFromMenu(res.data.menus)
    router.options.routes = router.options.routes.concat(dynamicRoutes)
    console.log('路由数据')
    console.log(router.options.routes)
    router.addRoutes(router.options.routes)
    // 保存加载状态
    store.dispatch('ToggleMenuRouteLoaded', true)
    // 保存菜单树
    store.commit('setNavTree', res.data)
    next({ ...to, replace: true })
  })
}
// 菜单排序
// function menuSort(menus) {
//   const len = menus.length
//   for (let i = 0; i < len; i++) {
//     for (let j = 0; j < len - 1 - i; j++) {
//       if (menus[j].orderid > menus[j + 1].orderid) {
//         const temp = menus[j + 1]
//         menus[j + 1] = menus[j]
//         menus[j] = temp
//       }
//     }
//   }
//   return menus
// }
// 根据后台返回的菜单表生成路由表
function generateRoutesFromMenu(menus = [], routes = []) {
  menus.forEach(menu => {
    const route = {
      path: menu.url,
      component: menu.component,
      name: menu.name,
      meta: { title: menu.name, icon: menu.icon }
    }
    if (!route.path) {
      route.path = '/dashboard'
    }
    if (route.component) {
      if (route.component === 'Layout') { // Layout组件特殊处理
        route.component = Layout
      } else {
        route.component = _import(route.component) // 字符串转换为组件
        console.log(route.component)
      }
    } else {
      route.component = Layout
    }
    if (menu.isfunc === '0') {
      if (menu.subs) {
        route.children = generateRoutesFromMenu(menu.subs)
      }
      if (route.children && route.children.length === 0) {
        delete route.children
      }
      if (route.meta.title === '报表管理') {
        route.hidden = true
      }
      routes.push(route)
    }
  })
  return routes
}

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
