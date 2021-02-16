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
      <v-spacer></v-spacer>

      <v-btn
        class="elevation-10"
        aria-label="Sign In"
        v-if="isUser === false"
        @click="googleLogin"
        >Continue with
        <img src="../../public/google.png" class="ml-2" alt="Google" />
      </v-btn>

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

    <!-- Sign Out !-->
    <v-navigation-drawer v-model="drawer" app>
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

        <v-list-tile>
          <v-btn @click="getMessagingToken" round block
            >Enable Notifications</v-btn
          >
        </v-list-tile>
      </v-list>

      <v-list v-if="isUser && !disabled"> </v-list>

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

    <!-- Sign In Dialog !-->
    <!-- <v-dialog v-model="register" persistent>
      <v-card
        style="border-radius: 20px;background-image: linear-gradient( 108deg,  rgba(0,166,81,1) 9.3%, rgba(0,209,174,1) 118.3% );"
      >
        <v-card-title class="headline justify-center">Sign Up</v-card-title>
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
    </v-dialog> -->
    <!-- ==============  !-->

    <!-- Sign In Email Link Dialog !-->
    <!-- <v-dialog v-model="emailLink" persistent>
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
    </v-dialog> -->
    <!-- ==============  !-->

    <!-- Choose Avatar Intro !-->
    <!-- <v-dialog v-model="appIntro" persistent>
      <v-card>
        <v-card-title
          class="justify-center subheading"
          style="letter-spacing: 2px; background-image: radial-gradient( circle farthest-corner at -0.2% 99.7%,  rgba(190,53,145,1) 0%, rgba(239,69,115,1) 100.2% );"
        >Choose Your Avatar</v-card-title>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs-4 md-3 v-for="(avt, j) in avatars" :key="avt">
              <v-card flat hover @click="avatarSelect($event)">
                <img :src="avatars[j]" width="75" height="75" />
              </v-card>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions class="justify-end pa-3">
          <v-btn round @click="avatarNext">Next</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
    <!-- ==============  !-->

    <!-- Additional Info Intro !-->
    <v-dialog v-model="appIntro2" persistent>
      <v-card>
        <v-card-title
          class="justify-center subheading"
          style="letter-spacing: 2px; background-image: radial-gradient( circle farthest-corner at -0.2% 99.7%,  rgba(190,53,145,1) 0%, rgba(239,69,115,1) 100.2% );"
          >Additional Information</v-card-title
        >
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
    <!-- ==============  !-->

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
            <span class="subheading text-center">v2.0</span>
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

    <!-- Add Subjects Intro !-->
    <!-- <v-dialog v-model="appIntro3" persistent>
      <v-card>
        <v-card-title
          class="justify-center subheading"
          style="letter-spacing: 2px; background-image: radial-gradient( circle farthest-corner at -0.2% 99.7%,  rgba(190,53,145,1) 0%, rgba(239,69,115,1) 100.2% );"
          >Add Subjects</v-card-title
        >
        <v-card-text>
          <v-layout row>
            <v-text-field
              v-model="subjectName"
              label="Add Subject"
            ></v-text-field>
            <v-btn @click="addSubject">Add</v-btn>
          </v-layout>
          <v-card v-if="hasSubject" elevation="1">
            <v-card-text>
              <v-layout class="pt-3" row v-for="(sub, i) in subjects" :key="i">
                <span style="letter-spacing: 2px;">{{ i + 1 }}. {{ sub }}</span>
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
          <v-btn flat @click="appIntro3 = false">Skip</v-btn>
          <v-btn round @click="saveSubjects">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
    <!-- ============== !-->

    <!-- Create Timetable Intro !-->
    <!-- <v-dialog v-model="appIntro4" persistent scrollable lazy>
      <v-card>
        <v-card-title
          class="justify-center subheading"
          style="letter-spacing: 2px; background-image: radial-gradient( circle farthest-corner at -0.2% 99.7%,  rgba(190,53,145,1) 0%, rgba(239,69,115,1) 100.2% );"
          >Create Timetable</v-card-title
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
            <v-tab-item v-for="(day, index) in days" :key="index" :value="day">
              <v-layout row class="mt-3">
                <v-select
                  v-model="currentSubject"
                  :items="subjects"
                  label="Choose Subject"
                ></v-select>
                <v-btn @click="addDaySubject">Add</v-btn>
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
          <v-btn flat @click="ttIntro">Skip</v-btn>
          <v-btn round @click="saveTimetable">Save</v-btn>
          <v-btn round v-if="lastDay" @click="appIntro4 = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
    <!-- ============== !-->

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
        "../avatars/woman-12.svg",
      ],
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
      emailLink: null,
      emailValue: null,
      snackbar: false,
      msg: null,
      timeout: 3000,
      color: undefined,
      appIntro: null,
      appIntro2: null,
      attCriteria: 30,
      appIntro3: null,
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
    sendEmailLink() {
      if (
        RegExp(
          "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
        ).test(this.emailValue)
      ) {
        this.register = false;

        let actionCodeSettings = {
          url: "https://attendit.firebaseapp.com/signup",
          // url: "http://localhost:8080/signup",
          handleCodeInApp: true,
        };

        firebase
          .auth()
          .sendSignInLinkToEmail(this.emailValue, actionCodeSettings)
          .then(() => {
            window.localStorage.setItem("emailForSignIn", this.emailValue);
          })
          .catch((e) => {
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
        .then(async (token) => {
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
        .catch((err) => {
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
            userUid,
          }
        )
        .then((response) => {
          window.localStorage.setItem("messagingToken", token);
          console.log(response);
        })
        .catch((err) => {
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
              photoURL: this.userPhoto[0],
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
        this.appIntro3 = true;
        window.localStorage.removeItem("newUser");
      }
    },
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
    ttIntro() {
      this.appIntro4 = false;
      this.$router.go({ path: "/" });
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
        window.open("mailto:secvinay@gmail.com", "_blank");
      } else if (option == 2) {
        if (navigator.share) {
          navigator.share({
            title: "Attend It",
            text: `Log your attendance with Attend It. Available on all platforms!`,
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
    this.listenTokenRefresh();

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
    const self = this;

    // if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
    //   var email = window.localStorage.getItem("emailForSignIn");
    //   if (!email) {
    //     email = window.prompt("Please provide your email for confirmation");
    //   }
    //   firebase
    //     .auth()
    //     .signInWithEmailLink(email, window.location.href)
    //     .then(function(result) {
    //       window.localStorage.removeItem("emailForSignIn");
    //       if (result.additionalUserInfo.isNewUser) {
    //         window.localStorage.setItem(
    //           "newUser",
    //           result.additionalUserInfo.isNewUser
    //         );
    //         window.localStorage.setItem("appIntro", true);
    //       }
    //       self.appIntro = window.localStorage.getItem("appIntro");
    //     })
    //     .catch(function(error) {
    //       console.log("Error: ", error);
    //     });
    // }

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.links = [
          { icon: "settings", text: "Settings", route: "settings" },
          { icon: "info_outline", text: "About", route: "about" },
          { icon: "update", text: "Changelog", route: "changelog" },
          { icon: "get_app", text: "Install Notes", route: "install" },
          // {
          //   icon: "assignment",
          //   text: "Privacy Policy",
          //   route: "privacypolicy",
          // },
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
          {
            icon: "assignment",
            text: "Privacy Policy",
            route: "privacypolicy",
          },
          // { icon: 'get_app', text: "Installation Notes", route: 'install'},
          // { icon: "update", text: "Changelog", route: "changelog" },
        ];
      }
    });
  },
};
</script>
