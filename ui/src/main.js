import Vue from "vue";
import App from "@/App.vue";
import router from './router'
import VueCodeMirror from 'vue-codemirror'
import axios from 'axios'
import moment from 'moment'
import store from './store/store'
import index from '@/index.vue'
import i18n from '@/plugins/i18n'
import settings from './settings'


Vue.config.productionTip = false;

Vue.use(VueCodeMirror)
Vue.component('codemirror', VueCodeMirror);
Vue.prototype.$http = axios;
Vue.prototype.moment = moment

import $store from "./store/store";
import { mapGetters, mapActions } from "vuex"


let token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
}
axios.defaults.baseURL = settings.api

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Accept'] = 'application/json'

axios.interceptors.response.use((response) => {
    // Return a successful response back to the calling service
    return response;
  }, (error) => {
  // Return any error which is not due to authentication back to the calling service
  if (error.response) {
    if (error.response.status !== 401) {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
    // Logout if there is problem with token refresh
    if (error.config.url === `${settings.api}auth/refresh`) {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      router.push('/')

      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
    // Try refresh token if 'unauthorized'
    if (error.response.status === 401) {
      return new Promise((resolve, reject) => {
        let refreshToken = localStorage.getItem('refreshToken')

        let data = {
          refreshToken: refreshToken,
          grant_type: "refresh_token"
        }
        axios
          .post(`/auth/token/refresh/`, data, {headers: {
            Authorization: `Bearer ${refreshToken}`,
          }})
          .then(response => {
            localStorage.setItem('token', response.data.accessToken)
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
            localStorage.setItem('refreshToken', response.data.refreshToken)
          })
          .catch((error) => {
            reject(error);
          });
      });
    }
  }
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isAuthenticated) {
      const loginPath = window.location.pathname
      router.push({ name: 'login', query: { redirect: loginPath } })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresLogged)) {
    if (store.getters.isAuthenticated) {
      router.push({ name: 'login', query: { redirect: loginPath } })
    } else {
      next()
    }
  } else if(to.matched.some(record => record.meta.requiresAdmin)){
      if (!store.getters.isAuthenticated) {
      const loginPath = window.location.pathname
      router.push({ name: 'login', query: { redirect: loginPath } })
    } else if(store.getters.getUserMe.is_admin === undefined) {
      store.dispatch('fetchUserMe').then(() => {
        if(store.getters.getUserMe.is_admin === true){
          next()
        }else{
          const loginPath = window.location.pathname
          router.push({ name: 'login', query: { redirect: loginPath } })
        }
      });
    }else{
      if(store.getters.getUserMe.is_admin === true){
          next()
        }else{
          const loginPath = window.location.pathname
          router.push({ name: 'login', query: { redirect: loginPath } })
        }
    }
  } else {
    next()
  }
})

new Vue({
  i18n,
  router,
  store,
  VueCodeMirror,
  render: h => h(index)
}).$mount("#app");
