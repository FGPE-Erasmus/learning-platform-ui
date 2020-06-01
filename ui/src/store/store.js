import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

import courses from './modules/courses'
import exercises from './modules/exercises'
import users from './modules/users'


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 0,
    project: '',
    project_id: '',
    lesson:'',
    challenge:'',
    challenge_description:'',
    module:'',
    exercise:[],
    status: '',
    token: localStorage.getItem('token') || '',
    badge: '',
    email: '',
    interface_lang: '',
    level: '',
    points: '',
    time_spent: '',
    ui_color: '',
    static_correctors_path: '',
    validator_instructions: [],
    tests_path: '',
    tests_array: [],
    sortedInout: [],
    exercisesWithinChallenge: [],
    exercisesWithinModule: [],
    exerciseIndex: 0,
    moduleIndex: 0,
    currentMeta: {},
    currentProject: '',
  },

  mutations: {
    auth_request(state){
    state.status = 'loading'
  },
  auth_success(state, token){
    state.status = 'success'
    state.token = token
  },
  auth_error(state){
    state.status = 'error'
  },
  logout(state){
    state.status = ''
    state.token = ''
  },
  update_profile(state,user){
    state.badge = user.badge
    state.email = user.email
    state.interface_lang = user.interface_lang
    state.level = user.level
    state.points = user.points
    state.time_spent = user.time_spent
    state.ui_color = user.ui_color
  }
  },

  actions: {
    logout({commit}){
      return new Promise((resolve, reject) => {
        commit('logout')
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
        resolve()
      })
    },

    register({commit}, user){
      let who = user
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios.post('auth/register/', user)
        .then(resp => {
          const token = resp.data.accessToken
          const user = who
          localStorage.setItem('token', token)
          commit('auth_success', token, user)
          resolve(resp)
        })
        .catch(err => {
          commit('auth_error')
          localStorage.removeItem('token')
          reject(err)
        })
      })
    },

    login({commit}, user){
      let who = user
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios.post('auth/login/', user)
        .then(resp => {
          const token = resp.data.accessToken
          const user = who
          localStorage.setItem('token', token)
          localStorage.setItem('refreshToken', resp.data.refreshToken)
          commit('auth_success', token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
          resolve(resp)
        })
        .catch(err => {
        commit('auth_error')
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        reject(err)
      })
      })
    },

    oauthLogin({ commit }, data) {
      localStorage.setItem('token', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)

      commit('auth_success', data.accessToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
    }
  },

  getters : {
    isAuthenticated: state => !!state.token
  },

  modules: {
    courses,
    exercises,
    users
  }
})
