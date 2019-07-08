<template>
  <nav>
    <v-toolbar flat app>
      <v-toolbar-side-icon v-on:click="drawer = !drawer"></v-toolbar-side-icon>
      <!-- <v-toolbar-title>Test</v-toolbar-title> -->
      <v-spacer></v-spacer>
      <v-btn v-if="isUser === false">
        <img src="../../public/google.png" class="mr-2">Sign In
      </v-btn>

      <template v-if="$route.name === 'home'">
        <v-dialog v-model="modal" :return-value.sync="date" lazy full-width width="290px">
          <template v-slot:activator="{ on }">
            <v-icon v-model="date" v-on="on">today</v-icon>
          </template>
          <v-date-picker v-model="date">
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="saveDate">OK</v-btn>
          </v-date-picker>
        </v-dialog>
      </template>

      <template v-if="$route.name === 'timetable'">
        <v-icon class="mr-4" @click="restore">restore</v-icon>
        <v-icon @click="deleteSub">delete_outline</v-icon>
      </template>

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

        <v-divider v-if="isUser"></v-divider>

        <v-list-tile>
          <v-list-tile-action>
            <v-icon>brightness_3</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Night Mode</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-switch></v-switch>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import firebase from "firebase";
import { bus } from "../main";

export default {
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      currentDate: null,
      currentMonth: null,
      currentFullDate: null,
      currentYear: null,
      modal: false,
      drawer: false,
      isUser: null,
      userPhoto: null,
      userName: null,
      disIcon: null,
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
    },
    saveDate() {
      let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ];
      let months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec"
      ];

      let obj = {}

      this.currentMonth = months[new Date(this.date).getMonth()]
      this.currentDate = new Date(this.date).getDate();
      this.currentYear = new Date(this.date).getFullYear();
      this.currentFullDate = this.date
      this.date = days[new Date(this.date).getDay()];

      obj['date'] = this.date
      obj['currentMonth'] = this.currentMonth
      obj['currentDate'] = this.currentDate
      obj['currentYear'] = this.currentYear
      obj['currentFullDate'] = this.currentFullDate

      bus.$emit("dateValue", obj);
      this.modal = false;
    },
    restore(){
      bus.$emit('restoreBtn')
    },
    deleteSub(){
      bus.$emit('deleteBtn')
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
          { icon: "today", text: "Timetable", route: "timetable" },
          { icon: "add", text: "Add Subjects", route: "add_subjects" },
          // { icon: "settings", text: "Settings", route: "settings" }
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

