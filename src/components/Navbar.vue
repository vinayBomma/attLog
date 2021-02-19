<template>
  <nav>
    <v-toolbar flat app>
      <v-toolbar-side-icon
        v-on:click="drawer = !drawer"
        aria-label="Menu"
      ></v-toolbar-side-icon>

      <v-toolbar-title v-if="$route.name === 'home'">Home</v-toolbar-title>
      <v-toolbar-title v-else-if="$route.name === 'statistics'"
        >Statistics</v-toolbar-title
      >
      <v-toolbar-title v-else-if="$route.name === 'timetable'"
        >Timetable</v-toolbar-title
      >
      <v-toolbar-title v-else-if="$route.name === 'add_subjects'"
        >Subjects</v-toolbar-title
      >
      <v-toolbar-title v-else-if="$route.name === 'settings'"
        >Settings</v-toolbar-title
      >
      <v-toolbar-title v-else-if="$route.name === 'changelog'"
        >Changelog</v-toolbar-title
      >
      <v-toolbar-title v-else-if="$route.name === 'installNotes'"
        >Install Notes</v-toolbar-title
      >
      <v-toolbar-title v-else-if="$route.name === 'about'"
        >About</v-toolbar-title
      >
      <v-spacer></v-spacer>

      <v-btn
        class="elevation-10"
        aria-label="Sign In"
        v-if="isUser === false"
        @click="googleLogin"
        >Continue with
        <img src="../../public/google.png" class="ml-2" alt="Google" />
      </v-btn>

      <template
        v-if="
          isUser &&
            ($route.name == 'changelog' ||
              $route.name == 'about' ||
              $route.name == 'installNotes')
        "
      >
        <v-btn
          style="letter-spacing: 1px"
          flat
          @click="$router.push({ path: '/' })"
          >Home</v-btn
        >
      </template>

      <!-- Home Reset Attendance !-->
      <template
        v-if="$route.name === 'home' && attDates.includes(currentFullDate)"
      >
        <v-dialog v-model="restoreModal" max-width="800">
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" @click="restoreModal = true" class="mr-4"
              >restore</v-icon
            >
          </template>
          <v-card>
            <v-card-title
              class="justify-center subheading"
              style="letter-spacing: 2px; background-image: radial-gradient( circle farthest-corner at -0.2% 99.7%,  rgba(190,53,145,1) 0%, rgba(239,69,115,1) 100.2% );"
              >Reset Attendance</v-card-title
            >
            <v-card-text
              class="subheading"
              style="text-align: center; word-spacing: 2px; letter-spacing: 2px"
              >Are you sure you want to reset your attendance for this
              day?</v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn aria-label="No" flat @click="restoreModal = false"
                >Cancel</v-btn
              >
              <v-btn aria-label="Yes" round color="cyan" @click="restoreAtt"
                >Yes</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <!-- ==============  !-->

      <!-- Home Date Picker !-->
      <template v-if="$route.name === 'home'">
        <v-dialog
          v-model="modal"
          :return-value.sync="date"
          lazy
          full-width
          width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-icon v-model="date" v-on="on">event</v-icon>
          </template>
          <v-date-picker
            v-model="date"
            :events="objectDates"
            header-color="cyan"
            color="yellow darken-1"
          >
            <v-spacer></v-spacer>
            <v-btn aria-label="Cancel" flat @click="modal = false"
              >Cancel</v-btn
            >
            <v-btn aria-label="Ok" round color="cyan" @click="saveDate"
              >OK</v-btn
            >
          </v-date-picker>
        </v-dialog>
      </template>
      <!-- ==============  !-->

      <!-- Edit Icon Subjects !-->
      <template v-if="$route.name === 'add_subjects'">
        <v-dialog v-model="editSub" max-width="800">
          <template v-slot:activator="{ on }">
            <v-icon v-on="on">edit</v-icon>
          </template>

          <v-card>
            <v-card-title
              class="justify-center subheading"
              style="letter-spacing: 2px; background-image: radial-gradient( circle farthest-corner at -0.2% 99.7%,  rgba(190,53,145,1) 0%, rgba(239,69,115,1) 100.2% );"
              >Edit Subjects</v-card-title
            >
            <v-card-text>
              <v-layout row>
                <v-text-field v-model="subjectName" label="Subject Name">
                  <template v-slot:append-outer>
                    <v-icon @click="addSubject" color="green lighten-1"
                      >add_circle</v-icon
                    >
                  </template></v-text-field
                >
                <!-- <v-btn @click="addSubject">Add</v-btn> -->
              </v-layout>
              <v-card v-if="hasSubject" elevation="1">
                <v-card-text>
                  <v-layout
                    class="pt-3"
                    row
                    v-for="(sub, i) in subjects"
                    :key="i"
                  >
                    <!-- <v-layout> -->
                    <span style="letter-spacing: 2px;"
                      >{{ i + 1 }}. {{ sub }}</span
                    >
                    <!-- </v-layout> -->
                    <v-layout class="justify-end">
                      <v-icon right color="red" @click="removeSubject(i)"
                        >remove_circle</v-icon
                      >
                    </v-layout>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-card-text>
            <v-card-actions class="justify-end pa-3">
              <v-btn flat @click="editSub = false">Close</v-btn>
              <v-btn round color="cyan" @click="editSubjects">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <!-- ============== !-->

      <!-- Edit Icon Timetable !-->
      <template v-if="$route.name === 'timetable'">
        <v-dialog v-model="editTimetable" lazy max-width="1200">
          <template v-slot:activator="{ on }">
            <v-icon v-on="on">edit</v-icon>
          </template>

          <v-card>
            <v-card-title
              class="justify-center subheading"
              style="letter-spacing: 2px; background-image: radial-gradient( circle farthest-corner at -0.2% 99.7%,  rgba(190,53,145,1) 0%, rgba(239,69,115,1) 100.2% );"
              >Edit Timetable</v-card-title
            >
            <v-card-text>
              <v-tabs
                v-model="currentDay"
                color="transparent"
                fixed-tabs
                show-arrows
                slider-color="blue"
                @change="tabChange"
              >
                <v-tab v-for="day in days" :key="day" :href="'#' + day">{{
                  day
                }}</v-tab>
              </v-tabs>
              <v-tabs-items v-model="currentDay">
                <v-tab-item
                  v-for="(day, index) in days"
                  :key="index"
                  :value="day"
                >
                  <v-layout row class="mt-3">
                    <v-select
                      v-model="currentSubject"
                      :items="subjects"
                      label="Choose Subject"
                    >
                      <template v-slot:append-outer>
                        <v-icon @click="addDaySubject" color="green lighten-1"
                          >add_circle</v-icon
                        >
                      </template>
                    </v-select>
                  </v-layout>
                  <v-card v-if="hasDaySubjects" elevation="1">
                    <v-card-text>
                      <v-layout
                        class="pt-3"
                        row
                        v-for="(sub, i) in daySubjects"
                        :key="i"
                      >
                        <span style="letter-spacing: 2px;"
                          >{{ i + 1 }}. {{ sub }}</span
                        >
                        <v-layout class="justify-end">
                          <v-icon right color="red" @click="removeDaySubject(i)"
                            >remove_circle</v-icon
                          >
                        </v-layout>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-card-text>
            <v-card-actions class="justify-end pa-3">
              <v-btn flat @click="closeEditTT">Close</v-btn>
              <v-btn round @click="saveTimetable" color="cyan">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <!-- ============== !-->
    </v-toolbar>


    <v-navigation-drawer v-model="drawer" app>

      <!-- Sign Out !-->
      <v-dialog v-model="signOutModal" max-width="600">
        <template v-slot:activator="{ on }">
          <v-layout align-start justify-end row class="pa-3">
            <v-icon
              v-if="isUser === true"
              @click="signOutModal = true"
              v-on="on"
              >logout</v-icon
            >
          </v-layout>
        </template>
        <v-card>
          <v-card-title
            class="subheading justify-center"
            style="letter-spacing: 2px; background-image: radial-gradient( circle farthest-corner at -0.2% 99.7%,  rgba(190,53,145,1) 0%, rgba(239,69,115,1) 100.2% );"
            >Sign Out</v-card-title
          >
          <v-card-text
            class="subheading"
            style="text-align: center; word-spacing: 2px; letter-spacing: 2px"
            >Are you sure you want to sign out?</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn aria-label="No" flat @click="signOutModal = false"
              >Cancel</v-btn
            >
            <v-btn aria-label="Yes" round color="cyan" @click="googleLogout"
              >Yes</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- ==============  !-->

      <!-- Profile Photo !-->
      <v-layout column align-center v-if="userPhoto && isUser">
        <v-flex>
          <v-avatar size="80">
            <img :src="userPhoto" alt="Profile Photo" />
          </v-avatar>
        </v-flex>
      </v-layout>

      <v-layout column align-center v-if="userName && isUser">
        <v-flex class="mt-2 mb-2">
          <p class="subheading">Welcome, {{ userName }}!</p>
        </v-flex>
      </v-layout>
      <!-- ==============  !-->

      <v-divider v-if="isUser"></v-divider>

      <v-list>
        <v-list-tile
          v-for="(link, j) in links"
          :key="j"
          router
          v-bind:to="link.route"
        >
          <v-list-tile-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ link.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <!-- <v-list-tile>
          <v-btn @click="getMessagingToken" round block
            >Enable Notifications</v-btn
          >
        </v-list-tile> -->
      </v-list>

      <v-divider v-if="isUser"></v-divider>

      <v-list>
        <v-list-tile
          v-for="link in functionLinks"
          :key="link.id"
          @click="featureOption(link.id)"
        >
          <v-list-tile-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ link.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <!-- ============= Report App =============== -->
    <v-dialog v-model="reportBugsDialog" max-width="500">
      <v-card>
        <v-card-title
          class="subheading justify-center"
          style="letter-spacing: 2px; background-image: radial-gradient( circle farthest-corner at -0.2% 99.7%,  rgba(190,53,145,1) 0%, rgba(239,69,115,1) 100.2% );"
          >Report Bug</v-card-title
        >
        <v-card-text>
          <v-textarea
            auto-grow
            color="cyan"
            outline
            label="Description"
            v-model="reportText"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            aria-label="No"
            flat
            @click="reportBugsDialog = !reportBugsDialog"
            >Cancel</v-btn
          >
          <v-btn aria-label="Yes" round color="cyan" @click="bugReport"
            >Yes</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- ======================================== -->

    <!-- ============= App Version =============== -->
    <v-dialog v-model="appVersionDialog" max-width="500">
      <v-card>
        <v-card-title
          class="subheading justify-center"
          style="letter-spacing: 2px; background-image: radial-gradient( circle farthest-corner at -0.2% 99.7%,  rgba(190,53,145,1) 0%, rgba(239,69,115,1) 100.2% );"
          >App Version</v-card-title
        >
        <v-card-text>
          <v-layout class="justify-center">
            <img :src="logo" alt="Attend It Logo" height="100" width="100" />
            <br />
          </v-layout>
          <v-layout class="justify-center mt-2">
            <span class="subheading text-center">v2.1</span>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            aria-label="Close"
            round
            color="cyan"
            @click="appVersionDialog = !appVersionDialog"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- ========================================= -->

    <!-- Snackbar !-->
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      multi-line
      bottom
      :color="color"
    >
      {{ msg }}
      <v-btn flat @click="snackbar === false">Close</v-btn>
    </v-snackbar>
    <!-- ============== !-->
  </nav>
</template>

<script>
import { db } from "../configFirebase";
import firebase from "firebase/app";
import axios from "axios";
import { bus } from "../main";

import { messaging } from "../configFirebase";

export default {
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      drawer: false,
      isUser: null,
      userPhoto: null,
      userName: null,
      useruid: null,
      signOutModal: null,
      signOutUser: null,
      links: [],
      functionLinks: [],
      mode: false,
      disabled: false,
      register: null,
      snackbar: false,
      msg: null,
      timeout: 3000,
      color: undefined,
      subjectName: null,
      hasSubject: null,
      subjects: [],
      appIntro4: null,
      currentDay: "Monday",
      days: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      hasDaySubjects: null,
      daySubjects: [],
      currentSubject: null,
      lastDay: null,
      editSub: null,
      editTimetable: null,
      modal: null,
      currentDate: null,
      currentMonth: null,
      currentFullDate: null,
      currentYear: null,
      objectDates: {},
      attDates: [],
      restoreModal: null,
      reportBugsDialog: null,
      reportText: null,
      appVersionDialog: null,
      logo: "../android-chrome-192x192.png",
    };
  },
  methods: {
    addSubject() {
      if (this.subjectName) {
        this.hasSubject = true;
        this.subjects.push(this.subjectName);
        this.subjectName = null;
      } else {
        this.msg = "Please enter a subject!";
        this.color = "red";
        this.snackbar = true;
      }
    },
    removeSubject(index) {
      this.subjects.splice(index, 1);
    },
    saveSubjects() {
      let obj = {};

      if (this.subjects.length > 0) {
        for (var i in this.subjects) {
          obj[this.subjects[i]] = [];
        }

        db.collection("attData")
          .doc(this.useruid)
          .set(
            {
              allSubjects: this.subjects,
              data: obj,
            },
            { merge: true }
          );
        this.msg = "Subjects Added Successfully!";
        this.color = "green";
        this.snackbar = true;

        this.appIntro3 = false;
        this.appIntro4 = true;
      } else {
        this.msg = "Please enter a subject!";
        this.color = "red";
        this.snackbar = true;
      }
    },
    addDaySubject() {
      if (this.currentSubject) {
        this.daySubjects.push(this.currentSubject);
        this.hasDaySubjects = true;
        this.currentSubject = null;
      } else {
        this.msg = "Please choose a subject!";
        this.color = "red";
        this.snackbar = true;
      }
    },
    removeDaySubject(index) {
      this.daySubjects.splice(index, 1);
    },
    saveTimetable() {
      if (this.daySubjects.length > 0) {
        let obj = {};
        obj[this.currentDay] = this.daySubjects.concat();
        db.collection("attData")
          .doc(this.useruid)
          .set(
            {
              timetable: obj,
            },
            { merge: true }
          )
          .then(() => {
            db.collection("attData")
              .doc(this.useruid)
              .get()
              .then((res) => {
                if (res.data().timetable[this.currentDay]) {
                  this.daySubjects = res.data().timetable[this.currentDay];
                  this.hasDaySubjects = true;
                } else {
                  console.log("Value is undefined");
                }
              });
          });
        this.msg = `Timetable for ${this.currentDay} saved!`;
        this.color = "green";
        this.snackbar = true;
        this.daySubjects = [];
      } else {
        this.msg = "Please choose atleast one subject!";
        this.color = "red";
        this.snackbar = true;
      }
    },
    tabChange() {
      db.collection("attData")
        .doc(this.useruid)
        .get()
        .then((res) => {
          if (res.data().timetable[this.currentDay]) {
            this.hasDaySubjects = true;
            this.daySubjects = res.data().timetable[this.currentDay];
          } else {
            this.hasDaySubjects = false;
            this.daySubjects = [];
          }
        });

      if (this.days.indexOf(this.currentDay) === this.days.length - 1) {
        this.lastDay = true;
      }
    },
    editSubjects() {
      let obj = {};

      if (this.subjects.length > 0) {
        for (var i in this.subjects) {
          obj[this.subjects[i]] = [];
        }

        db.collection("attData")
          .doc(this.useruid)
          .set(
            {
              allSubjects: this.subjects,
              data: obj,
            },
            { merge: true }
          );

        this.msg = "Subjects Added Successfully!";
        this.color = "green";
        this.snackbar = true;

        this.$router.push({ path: "/" });
        this.editSub = null;
      } else {
        this.msg = "Please enter a subject!";
        this.color = "red";
        this.snackbar = true;
      }
    },
    closeEditTT() {
      this.$router.push({ path: "/" });
      this.editTimetable = null;
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
          .catch((err) => {
            console.log(err);
          });
      }
    },
    saveDate() {
      let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
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
        "Dec",
      ];

      let obj = {};

      this.currentMonth = months[new Date(this.date).getMonth()];
      this.currentDate = new Date(this.date).getDate();
      this.currentYear = new Date(this.date).getFullYear();
      this.currentFullDate = this.date;
      this.date = days[new Date(this.date).getDay()];

      obj["date"] = this.date;
      obj["currentMonth"] = this.currentMonth;
      obj["currentDate"] = this.currentDate;
      obj["currentYear"] = this.currentYear;
      obj["currentFullDate"] = this.currentFullDate;

      bus.$emit("dateValue", obj);
      this.modal = !this.modal;
    },
    restoreAtt() {
      bus.$emit("currentDate", this.currentFullDate);
      this.restoreModal = !this.restoreModal;
    },

    // nightMode() {
    //   this.mode = !this.mode;
    //   this.$emit("changeMode", this.mode);
    // },
    googleLogin() {
      const provider = new firebase.auth.GoogleAuthProvider();

      firebase.auth().signInWithRedirect(provider);
    },
    featureOption(option) {
      if (option == 1) {
        window.open("mailto:secvinay@gmail.com?subject=Suggestions%20%5C%20Queries%20%5C%20Feedback", "_blank");
      } else if (option == 2) {
        if (navigator.share) {
          navigator.share({
            title: "Attend It",
            text: `Log your attendance with Attend It. Available on all platforms!<br>
                  Play Store: <a href="https://play.google.com/store/apps/details?id=com.chromium.twa.attendIt">https://play.google.com/store/apps/details?id=com.chromium.twa.attendIt</a><br>
                  Windows Store: <a href="https://www.microsoft.com/store/productId/9PF8BJRD290V">https://www.microsoft.com/store/productId/9PF8BJRD290V</a>`,
            url: "https://attendit.web.app",
          });
        } else {
          window.open(
            "https://twitter.com/intent/tweet?url=https%3A%2F%2Fattendit.web.app%2F&text=Log+your+attendance+with+Attend+It%21+Available+on+all+platforms%21&hashtags=attendance,college",
            "_blank"
          );
        }
      } else if (option == 3) {
        this.appVersionDialog = true;
      } else if (option == 4) {
        this.reportBugsDialog = true;
      }
    },
    bugReport() {
      this.msg = `Bug report sent successfully`;
      this.color = "green";
      this.snackbar = true;
      this.reportBugsDialog = !this.reportBugsDialog;
    },
  },
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$router.push({ name: "home" });
        db.collection("attData")
          .doc(user.uid)
          .set(
            {
              // displayName: user.displayName,
              // phoneNum: user.phoneNumber,
              uid: user.uid,
              email: user.email,
              // photoURL: user.photoURL
            },
            { merge: true }
          );
      }
    });
  },
  created() {
    firebase
      .auth()
      .getRedirectResult()
      .then((result) => {
        // if(result){
        //   console.log(result.additionalUserInfo.isNewUser)
        // }

        this.$router.push({ name: "home" });
      })
      .catch((err) => {
        console.log("Errarta: ", err);
      });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.links = [
          { icon: "settings", text: "Settings", route: "settings" },
          { icon: "info_outline", text: "About", route: "about" },
          { icon: "update", text: "Changelog", route: "changelog" },
          { icon: "get_app", text: "Install Notes", route: "install_notes" },
        ];
        this.functionLinks = [
          { icon: "email", text: "Contact Us", id: 1 },
          { icon: "share", text: "Share", id: 2 },
          { icon: "new_releases", text: "App Version", id: 3 },
          { icon: "bug_report", text: "Report Bug", id: 4 },
        ];
        this.isUser = true;
        this.userPhoto = user.photoURL;
        this.userName = user.displayName;
        this.useruid = user.uid;
        db.collection("attData")
          .doc(this.useruid)
          .get()
          .then((res) => {
            if (
              res.data().photoURL !== undefined &&
              res.data().displayName !== undefined
            ) {
              // this.userPhoto.push(res.data().photoURL);
              this.userName = res.data().displayName;
              this.attCriteria = res.data().attCriteria;
              this.attDates = res.data().attendance;
              for (let i in this.attDates) {
                this.objectDates[this.attDates[i]] = ["green"];
              }

              if (res.data().allSubjects.length > 0) {
                this.hasSubject = true;
                this.subjects = res.data().allSubjects;
              }
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
          { icon: "info_outline", text: "About", route: "about" },
          { icon: "update", text: "Changelog", route: "changelog" },
          { icon: "get_app", text: "Install Notes", route: "install_notes" },
          {
            icon: "assignment",
            text: "Privacy Policy",
            route: "privacypolicy",
          },
        ];
      }
    });
  },
};
</script>
