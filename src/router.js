import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

// const Home = () => import('./views/Home.vue')
// const Statistics = () => import('./views/Statistics.vue')
// const Timetable = () => import('./views/Timetable.vue')
// const Signup = () => import('./views/Signup.vue' /* webpackPreload:true */)
// const addSubjects = () => import( './views/addSubjects.vue')
// const privacyPolicy = () => import('./views/privacyPolicy.vue')

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [{
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ './views/Home.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('./views/Statistics.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/timetable',
      name: 'timetable',
      component: () => import('./views/Timetable.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/add_subjects',
      name: 'add_subjects',
      component: () => import( './views/addSubjects.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import( './views/Settings.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('./views/Signup.vue' /* webpackPreload:true */),
    },
    {
      path: '/privacypolicy',
      name: 'privacy_policy',
      component: () => import('./views/privacyPolicy.vue'),
    },
    {
      path: '/changelog',
      name: 'changelog',
      component: () => import('./views/Changelog.vue'),
    },
    {  
      path: '/install_notes',
      name: 'installNotes',
      component: () => import('./views/installNotes.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/About.vue'),
    },
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(rec => rec.meta.requiresAuth)) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        next()
      } else {
        next({name: 'signup'})
      }
    })
  } else {
    next()
  }
})

export default router;