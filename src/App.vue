<template>
  <v-app :dark="dark">
    <Navbar></Navbar>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
// const Navbar = () => import('./components/Navbar.vue')
import Navbar from './components/Navbar'
export default {
  name: 'App',
  components: {
    Navbar,
  },
  data () {
    return {
      dark: true
    }
  }
}
</script>

<style>
*{
  -webkit-user-select: none; /* Safari */        
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; 
}
</style>