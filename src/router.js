import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

import Home from './views/Home.vue'
import About from './views/About.vue'
import Statistics from './views/Statistics.vue'
import Timetable from './views/Timetable.vue'
import Signup from './views/Signup.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes: [{
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: Statistics,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/timetable',
      name: 'timetable',
      component: Timetable
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
    }
  ]
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(rec => rec.meta.requiresAuth)) {
      let user = firebase.auth().currentUser
      if (user) {
        console.log('Success: ', user)
        next()
      } else {
        console.log('Fail')
        next({
          name: 'signup'
        })
      }
    }else{
      next()
    }
  })

export default router;