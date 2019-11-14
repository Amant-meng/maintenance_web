import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop',
    menuRouteLoaded: false,
    unReadNum: 0
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    menuRouteLoaded(state, menuRouteLoaded) { // 改变菜单和路由的加载状态
      state.menuRouteLoaded = menuRouteLoaded
    },
    unReadNum(state, num) { // 改变未读消息数量
      state.unReadNum = num
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    CloseSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    ToggleMenuRouteLoaded({ commit }, menuRouteLoaded) {
      commit('menuRouteLoaded', menuRouteLoaded)
    },
    ToggleUnReadNum({ commit }, num) {
      commit('unReadNum', num)
    }
  }
}

export default app
