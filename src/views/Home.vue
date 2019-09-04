<template>
  <div>
    <div :style="style">
      <v-subheader>{{ currentDate }} {{ currentMonth }}, {{ day }}</v-subheader>
      <v-container fluid>
        <v-layout row wrap>
          <template v-if="!attLogged && hasSubjects">
            <v-flex xs12 sm6 md4 pa-1 v-for="(val, index) in subj" :key="index">
              <v-card>
                <v-card-title primary-title class="title">
                  {{ val }}
                  <v-layout justify-end>
                    <v-icon class="mx-1" @click="presentSub(val, index, $event)" medium>done</v-icon>
                    <v-icon class="mx-1" @click="absentSub(val, index, $event)" medium>clear</v-icon>
                    <v-icon class="mx-1" @click="cancelSub(val, index, $event)" medium>remove</v-icon>
                  </v-layout>
                </v-card-title>
                <!-- <v-card-text>Status: On Track</v-card-text> -->
              </v-card>
            </v-flex>
            <v-btn color="blue" v-on:click="submit()">Save</v-btn>
          </template>

          <v-flex xs12 sm6 md4 pa-1 v-else-if="attLogged">
            <v-card>
              <v-card-text>Attendance Has Been Logged For This Day</v-card-text>
            </v-card>
          </v-flex>

          <v-flex xs12 sm6 md4 pa-1 v-else-if="!hasSubjects">
            <v-card @click="redirect">
              <v-card-text>No Timetable Added For {{this.day}}</v-card-text>
            </v-card>
            <v-card class="mt-2">
              <v-card-text>
                Click
                <router-link to="/add_subjects">Here</router-link>To Add Subjects
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
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
  </div>
</template>

<script>
// import db from "../firebase/init";
import {db} from '../configFirebase'
import firebase from "firebase/app";
import { bus } from "../main";

import "epic-spinners/dist/lib/epic-spinners.min.css";
import OrbitSpinner from "epic-spinners/src/components/lib/OrbitSpinner";

export default {
  components: {
    OrbitSpinner
  },
  data() {
    return {
      userDB: null,
      snackbar: false,
      msg: null,
      timeout: 3000,
      color: undefined,
      subj: [],
      present: [],
      absent: [],
      cancelled: [],
      hasSubjects: true,
      day: null,
      currentDate: null,
      currentMonth: null,
      currentYear: null,
      currentFullDate: null,
      attendData: [],
      sendReq: true,
      loading: false,
      style: "opacity: 1",
      attLogged: null
    };
  },
  methods: {
    redirect() {
      this.$router.push("/timetable");
    },
    subjVerify(event, color, color2, color3) {
      let iconNode = event.target.parentNode.children;

      if (event.target.classList.contains(`${color}--text`)) {
        event.target.classList.remove(`${color}--text`);
      } else {
        for (let i of iconNode) {
          if (i.classList.contains(`${color2}--text`)) {
            i.classList.remove(`${color2}--text`);
          }

          if (i.classList.contains(`${color3}--text`)) {
            i.classList.remove(`${color3}--text`);
          }
        }
        event.target.classList.add(`${color}--text`);
      }
    },
    presentSub(value, index, event) {
      if (this.absent.includes(value)) {
        this.absent.splice(this.absent.indexOf(value), 1);
      } else if (this.cancelled.includes(value)) {
        this.cancelled.splice(this.cancelled.indexOf(value), 1);
      }
      this.present.push(value);

      this.subjVerify(event, "green", "red", "grey");
    },
    absentSub(value, index, event) {
      if (this.present.includes(value)) {
        this.present.splice(this.present.indexOf(value), 1);
      } else if (this.cancelled.includes(value)) {
        this.cancelled.splice(this.cancelled.indexOf(value), 1);
      }
      this.absent.push(value);

      this.subjVerify(event, "red", "green", "grey");
    },
    cancelSub(value, index, event) {
      if (this.present.includes(value)) {
        this.present.splice(this.present.indexOf(value), 1);
      } else if (this.absent.includes(value)) {
        this.absent.splice(this.absent.indexOf(value), 1);
      }
      this.cancelled.push(value);

      this.subjVerify(event, "grey", "red", "green");
    },
    submit() {
      let cDate;

      if (!this.currentFullDate) {
        cDate = new Date().toISOString().substr(0, 10);
      } else {
        cDate = new Date(this.currentFullDate).toISOString().substr(0, 10);
      }

      if (this.attendData.includes(cDate)) {
        this.color = "error";
        this.msg = "Attendance Cannot Be Relogged";
        this.snackbar = true;
        this.sendReq = false;
      } else {
        this.color = "success";
        this.msg = "Attendance Logged";
        this.snackbar = true;
        this.sendReq = true;
      }

      if (
        this.present.length + this.absent.length + this.cancelled.length !==
        this.subj.length
      ) {
        this.color = "error";
        this.msg = "Select Attendance For All Subjects";
        this.snackbar = true;
        this.sendReq = false;
      }

      let obj = {},
        userData,
        dbData;
      let someData = {};

      function verifyAtt(mode, subject, modeDate, operation) {
        obj[subject][mode] += 1;
        obj[subject].total += 1;

        if (operation === "inc") {
          obj[subject].weekdays[new Date(cDate).getDay()] += 1;
        } else if (operation === "dec") {
          obj[subject].weekdays[new Date(cDate).getDay()] -= 1;
        } else if (operation === "eql") {
          obj[subject].weekdays[new Date(cDate).getDay()] += 0;
        }
        obj[subject][modeDate].push(cDate);
      }

      if (this.sendReq) {
        this.userDB
          .get()
          .then(res => {
            for (let i in this.subj) {
              let someValue = this.subj[i];

              userData = res.data().data[someValue];
              if (Object.keys(res.data().data[someValue]).length !== 0) {
                obj[someValue] = {
                  weekdays: userData.weekdays,
                  presentDates: userData.presentDates,
                  absentDates: userData.absentDates,
                  cancelledDates: userData.cancelledDates,
                  present: userData.present,
                  absent: userData.absent,
                  cancelled: userData.cancelled,
                  total: userData.total
                };

                if (this.present.includes(someValue)) {
                  verifyAtt("present", someValue, "presentDates", "inc");
                } else if (this.absent.includes(someValue)) {
                  verifyAtt("absent", someValue, "absentDates", "dec");
                } else if (this.cancelled.includes(someValue)) {
                  verifyAtt("cancelled", someValue, "cancelledDates", "eql");
                }
              } else {
                obj[someValue] = {
                  weekdays: [0, 0, 0, 0, 0, 0, 0],
                  presentDates: [],
                  absentDates: [],
                  cancelledDates: [],
                  present: 0,
                  absent: 0,
                  cancelled: 0,
                  total: 0
                };

                if (this.present.includes(someValue)) {
                  verifyAtt("present", someValue, "presentDates", "inc");
                } else if (this.absent.includes(someValue)) {
                  verifyAtt("absent", someValue, "absentDates", "dec");
                } else if (this.cancelled.includes(someValue)) {
                  verifyAtt("cancelled", someValue, "cancelledDates", "eql");
                }
              }

              if (this.subj.indexOf(this.subj[i]) === this.subj.length - 1) {
                dbData = obj;
                this.userDB.set({ data: dbData }, { merge: true });

                if (this.attendData.length === 0) {
                  this.attendData.push(cDate);
                } else if (this.attendData.length > 0) {
                  if (this.attendData.includes(cDate)) {
                    this.attendData.splice(this.attendData.indexOf(cDate), 1);
                    this.attendData.push(cDate);
                  } else {
                    this.attendData.push(cDate);
                  }
                }

                this.userDB
                  .set({ attendance: this.attendData }, { merge: true })
                  .then(() => {
                    this.$router.go({ name: "home" });
                  });
              }
            }
          })
          .catch(err => {
            console.log("Errarta: ", err);
          });
      }
    }
  },
  created() {
    let user = firebase.auth().currentUser;
    if (user) {
      this.userDB = db.collection("attData").doc(user.uid);
    }

    bus.$on("dateValue", data => {
      this.day = data.date;
      this.currentMonth = data.currentMonth;
      this.currentDate = data.currentDate;
      this.currentYear = data.currentYear;
      this.currentFullDate = data.currentFullDate;

      this.loading = true;
      this.style = "opacity: 0.3";
      this.userDB.get().then(res => {
        this.loading = false;
        this.style = "opacity: 1";

        if (res.data().allSubjects === undefined) {
          this.hasSubjects = false;
        }

        if (res.data().timetable[this.day] !== undefined) {
          let dayValue = res.data()["timetable"][this.day];

          if (dayValue.length > 0) {
            this.subj = dayValue;
            this.hasSubjects = true;
          } else if (dayValue.length === 0) {
            this.hasSubjects = false;
          } else {
            this.hasSubjects = false;
          }
        } else {
          this.hasSubjects = false;
        }

        if (res.data().attendance) {
          if (res.data().attendance.includes(this.currentFullDate)) {
            this.attLogged = true;
          } else {
            this.attLogged = false;
          }
        }
      });
    });

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

    this.currentMonth = months[new Date().getMonth()];
    this.currentDate = new Date().getDate();
    this.day = days[new Date().getDay()];

    this.loading = true;
    this.style = "opacity: 0.3";
    this.userDB.get().then(res => {
      this.loading = false;
      this.style = "opacity: 1";

      if (res.data().attendance !== undefined) {
        let attDates = res.data().attendance;

        if (attDates === undefined || attDates.length === 0) {
          this.attendData = [];
        } else if (attDates.length > 0) {
          this.attendData = attDates;
        }
      }

      if (res.data().attendance) {
        if (
          res.data().attendance.includes(new Date().toISOString().substr(0, 10))
        ) {
          this.attLogged = true;
        } else {
          this.attLogged = false;
        }
      }

      if (res.data().allSubjects === undefined) {
        this.hasSubjects = false;
      }

      if (res.data().timetable[this.day] !== undefined) {
        let dayValue = res.data()["timetable"][this.day];

        if (dayValue.length > 0) {
          this.subj = dayValue;
          this.hasSubjects = true;
        } else if (dayValue.length === 0) {
          this.hasSubjects = false;
        } else {
          this.hasSubjects = false;
        }
      } else {
        this.hasSubjects = false;
      }
    });
  }
};
</script>
