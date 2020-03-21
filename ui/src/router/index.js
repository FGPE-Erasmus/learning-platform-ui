import Vue from 'vue'
import Router from 'vue-router'
import IDE from '@/components/IDE.vue'
import lessons from '@/components/Lessons.vue'
import login from '@/components/login.vue'
import register from '@/components/register.vue'
import profile from '@/components/profile.vue'
import profileEdit from '@/components/profileEdit.vue'
import App from '@/App.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',

  routes: [
    {
      path: '/projects',
      component: App,
      name: 'projects',
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: ':projectId/lessons/:lessonsId',
          component: lessons
        },
        {
          path: ':projectId/',
          component: lessons
        },
        {
          path: ':projectId/exercises/:exercisesId',
          component: IDE
        },
        {
          path: ':projectId/lessons/:lessonsId/challenge/:challengeId/exercise/:exercisesId',
          component: IDE
        },
        {
          path: 'profile',
          component: profile,
          name: 'profile'
        },
        {
          path: 'profile/edit',
          component: profileEdit,
          name: 'profileEdit'
        }
      ]
    },
    {
      path: '/',
      component: login,
      name: 'login'
    },
    {
      path: '/register',
      component: register,
      name: 'register'
    },
  ]
})

export default router
