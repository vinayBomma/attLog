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
        style="border-radius: 20px;background-image: linear-gradient( 108deg,  rgba(0,166,81,1) 9.3%, rgba(0,209,174,1) 118.3% );"
        @click="register = true"
      >
        <v-icon left>email</v-icon>Sign In
      </v-btn>

      <homeDate></homeDate>
    </v-toolbar>

    <v-navigation-drawer v-model="drawer" app>
      <v-dialog v-model="signOutModal" full-width>
        <template v-slot:activator="{ on }">
          <v-layout align-start justify-end row class="pa-3">
            <v-icon v-if="isUser === true" @click="signOutModal = true" v-on="on">exit_to_app</v-icon>
          </v-layout>
        </template>
        <v-card>
          <v-card-title>Are You Sure You Want To Sign Out?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn aria-label="No" flat color="blue" @click="signOutModal = false">No</v-btn>
            <v-btn aria-label="Yes" flat color="blue" @click="googleLogout">Yes</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-layout column align-center v-if="userPhoto && isUser">
        <v-flex class="mt-5">
          <v-avatar size="100">
            <img :src="userPhoto[0]" alt="Profile Photo" />
          </v-avatar>
        </v-flex>
      </v-layout>

      <v-layout column align-center v-if="userName && isUser">
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
          <v-btn @click="sendEmailLink" round>Next</v-btn>
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
          <v-btn @click="emailLink = null" round>Okay</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="appIntro" persistent>
      <v-card>
        <v-card-title
          class="justify-center subheading"
          style="letter-spacing: 2px; background-image: radial-gradient( circle farthest-corner at -0.2% 99.7%,  rgba(190,53,145,1) 0%, rgba(239,69,115,1) 100.2% );"
        >Choose Your Avatar</v-card-title>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs-4 md-3 v-for="(avt, j) in avatars" :key="avt">
              <!-- <v-hover v-slot:default="{hover}"> -->
              <v-card flat hover @click="avatarSelect($event)">
                <img :src="avatars[j]" width="75" height="75" />
              </v-card>
              <!-- </v-hover> -->
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions class="justify-end pa-3">
          <v-btn round @click="avatarNext">Next</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="appIntro2" persistent>
      <v-card>
        <v-card-title
          class="justify-center subheading"
          style="letter-spacing: 2px; background-image: radial-gradient( circle farthest-corner at -0.2% 99.7%,  rgba(190,53,145,1) 0%, rgba(239,69,115,1) 100.2% );"
        >Additional Information</v-card-title>
        <v-card-text>
          <v-layout row wrap>
            <v-text-field
              label="Name"
              color="white"
              v-model="userName"
              autofocus
              prepend-icon="person"
            ></v-text-field>
            <v-flex xs12>
              <v-slider
                v-model="attCriteria"
                label="Attendance Criteria"
                min="30"
                step="5"
                thumb-label
              ></v-slider>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions class="justify-end pa-3">
          <v-btn round @click="additionalInfo">Next</v-btn>
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
import firebase from "firebase/app";
import axios from "axios";

import { messaging } from "../configFirebase";

const homeDate = () => import("./homeDate");

export default {
  components: {
    homeDate
  },
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      drawer: false,
      isUser: null,
      userPhoto: [],
      userName: null,
      useruid: null,
      signOutModal: null,
      signOutUser: null,
      links: [],
      mode: false,
      disabled: false,
      register: null,
      emailLink: null,
      emailValue: null,
      snackbar: false,
      msg: null,
      timeout: 3000,
      color: undefined,
      appIntro: null,
      appIntro2: null,
      attCriteria: 30,
      // appIntro: true,
      avatars: [
        "../avatars/man-6.svg",
        "../avatars/man-5.svg",
        "../avatars/man-13.svg",
        "../avatars/man-17.svg",
        "../avatars/man-18.svg",
        "../avatars/man-14.svg",
        "../avatars/man-1.svg",
        "../avatars/man-8.svg",
        "../avatars/man-9.svg",
        "../avatars/man-10.svg",
        "../avatars/man-15.svg",
        "../avatars/man-19.svg",
        "../avatars/businessman.svg",
        "../avatars/man-20.svg",
        "../avatars/man-33.svg",
        "../avatars/man-30.svg",
        "../avatars/man-22.svg",
        "../avatars/man-23.svg",
        "../avatars/man-28.svg",
        "../avatars/man-34.svg",
        "../avatars/woman.svg",
        "../avatars/woman-1.svg",
        "../avatars/woman-2.svg",
        "../avatars/woman-3.svg",
        "../avatars/businesswoman.svg",
        "../avatars/woman-4.svg",
        "../avatars/woman-5.svg",
        "../avatars/woman-7.svg",
        "../avatars/woman-9.svg",
        "../avatars/woman-10.svg",
        "../avatars/woman-11.svg",
        "../avatars/woman-12.svg"
      ]
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
        this.msg = "Enter a valid email!";
        this.color = "red";
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
    avatarSelect(event) {
      if (event.target.localName === "img") {
        if (event.target.classList.contains("green")) {
          event.target.classList.remove("green");
          this.userPhoto.splice(
            this.userPhoto.indexOf(event.target.attributes[0].value),
            1
          );
        } else {
          event.target.classList.add("green");
          this.userPhoto.push(event.target.attributes[0].value);
        }
      }
    },
    avatarNext() {
      if (this.userPhoto.length > 1) {
        this.msg = "Please select any one Avatar!";
        this.color = "red";
        this.snackbar = true;
      } else if (this.userPhoto.length < 1) {
        this.msg = "Please select an Avatar!";
        this.color = "red";
        this.snackbar = true;
      } else {
        this.appIntro = false;
        this.appIntro2 = true;
        db.collection("attData")
          .doc(this.useruid)
          .set(
            {
              photoURL: this.userPhoto[0]
            },
            { merge: true }
          );
      }
    },
    additionalInfo() {
      if (!this.userName) {
        this.msg = "Please enter your name!";
        this.color = "red";
        this.snackbar = true;
      } else {
        db.collection("attData")
          .doc(this.useruid)
          .set(
            {
              displayName: this.userName,
              attCriteria: this.attCriteria,
            },
            { merge: true }
          );
        this.appIntro2 = false;
      }
    },
    googleLogout() {
      this.signOutModal = false;
      this.signOutUser = true;

      if (this.signOutUser) {
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
    }

    // nightMode() {
    //   this.mode = !this.mode;
    //   this.$emit("changeMode", this.mode);
    // },
    // googleLogin() {
    // const provider = new firebase.auth.GoogleAuthProvider();

    // firebase.auth().signInWithRedirect(provider);

    // firebase
    //   .auth()
    //   .signInWithPopup(provider)
    //   .then(() => {
    //     this.$router.push({ name: "home" });
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
    // }
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
              // displayName: user.displayName,
              // phoneNum: user.phoneNumber,
              uid: user.uid,
              email: user.email
              // photoURL: user.photoURL
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
    const self = this;

    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      var email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        email = window.prompt("Please provide your email for confirmation");
      }
      firebase
        .auth()
        .signInWithEmailLink(email, window.location.href)
        .then(function(result) {
          window.localStorage.removeItem("emailForSignIn");
          if (result.additionalUserInfo.isNewUser) {
            window.localStorage.setItem(
              "newUser",
              result.additionalUserInfo.isNewUser
            );
            window.localStorage.setItem("appIntro", true);
          }
          self.appIntro = window.localStorage.getItem("appIntro");
        })
        .catch(function(error) {
          console.log("Error: ", error);
        });
    }

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.isUser = true;
        // this.userPhoto = user.photoURL;
        // this.userName = user.displayName;
        this.useruid = user.uid;
        db.collection("attData")
          .doc(this.useruid)
          .get()
          .then(res => {
            if (res.data().photoURL !== undefined && res.data().displayName !== undefined) {
              this.userPhoto.push(res.data().photoURL);
              this.userName = res.data().displayName
              this.attCriteria = res.data().attCriteria
            } else {
              console.log("Value is undefined");
            }
          });
      } else {
        this.isUser = false;
        // this.userPhoto = null;
        // this.userName = null;

        this.links = [
          { icon: "account_circle", text: "Sign In", route: "signup" },
          { icon: "assignment", text: "Privacy Policy", route: "privacypolicy" }
          // { icon: 'get_app', text: "Installation Notes", route: 'install'}
        ];
      }
    });
  }
};
</script>