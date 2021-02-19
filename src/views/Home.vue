<template>
  <div>
    <div :style="style">
      <v-subheader>{{ currentDate }} {{ currentMonth }}, {{ day }}</v-subheader>
      <v-container fluid>
        <v-layout row wrap v-if="!attLogged && hasSubjects && hastt">
          <template>
            <v-flex xs12 sm6 md6 pa-1 v-for="(val, index) in subj" :key="index">
              <v-card
                style="border-radius: 20px;background-image: linear-gradient( 110.7deg,  rgba(9,154,151,1) 6.3%, rgba(21,205,168,1) 90.6% );"
              >
                <v-card-title primary-title class="title">
                  {{ val }}
                  <v-layout justify-end>
                    <v-icon class="mx-1" @click="presentSub(val, $event)" medium
                      >check_circle_outline</v-icon
                    >
                    <v-icon class="mx-1" @click="absentSub(val, $event)" medium
                      >highlight_off</v-icon
                    >
                    <v-icon class="mx-1" @click="cancelSub(val, $event)" medium
                      >remove_circle_outline</v-icon
                    >
                  </v-layout>
                </v-card-title>
                <!-- <v-card-text>Status: Nothing to show yet!</v-card-text> -->
              </v-card>
            </v-flex>
            <v-layout class="align-center">
              <v-btn
                color="cyan darken-1"
                v-on:click="submit()"
                round
                block
                class="mx-5"
                >Submit</v-btn
              >
              </v-layout>
          </template>
        </v-layout>

        <!-- Attendance Logged !-->
        <v-flex xs12 sm12 md8 offset-md2 pa-1 v-else-if="attLogged">
          <v-card
            flat
            style="border-radius: 20px;background-image: linear-gradient( 108deg,  rgba(0,166,81,1) 9.3%, rgba(0,209,174,1) 118.3% );"
          >
            <v-card-title class="justify-center">
              <v-icon x-large color="white">check_circle</v-icon>
            </v-card-title>
            <v-card-text
              class="subheading"
              style="letter-spacing: 2px; text-align:center;"
              >Attendance has been logged for this day!</v-card-text
            >
          </v-card>
        </v-flex>
        <!-- ============== !-->

        <!-- No Timetable created !-->
        <v-flex xs12 sm12 md8 offset-md2 pa-1 v-if="hasSubjects && !hastt">
          <v-card
            @click="$router.push({ path: '/timetable' })"
            style="border-radius: 20px;background-image: linear-gradient( 108deg,  rgba(0,166,81,1) 9.3%, rgba(0,209,174,1) 118.3% );"
          >
            <v-card-title class="justify-center">
              <v-icon x-large color="white">info</v-icon>
            </v-card-title>
            <v-card-text
              class="subheading"
              style="letter-spacing: 2px; text-align:center;"
              >Timetable not created for {{ day }}</v-card-text
            >
          </v-card>
        </v-flex>
        <!-- ============== !-->

        <!-- No Subjects Added !-->
        <v-flex xs12 sm12 md8 offset-md2 pa-1 v-else-if="!hasSubjects">
          <v-card
            @click="$router.push({ path: '/add_subjects' })"
            flat
            style="border-radius: 20px;background-image: linear-gradient( 108deg,  rgba(0,166,81,1) 9.3%, rgba(0,209,174,1) 118.3% );"
          >
            <v-card-title class="justify-center">
              <v-icon x-large color="white">error</v-icon>
            </v-card-title>
            <v-card-text
              class="subheading"
              style="letter-spacing: 2px; text-align:center;"
              >No subjects have been added yet!</v-card-text
            >
          </v-card>
        </v-flex>
        <!-- ============== !-->
      </v-container>
    </div>

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

    <!-- Loader !-->
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
    <!-- ============== !-->
  </div>
</template>

<script>
// import db from "../firebase/init";
import { db } from "../configFirebase";
import firebase from "firebase/app";
import { bus } from "../main";

import "epic-spinners/dist/lib/epic-spinners.min.css";
import OrbitSpinner from "epic-spinners/src/components/lib/OrbitSpinner";

export default {
  components: {
    OrbitSpinner,
  },
  data() {
    return {
      userDB: null,
      snackbar: false,
      msg: null,
      timeout: 3000,
      color: undefined,
      subj: [],
      dupeSubj: [],
      dupeTimetable: [],
      isDupe: null,
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
      attLogged: null,
      hastt: null,
    };
  },
  methods: {
    subjVerify(event, color, color2, color3, mode, value) {
      let iconNode = event.target.parentNode.children;

      if (event.target.classList.contains(`${color}--text`)) {
        event.target.classList.remove(`${color}--text`);
        mode.splice(mode.indexOf(value), 1);
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
        mode.push(value);
      }
    },
    presentSub(value, event) {
      if (this.absent.includes(value)) {
        this.absent.splice(this.absent.indexOf(value), 1);
      } else if (this.cancelled.includes(value)) {
        this.cancelled.splice(this.cancelled.indexOf(value), 1);
      }

      this.subjVerify(event, "black", "red", "brown", this.present, value);
    },
    absentSub(value, event) {
      if (this.present.includes(value)) {
        this.present.splice(this.present.indexOf(value), 1);
      } else if (this.cancelled.includes(value)) {
        this.cancelled.splice(this.cancelled.indexOf(value), 1);
      }

      this.subjVerify(event, "red", "black", "brown", this.absent, value);
    },
    cancelSub(value, event) {
      if (this.present.includes(value)) {
        this.present.splice(this.present.indexOf(value), 1);
      } else if (this.absent.includes(value)) {
        this.absent.splice(this.absent.indexOf(value), 1);
      }

      this.subjVerify(event, "brown", "red", "black", this.cancelled, value);
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
        this.msg = "Attendance Cannot Be Relogged!";
        this.snackbar = true;
        this.sendReq = false;
      } else {
        this.color = "success";
        this.msg = "Attendance has been logged!";
        this.snackbar = true;
        this.sendReq = true;
      }

      for (let i in this.subj) {
        let count = 0;
        for (let j = 0; j <= this.subj.length; j++) {
          if (this.subj[i] === this.subj[j]) {
            count++;
            if (count > 1) {
              this.dupeSubj.push(this.subj[j]);
              this.subj.splice(this.subj.indexOf(this.subj[j]), 1);
            }
          }
        }
      }

      if (
        this.present.length + this.absent.length + this.cancelled.length !==
        this.subj.length
      ) {
        this.color = "error";
        this.msg = "Mark Attendance For All Subjects";
        this.snackbar = true;
        this.sendReq = false;
      }

      let obj = {},
        userData,
        dbData;

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
          .then((res) => {
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
                  total: userData.total,
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
                  total: 0,
                };

                if (this.present.includes(someValue)) {
                  verifyAtt("present", someValue, "presentDates", "inc");
                } else if (this.absent.includes(someValue)) {
                  verifyAtt("absent", someValue, "absentDates", "dec");
                } else if (this.cancelled.includes(someValue)) {
                  verifyAtt("cancelled", someValue, "cancelledDates", "eql");
                }
              }
              // console.log(obj);

              if (this.subj.indexOf(this.subj[i]) === this.subj.length - 1) {
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

                dbData = obj;
                console.log(dbData);
                this.userDB
                  .set(
                    { data: dbData, attendance: this.attendData },
                    { merge: true }
                  )
                  .then(() => {
                    this.$router.go({ name: "home" });
                  });
              }
            }
          })
          .catch((err) => {
            console.log("Errarta: ", err);
          });
      }
    },
  },
  created() {
    let user = firebase.auth().currentUser;
    if (user) {
      this.userDB = db.collection("attData").doc(user.uid);
    }

    const self = this;

    bus.$on("dateValue", (data) => {
      this.day = data.date;
      this.currentMonth = data.currentMonth;
      this.currentDate = data.currentDate;
      this.currentYear = data.currentYear;
      this.currentFullDate = data.currentFullDate;

      this.loading = true;
      this.style = "opacity: 0.3";

      getTimetable();

      this.loading = false;
      this.style = "opacity: 1";
    });

    bus.$on("currentDate", (data) => {
      let currDate = data;
      let currDay = new Date(currDate).getDay();
      this.userDB.get().then((res) => {
        let attendance = res.data().attendance;
        let subjects = res.data();

        attendance.splice(attendance.indexOf(currDate), 1);

        Object.keys(subjects.data).forEach((key) => {
          if (
            subjects.data[key].presentDates ||
            subjects.data[key].absentDates ||
            subjects.data[key].cancelledDates
          ) {
            if (subjects.data[key].presentDates.includes(currDate)) {
              subjects.data[key].present -= 1;
              subjects.data[key].total -= 1;
              subjects.data[key].presentDates.splice(
                subjects.data[key].presentDates.indexOf(currDate),
                1
              );
              subjects.data[key].weekdays[currDay] -= 1;
            } else if (subjects.data[key].absentDates.includes(currDate)) {
              subjects.data[key].absent -= 1;
              subjects.data[key].total -= 1;
              subjects.data[key].absentDates.splice(
                subjects.data[key].absentDates.indexOf(currDate),
                1
              );
              subjects.data[key].weekdays[currDay] += 1;
            } else if (subjects.data[key].cancelledDates.includes(currDate)) {
              subjects.data[key].cancelled -= 1;
              subjects.data[key].total -= 1;
              subjects.data[key].cancelledDates.splice(
                subjects.data[key].cancelledDates.indexOf(currDate),
                1
              );
            }
          }
          this.userDB
            .set(
              { data: subjects.data, attendance: attendance },
              { merge: true }
            )
            .then(() => {
              this.$router.go({ path: "/" });
            });
        });

        // for (let i in subjects) {
        //   let obj = subjects[i];
        //   console.log(obj);
        //   // this.useDB.set(
        //   //   { data: obj, attendance: attendance },
        //   //   { merge: true }
        //   // );
        // }
      });
    });

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

    this.currentMonth = months[new Date().getMonth()];
    this.currentDate = new Date().getDate();
    this.day = days[new Date().getDay()];

    function getTimetable() {
      self.loading = true;
      self.style = "opacity: 0.3";
      self.userDB.get().then((res) => {
        self.loading = false;
        self.style = "opacity: 1";

        if (res.data().attendance !== undefined) {
          let attDates = res.data().attendance;

          if (attDates.length === 0) {
            self.attendData = [];
          } else if (attDates.length > 0) {
            self.attendData = attDates;
          }
        }

        // Attlogged
        if (res.data().attendance) {
          if (self.currentFullDate) {
            if (res.data().attendance.includes(self.currentFullDate)) {
              self.attLogged = true;
            } else {
              self.attLogged = false;
            }
          } else {
            if (
              res
                .data()
                .attendance.includes(new Date().toISOString().substr(0, 10))
            ) {
              self.attLogged = true;
            } else {
              self.attLogged = false;
            }
          }
        }
        // ==============

        if (res.data().allSubjects === undefined) {
          self.hasSubjects = false;
        }

        if (res.data().timetable[self.day] !== undefined) {
          let dayValue = res.data()["timetable"][self.day];

          if (dayValue.length > 0) {
            self.subj = dayValue;

            // for(let i = 0; i < dayValue.length; i++){
            //   let count = 0;
            //   for(let j in dayValue){
            //     if(dayValue[i] === dayValue[j]){
            //       count++
            //       if(count > 1){
            //         console.log(self.dupeTimetable)
            //         self.isDupe = true;
            //         self.dupeSubj.push(dayValue[j])
            //         self.dupeTimetable = self.subj.concat()
            //         self.dupeTimetable.splice(dayValue.indexOf(dayValue[j]), 1)
            //         for(let k in self.dupeSubj){
            //           console.log(self.dupeSubj)
            //           self.dupeTimetable.push(self.dupeSubj[k])
            //           self.dupeSubj.splice(self.dupeSubj.indexOf(self.dupeSubj[k]), 1)
            //         }
            //         console.log(self.dupeTimetable)
            //         console.log(self.dupeSubj)
            //         break;
            //       }
            //     }
            //   }
            // }

            self.hasSubjects = true;
            self.hastt = true;
          } else {
            self.hastt = false;
          }
        } else {
          self.hastt = false;
        }
      });
    }

    getTimetable();
  },
};
</script>
