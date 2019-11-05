<template>
  <nav>
    <v-toolbar flat app>
      <v-toolbar-side-icon v-on:click="drawer = !drawer" aria-label="Menu"></v-toolbar-side-icon>

      <v-toolbar-title v-if="$route.name === 'home'">Home</v-toolbar-title>
      <v-toolbar-title v-else-if="$route.name === 'statistics'">Statistics</v-toolbar-title>
      <v-toolbar-title v-else-if="$route.name === 'timetable'">Timetable</v-toolbar-title>
      <v-toolbar-title v-else-if="$route.name === 'add_subjects'">Subjects</v-toolbar-title>
      <v-spacer></v-spacer>

      <!-- <v-btn class="elevation-10" aria-label="Sign In" v-if="isUser === false" @click="googleLogin">
        <img src="../../public/google.png" class="mr-2" alt="Google" />Sign In
      </v-btn>-->
      <v-btn
        aria-label="Sign In"
        v-if="isUser === false"
        round
        color="red lighten-1"
        @click="register = true"
      >
        <v-icon left>email</v-icon>Sign In
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
          <p>Welcome, {{ userName }}!</p>
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

      <v-list v-if="isUser && !disabled">
        <v-list-tile>
          <!-- <v-list-tile-action> -->
          <v-btn @click="getMessagingToken" round block>Enable Notifications</v-btn>
          <!-- </v-list-tile-action> -->
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-dialog v-model="register" persistent>
      <v-card
        style="border-radius: 20px;background-image: linear-gradient( 108deg,  rgba(0,166,81,1) 9.3%, rgba(0,209,174,1) 118.3% );"
      >
        <v-card-title class="headline justify-center">Login</v-card-title>
        <v-card-text>
          <v-layout row>
            <v-flex xs-3 md-4>
              <v-text-field
                label="Email"
                color="white"
                v-model="emailValue"
                autofocus
                prepend-icon="email"
                persistent-hint
                hint="Your email is not shared with third-parties!"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions class="justify-end pa-3">
          <v-btn @click="register = false" flat>Cancel</v-btn>
          <v-btn @click="sendEmailLink">Next</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="emailLink" persistent>
      <v-card
        style="border-radius: 20px;background-image: linear-gradient( 108deg,  rgba(0,166,81,1) 9.3%, rgba(0,209,174,1) 118.3% );"
      >
        <v-card-title class="justify-center">
          <v-icon x-large color="white">check_circle</v-icon>
        </v-card-title>
        <v-card-text
          class="subheading"
          style="text-align: center; word-spacing: 2px; letter-spacing: 2px"
        >Further instructions have been sent to {{emailValue}}. Please check your email!</v-card-text>
        <v-card-actions class="justify-end pa-3">
          <v-btn @click="emailLink = null">Okay</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :timeout="timeout" multi-line bottom :color="color">
      {{ msg }}
      <v-btn flat @click="snackbar === false">Close</v-btn>
    </v-snackbar>
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
      mode: false,
      disabled: false,
      register: null,
      emailLink: null,
      emailValue: null,
      snackbar: false,
      msg: null,
      timeout: 3000,
      color: undefined
    };
  },
  methods: {
    sendEmailLink() {
      if (
        RegExp(
          "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
        ).test(this.emailValue)
      ) {
        this.register = false;

        let actionCodeSettings = {
          // url: "https://attendit.web.app/signup"
          url: "http://localhost:8080/signup",
          handleCodeInApp: true
        };

        firebase
          .auth()
          .sendSignInLinkToEmail(this.emailValue, actionCodeSettings)
          .then(() => {
            window.localStorage.setItem("emailForSignIn", this.emailValue);
          })
          .catch(e => {
            console.log("Errarta: ", e);
          });

        this.emailLink = true;
      } else {
        this.msg = 'Enter a valid email!'
        this.color = 'red'
        this.snackbar = true;
      }
    },
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
          alert(
            "Couldn't enable push notifications. Your browser may not suppport it."
          );
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
      } else {
        this.disabled = true;
      }
    },
    saveToken(token) {
      let userUid = this.useruid;
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
      // const provider = new firebase.auth.GoogleAuthProvider();

      // firebase.auth().signInWithRedirect(provider);

      this.$router.push({ path: "register" });

      // firebase
      //   .auth()
      //   .signInWithPopup(provider)
      //   .then(() => {
      //     this.$router.push({ name: "home" });
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    }
  },
  mounted() {
    this.listenTokenRefresh();

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user.providerData);
        this.$router.push({ name: "home" });
        db.collection("attData")
          .doc(user.uid)
          .set(
            {
              displayName: user.displayName,
              phoneNum: user.phoneNumber,
              uid: user.uid,
              email: user.email,
              photoURL: user.photoURL
            },
            { merge: true }
          );
      }
    });
  },
  created() {
    // firebase
    //   .auth()
    //   .getRedirectResult()
    //   .then(() => {
    //     this.$router.push({ name: "home" });
    //   })
    //   .catch(err => {
    //     console.log("Errarta: ", err);
    //   });

    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      var email = window.localStorage.getItem("emailForSignIn");
      //   this.emailVal = email;
      if (!email) {
        email = window.prompt("Please provide your email for confirmation");
      }
      firebase
        .auth()
        .signInWithEmailLink(email, window.location.href)
        .then(function(result) {
          window.localStorage.removeItem("emailForSignIn");
          // You can access the new user via result.user
          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          console.log("New User?: ", result.additionalUserInfo.isNewUser);
        })
        .catch(function(error) {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
        });
    }

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
          { icon: "account_circle", text: "Sign In", route: "signup" },
          { icon: "assignment", text: "Privacy Policy", route: "privacypolicy" }
          // { icon: 'get_app', text: "Installation Notes", route: 'install'}
        ];
      }
      bus.$emit("userSend", this.isUser);
    });
  }
};
</script>