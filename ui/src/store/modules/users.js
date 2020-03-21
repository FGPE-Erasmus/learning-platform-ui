import axios from 'axios'
import getApiUrl from '../urls'

const state = {
  userMe: {},
  userMeProfile: {}
}
const getters = {
  getUserMe: state => state.userMe,
  getUserMeProfile: state =>state.userMeProfile
}
const mutations = {
  setUserMe: (state, user) => (state.userMe = user),
  setUserMeProfile: (state, profile) =>  (state.userMeProfile = profile)
}
const actions = {
  async fetchUserMe({ commit }) {
    const response = await axios.get(
      `/users/me`
    )

    commit('setUserMe', response.data)
    localStorage.setItem('language', response.data.interface_lang)
  },

  async fetchUserMeProfile({ commit }) {
    const response = await axios(
      {url: getApiUrl(`user/`), method: 'GET'}
    )

    commit('setUserMeProfile', response.data)
  },

  async updateUser({ commit }, data) {
    const response = await axios(
      {url: getApiUrl(`user/`), data: data, method: 'PUT'}
    )

    localStorage.setItem('language', response.data.interface_lang)

    commit('setUserMeProfile', response.data)
  }
}

export default { state, getters, mutations, actions }