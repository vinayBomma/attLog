import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

// import Home from './views/Home.vue'
// import Statistics from './views/Statistics.vue'
// import Timetable from './views/Timetable.vue'
// import Signup from './views/Signup.vue'
// import addSubjects from './views/addSubjects.vue'

const Home = () => import(/* webpackChunkName: "home" */ './views/Home.vue')
const Statistics = () => import(/* webpackChunkName: "stats" */ './views/Statistics.vue')
const Timetable = () => import(/* webpackChunkName: "timetable" */ './views/Timetable.vue')
const Signup = () => import(/* webpackChunkName: "signup" */ './views/Signup.vue')
const addSubjects = () => import(/* webpackChunkName: "addSub" */ './views/addSubjects.vue')
const privacyPolicy = () => import('./views/privacyPolicy.vue')

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
      component: Timetable,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/add_subjects',
      name: 'add_subjects',
      component: addSubjects,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
    },
    {
      path: '/privacypolicy',
      name: 'privacy_policy',
      component: privacyPolicy,
    },
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(rec => rec.meta.requiresAuth)) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        next()
      } else {
        console.log('Fail')
        next({  
          name: 'signup'
        })
      }
    })
  } else {
    next()
  }
})

export default router;