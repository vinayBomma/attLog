import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/Home.vue'
import About from './views/About.vue'
import Statistics from './views/Statistics.vue'
import Timetable from './views/Timetable.vue'
import Signup from './views/Signup.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: (to, from, next) => {
        console.log(to)
        console.log(from)
        next()
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
      component: Statistics
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
      beforeEnter: (to, from, next) => {
        console.log(to)
        console.log(from)
        next()
      }
    }
  ]
})

// router.beforeEach((to, from, next) => {
//   if(to.path === '/'){
//     if(from.path === '/about'){
//       next('/signup')
//     }
    
//   }
// })

export default router;
