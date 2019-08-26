<template>
  <nav>
    <v-toolbar flat app>
      <v-toolbar-side-icon v-on:click="drawer = !drawer" aria-label="Menu"></v-toolbar-side-icon>

      <v-toolbar-title v-if="$route.name === 'home'">Home</v-toolbar-title>
      <v-toolbar-title v-else-if="$route.name === 'statistics'">Statistics</v-toolbar-title>
      <v-toolbar-title v-else-if="$route.name === 'timetable'">Timetable</v-toolbar-title>
      <v-toolbar-title v-else-if="$route.name === 'add_subjects'">Subjects</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn aria-label="Sign In" v-if="isUser === false" @click="googleLogin">
        <img src="../../public/google.png" class="mr-2" alt="Google" />Sign In
      </v-btn>

      <homeDate></homeDate>

    </v-toolbar>

    <v-navigation-drawer v-model="drawer" app>

      <signOut></signOut>

      <v-layout column align-center v-if="userPhoto">
        <v-flex class="mt-5">
          <v-avatar size="100">
            <img :src="userPhoto" alt="Profile Photo" />
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
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>brightness_3</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Night Mode</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-switch @click="nightMode"></v-switch>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import firebase from "firebase/app";
import db from "../firebase/init";
import { bus } from '../main'

const homeDate = () => import('./homeDate')
const signOut = () => import('./signOut')

export default {
  components: {
    homeDate,
    signOut
  },
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      drawer: false,
      isUser: null,
      userPhoto: null,
      userName: null,
      links: [],
      mode: false
    };
  },
  methods: {
    nightMode() {
      this.mode = !this.mode;
      this.$emit("changeMode", this.mode);
    },
    googleLogin() {
      const provider = new firebase.auth.GoogleAuthProvider();

      firebase
        .auth()
        .signInWithPopup(provider)
        .then(() => {
          this.$router.push({ name: "home" });
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$router.push({ name: "home" });
        db.collection("attData")
          .doc(user.uid)
          .set({}, { merge: true });
      } else {
        // console.log("No User Found");
      }
    });
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.isUser = true;
        this.userPhoto = user.photoURL;
        this.userName = user.displayName;
      } else {
        this.isUser = false;
        this.userPhoto = null;
        this.userName = null;

        this.links = [
          { icon: "account_circle", text: "Sign In", route: "signup" }
        ];
      }
      bus.$emit('userSend', this.isUser);
    });
  }
};
</script>