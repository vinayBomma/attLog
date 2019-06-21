<template>
  <nav>
    <v-toolbar flat app>
      <v-toolbar-side-icon v-on:click="drawer = !drawer"></v-toolbar-side-icon>
      <!-- <v-toolbar-title>Test</v-toolbar-title> -->
      <v-spacer></v-spacer>
      <v-btn v-if="isUser === false">
        <img src="../../public/google.png" class="mr-2">Sign In</v-btn>
    </v-toolbar>

    <v-navigation-drawer v-model="drawer" app>
      <v-layout align-start justify-end row class="pa-3">
        <v-icon v-if="isUser === true" v-on:click="googleLogout">exit_to_app</v-icon>
      </v-layout>

      <v-layout column align-center v-if="userPhoto">
        <v-flex class="mt-5">
          <v-avatar size="100">
            <img :src="userPhoto">
          </v-avatar>
        </v-flex>
      </v-layout>

      <v-layout column align-center v-if="userName">
        <v-flex class="mt-2 mb-2">
          <p>Welcome, {{ userName }}</p>
        </v-flex>
      </v-layout>

      <v-divider v-if="isUser"></v-divider>

      <v-list>
        <v-list-tile v-for="(link, j) in links" :key="j" router v-bind:to="link.route">
          <v-list-tile-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ link.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <!-- <v-list-tile v-for="link in links" v-bind:key="link.text" router v-bind:to="link.route">
          <v-list-tile-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="grey--text">{{ link.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>-->
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import firebase from "firebase";
export default {
  data() {
    return {
      drawer: false,
      isUser: null,
      userPhoto: null,
      userName: null,
      links: []
    };
  },
  methods: {
    googleLogout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push({ name: "signup" });
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("User Logged In");
        this.isUser = true;
        this.userPhoto = user.photoURL;
        this.userName = user.displayName;

        this.links = [
          { icon: "home", text: "Home", route: "/" },
          { icon: "insert_chart", text: "Statistics", route: "statistics" },
          { icon: "calendar_today", text: "Timetable", route: "timetable" },
          { icon: "add", text: "Add Subjects", route: "add_subjects" },
          { icon: "settings", text: "Settings", route: "settings" },
        ];
      } else {
        console.log("User not logged in");
        this.isUser = false;
        this.userPhoto = null;
        this.userName = null;

        this.links = [
          { icon: "account_circle", text: "Sign In", route: "signup" }
        ];
      }
    });
  }
};
</script>

