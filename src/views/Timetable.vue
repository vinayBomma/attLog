<template>
  <section>
    <div :style="style">
      <template>
        <v-tabs
          v-model="currentDay"
          color="transparent"
          fixed-tabs
          show-arrows
          slider-color="blue"
          @change="tabChange"
        >
          <v-tab v-for="day in days" :key="day" :href="'#' + day">{{ day }}</v-tab>
        </v-tabs>
      </template>
      <div v-if="showtt && hastt">
        <v-tabs-items v-model="currentDay">
          <v-tab-item v-for="(day, index) in days" :key="index" :value="day">
            <v-container>
              <v-card
                class="my-2"
                style="border-radius: 10px;background: linear-gradient(25deg,#d64c7f,#ee4758 50%);"
                v-for="(sub, i) in daySubjects"
                :key="i"
              >
                <v-card-text>
                  <span class="subheading" style="letter-spacing: 2px;">{{ i + 1}}. {{ sub }}</span>
                </v-card-text>
              </v-card>
            </v-container>
          </v-tab-item>
        </v-tabs-items>
      </div>

      <!-- No Timetable created !-->
      <v-flex xs12 sm12 md8 offset-md2 pa-1 v-if="showtt && !hastt">
      <v-card class="my-2"
        style="border-radius: 20px;background-image: linear-gradient( 108deg,  rgba(0,166,81,1) 9.3%, rgba(0,209,174,1) 118.3% );"
      >
        <v-card-title class="justify-center">
          <v-icon x-large color="white">info</v-icon>
        </v-card-title>
        <v-card-text
          class="subheading"
          style="letter-spacing: 2px; text-align:center;"
        >Timetable for this day has not been created! Please click the edit(pencil) icon to create your timetable.</v-card-text>
      </v-card>
      </v-flex>
      <!-- ============== !-->

      <!-- No Subjects Added !-->
      <div v-else-if="!showtt">
        <v-container>
          <v-card @click="$router.push({path: '/add_subjects'})"
            style="border-radius: 20px;background-image: linear-gradient( 108deg,  rgba(0,166,81,1) 9.3%, rgba(0,209,174,1) 118.3% );"
          >
            <v-card-title class="justify-center">
              <v-icon x-large color="white">error</v-icon>
            </v-card-title>
            <v-card-text
              class="subheading"
              style="letter-spacing: 2px; text-align:center;"
            >No subjects have been added yet!</v-card-text>
          </v-card>
        </v-container>
      </div>
      <!-- ============== !-->
    </div>

    <v-snackbar v-model="snackbar" :timeout="timeout" multi-line bottom :color="color">
      {{ msg }}
      <v-btn flat @click="snackbar === false">Close</v-btn>
    </v-snackbar>

    <v-dialog v-model="loading" persistent full-width>
      <v-card color="transparent">
        <v-layout v-model="loading" justify-center pa-3>
          <OrbitSpinner v-show="loading === true" :size="55" color="cyan" />
        </v-layout>
        <v-layout justify-center>
          <p text-align="center">Loading...</p>
        </v-layout>
      </v-card>
    </v-dialog>
  </section>
</template> 

<script>
import { db } from "../configFirebase";
import firebase from "firebase/app";

import "epic-spinners/dist/lib/epic-spinners.min.css";
import OrbitSpinner from "epic-spinners/src/components/lib/OrbitSpinner";

export default {
  components: {
    OrbitSpinner
  },
  data() {
    return {
      currentDay: "Monday",
      days: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      hasDaySubjects: null,
      daySubjects: [],
      currentSubject: null,
      lastDay: null,
      snackbar: false,
      msg: null,
      timeout: 3000,
      color: undefined,
      userDB: null,
      hastt: null,
      showtt: true,
      loading: false,
      style: "opacity: 1"
    };
  },
  methods: {
    tabChange() {
      this.loading = true;
      this.style = "opacity: 0.3";
      this.userDB
        .get()
        .then(res => {
          this.loading = false;
          this.style = "opacity: 1";
          if (
            res.data().timetable === undefined ||
            res.data().timetable[this.currentDay] === undefined ||
            res.data().timetable[this.currentDay].length === 0
          ) {
            // this.daySubjects = res.data().allSubjects;
            this.hastt = false;
          } else {
            this.daySubjects = res.data().timetable[this.currentDay];
            this.hastt = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    this.loading = true;
    this.style = "opacity: 0.3";
    this.userDB
      .get()
      .then(res => {
        this.loading = false;
        this.style = "opacity: 1";
        if (
          res.data().timetable === undefined ||
          res.data().timetable[this.currentDay] === undefined ||
          res.data().timetable[this.currentDay].length === 0
        ) {
          // this.daySubjects = res.data().allSubjects;
          this.hastt = false;
        } else {
          this.daySubjects = res.data().timetable[this.currentDay];
          this.hastt = true;
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  created() {
    let user = firebase.auth().currentUser;
    if (user) {
      this.userDB = db.collection("attData").doc(user.uid);
    }

    this.userDB.get().then(res => {
      if (res.data().allSubjects === undefined) {
        this.showtt = false;
      } else {
        // this.daySubjects = res.data().allSubjects;
        this.showtt = true;
      }
    });
  }
};
</script>
