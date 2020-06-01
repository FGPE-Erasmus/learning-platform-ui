import Vue from 'vue'
import Router from 'vue-router'

import emailConfirmation from '@/components/emailConfirmation.vue'
import IDE from '@/components/ide.vue'
import lessons from '@/components/lessons.vue'
import login from '@/components/login.vue'
import oauth from '@/components/oauth.vue'
import register from '@/components/register.vue'
import profile from '@/components/profile.vue'
import profileEdit from '@/components/profileEdit.vue'
import projects from '@/components/projects.vue'
import admin from '@/components/admin.vue'
import App from '@/App.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',

  routes: [
    {
      path: '/',
      component: App,
      name: 'projects',
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: 'projects/',
          component: projects,
          name: 'projectsList'
        },
        {
          path: 'projects/:projectId/lessons/:lessonsId',
          component: lessons
        },
        {
          path: 'projects/:projectId/',
          component: lessons
        },
        {
          path: 'projects/:projectId/exercises/:exercisesId',
          component: IDE
        },
        {
          path: 'projects/:projectId/lessons/:lessonsId/challenge/:challengeId/exercise/:exercisesId',
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
      path: '/login',
      component: login,
      name: 'login'
    },
    {
      path: '/register',
      component: register,
      name: 'register'
    },
    {
      path: '/emailConfirmation/:confirmToken',
      component: emailConfirmation,
      name: 'emailConfirmation'
    },
    {
      path: '/oauth/:platform/',
      component: oauth,
      name: 'oauthLogin'
    },
    {
      path: '/admin',
      component: admin,
      name: 'admin',
      meta: {
        //requiresAuth: true,
        requiresAdmin: true,
      },
    },
  ]
})

export default router
