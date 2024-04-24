import {login, logout, getInfo, addUser} from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    username: '',
    avatar: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const TAG = '====sea====/modules/user.js====> '

const actions = {
  // user login
  login({ commit }, userInfo) {
    console.log(TAG + 'login() --> userInfo:' + JSON.stringify(userInfo))
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response // 请求后端登录接口成功后返回的响应数据
        console.log(TAG + 'login() --> data:' + JSON.stringify(data))
        commit('SET_TOKEN', data.token) // 将token保存到VueX(一个专门用于状态管理的库)
        setToken(data.token) // 将token保存到本地存储
        resolve() // 表示Promise成功执行
      }).catch(error => {
        reject(error) // 表示Promise执行失败
      })
    })
  },

  // user register
  register({ commit }, userInfo) {
    console.log(TAG + 'register() --> userInfo:' + JSON.stringify(userInfo))
    const { username, password, email, phone} = userInfo
    return new Promise((resolve, reject) => {
      addUser({ username: username.trim(), password: password, email: email, phone: phone }).then(response => {
        const { data } = response // 请求后端登录接口成功后返回的响应数据
        console.log(TAG + 'register() --> data:' + JSON.stringify(data))
        resolve() // 表示Promise成功执行
      }).catch(error => {
        reject(error) // 表示Promise执行失败
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        console.log(TAG + 'data: ' + JSON.stringify(data))

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, username, avatar } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          console.log(TAG + 'roles: ' + JSON.stringify(roles) + '  roles.length: ' + roles.length)
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_USERNAME', username)
        commit('SET_AVATAR', avatar)
        resolve(data)
        console.log(TAG + ' getInfo成功！')
      }).catch(error => {
        console.log(TAG + ' getInfo出现异常！')
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(response => {
        console.log(TAG + 'response: ' + JSON.stringify(response))
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        console.log(TAG + 'error: ' + JSON.stringify(error))
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

