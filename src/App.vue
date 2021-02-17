<template>
  <v-app v-bind:dark="nightMode">
    <!-- <Navbar v-on:changeMode="switchMode($event)"></Navbar> -->
    <Navbar></Navbar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-bottom-nav v-if="$route.name !== 'signup' && $route.name !== 'privacy_policy' && $route.name !== 'changelog' && $route.name !== 'about' && $route.name !== 'installNotes'" app fixed value="true">
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
// import db from "./configFirebase";

const Navbar = () => import("./components/Navbar");

export default {
  name: "App",
  components: {
    Navbar
  },
  data() {
    return {
      nightMode: true,
      bottomNav: [
        { name: "Home", icon: "home", link: "/" },
        { name: "Statistics", icon: "insert_chart", link: "statistics" },
        // { name: "Duels", icon: "../public/duel.png", link: "duels" },
        { name: "Timetable", icon: "today", link: "timetable" },
        { name: "Subjects", icon: "book", link: "add_subjects" }
      ]
    };
  },
  methods: {
    // switchMode(mode) {
    //   this.nightMode = mode;
    // }
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
input {
  -webkit-user-select: text;
}
</style>