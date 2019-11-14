import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    role: '',
    blocId: '',
    isSystem: '',
    hiId_name: '',
    localVersion: false
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLE: (state, role) => {
      state.role = role
    },
    SET_BLOCID: (state, blocId) => {
      state.blocId = blocId
    },
    SET_ISSYSTEM: (state, isSystem) => {
      state.isSystem = isSystem
    },
    SET_HIID_NAME: (state, hiId_name) => {
      state.hiId_name = hiId_name
    },
    SET_LOCALVERSION: (state, localVersion) => {
      state.localVersion = localVersion
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password, userInfo.imgcode).then(response => {
          setToken(userInfo.token)
          commit('SET_TOKEN', userInfo.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.data
          commit('SET_NAME', data.truename)
          commit('SET_BLOCID', data.blocId)
          commit('SET_ISSYSTEM', data.issystem)
          commit('SET_ROLE', data.role)
          commit('SET_HIID_NAME', data.hiId_name)
          if (data.hiId === '440111006') {
            commit('SET_LOCALVERSION', true)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
