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


let token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
}

axios.defaults.baseURL = settings.fpge

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
    if (error.config.url === 'http://fgpe.dcc.fc.up.pt:80/api/auth/refresh') {
      localStorage.removeItem('token')
      router.push('/')

      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
    // Try refresh token if 'unauthorized'
    if (error.response.status === 401) {
      return new Promise((resolve, reject) => {
        axios
          .post('/auth/refresh', { refreshToken: localStorage.getItem('refreshToken') })
          .then(response => {
            localStorage.setItem('token', response.data.accessToken)
            localStorage.setItem('refreshToken', response.data.refreshToken)
            resolve(response.data.accessToken);
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
      next({ name: 'login' })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresLogged)) {
    if (store.getters.isAuthenticated) {
      next({ name: 'login' })
    } else {
      next()
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





