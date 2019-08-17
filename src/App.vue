<template>
  <v-app :dark="dark">
    <Navbar></Navbar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-bottom-nav app fixed value="true">
      <div v-for="nav in bottomNav" :key="nav.name">
        <v-btn color="teal" flat router v-bind:to="nav.link">
        <span>{{ nav.name }}</span>
        <v-icon>{{ nav.icon }}</v-icon>
      </v-btn>
      </div>
    </v-bottom-nav>
  </v-app>
</template>

<script>
// const Navbar = () => import('./components/Navbar.vue')
import Navbar from "./components/Navbar";
export default {
  name: "App",
  components: {
    Navbar
  },
  data() {
    return {
      dark: true,
      bottomNav: [
        {name: 'Home', icon: 'home', link: '/'},
        {name: 'Statistics', icon: 'insert_chart', link: 'statistics'},
        {name: 'Timetable', icon: 'today', link: 'timetable'},
        {name: 'Subjects', icon: 'book', link: 'add_subjects'},
      ]
    };
  }
};
</script>

<style>
* {
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none;
}
</style>