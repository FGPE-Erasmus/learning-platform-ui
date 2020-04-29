import axios from 'axios'

const state = {
  userMe: {},
}
const getters = {
  getUserMe: state => state.userMe,
}
const mutations = {
  setUserMe: (state, user) => (state.userMe = user),
}
const actions = {
  async fetchUserMe({ commit }) {
    const response = await axios.get(
      `/user/`
    )

    commit('setUserMe', response.data)
    localStorage.setItem('language', response.data.interface_lang)
  },

  async updateUser({ commit }, data) {
    const response = await axios.put(`user/`, data)

    localStorage.setItem('language', response.data.interface_lang)

    commit('setUserMe', response.data)
  }
}

export default { state, getters, mutations, actions }