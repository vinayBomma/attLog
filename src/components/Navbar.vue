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

      <v-list v-if="!isUser">
        <v-list-tile v-for="(link, j) in links" :key="j" router v-bind:to="link.route">
          <v-list-tile-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ link.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-list v-if="isUser">
        <v-list-tile>
          <v-list-tile-action>
            <v-btn color="orange" @click="getMessagingToken">Enable Notifications</v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import { db } from "../configFirebase";
import firebase from "firebase";
import { bus } from "../main";
import axios from "axios";

import { messaging } from "../configFirebase";

const homeDate = () => import("./homeDate");
const signOut = () => import("./signOut");

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
      useruid: null,
      links: [],
      mode: false
    };
  },
  methods: {
    getMessagingToken() {
      messaging
        .getToken()
        .then(async token => {
          if (token) {
            const currentMessageToken = window.localStorage.getItem(
              "messagingToken"
            );
            // console.log("token will be updated", currentMessageToken != token);

            if (currentMessageToken != token) {
              await this.saveToken(token);
            }
          } else {
            console.log(
              "No Instance ID token available. Request permission to generate one."
            );
            this.notificationsPermisionRequest();
          }
        })
        .catch(function(err) {
          console.log("An error occurred while retrieving token. ", err);
        });
    },
    notificationsPermisionRequest() {
      messaging
        .requestPermission()
        .then(() => {
          this.getMessagingToken();
        })
        .catch(err => {
          console.log("Unable to get permission to notify.", err);
        });
    },
    listenTokenRefresh() {
      const currentMessageToken = window.localStorage.getItem("messagingToken");
      // console.log("currentMessageToken", currentMessageToken);
      if (!currentMessageToken) {
        messaging.onTokenRefresh(function() {
          messaging
            .getToken()
            .then(function(token) {
              this.saveToken(token);
            })
            .catch(function(err) {
              console.log("Unable to retrieve refreshed token ", err);
            });
        });
      }
    },
    saveToken(token) {
      let userUid = this.useruid
      // console.log("tokens", token);
      axios
        .post(
          `https://us-central1-attendit.cloudfunctions.net/GeneralSubscription`,
          {
            token,
            userUid
          }
        )
        .then(response => {
          window.localStorage.setItem("messagingToken", token);
          console.log(response);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // nightMode() {
    //   this.mode = !this.mode;
    //   this.$emit("changeMode", this.mode);
    // },
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
    this.listenTokenRefresh();

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$router.push({ name: "home" });
        db.collection("attData")
          .doc(user.uid)
          .set(
            {
              displayName: user.displayName,
              phoneNum: user.phoneNumber,
              uid: user.uid,
              email: user.email
            },
            { merge: true }
          );
      }
    });
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.isUser = true;
        this.userPhoto = user.photoURL;
        this.userName = user.displayName;
        this.useruid = user.uid;
      } else {
        this.isUser = false;
        this.userPhoto = null;
        this.userName = null;

        this.links = [
          { icon: "account_circle", text: "Sign In", route: "signup" }
        ];
      }
      bus.$emit("userSend", this.isUser);
    });
  }
};
</script>