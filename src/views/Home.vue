<template>
  <div>
    <div :style="style">
      <!-- <v-dialog v-model="loading" hide-overlay persistent full-width>
      <v-card>
        <OrbitSpinner :size="55" :color="'#ff1d5e'" />
      </v-card>
      </v-dialog>-->
      <v-subheader>{{ currentDate }} {{ currentMonth }}, {{ day }}</v-subheader>
      <v-container fluid>
        <v-layout row wrap>
          <template v-if="hasSubjects && !attLogged">
            <v-flex xs12 sm6 md4 pa-1 v-for="(val, index) in subj" :key="index">
              <v-card>
                <v-card-title primary-title>
                  {{val}}
                  <v-radio-group row id="logData">
                    <v-layout align-start row wrap>
                      <v-radio
                        id="devWidth"
                        label="Present"
                        value="Present"
                        v-on:change="getVal('present', val)"
                      ></v-radio>
                      <v-radio label="Absent" value="Absent" v-on:change="getVal('absent', val)"></v-radio>
                      <v-radio
                        label="Cancelled"
                        value="Cancelled"
                        v-on:change="getVal('cancelled', val)"
                      ></v-radio>
                    </v-layout>
                  </v-radio-group>
                </v-card-title>
                <!-- <v-radio-group row id="logData">
                  <v-layout align-start justify-center fill-height row>
                    <v-radio
                      id="devWidth"
                      label="Present"
                      value="Present"
                      v-on:change="getVal('present', val)"
                    ></v-radio>
                    <v-radio label="Absent" value="Absent" v-on:change="getVal('absent', val)"></v-radio>
                    <v-radio
                      label="No Lecture"
                      value="Cancelled"
                      v-on:change="getVal('cancelled', val)"
                    ></v-radio>
                  </v-layout>
                </v-radio-group>-->
              </v-card>
            </v-flex>
            <v-btn color="blue" :disabled="disabled" v-on:click="submit()">Save</v-btn>
          </template>

          <v-flex xs12 sm6 md4 pa-1 v-else-if="!hasSubjects&& attLogged">
            <v-card>
              <v-card-text>Attendance Has Been Logged For This Day</v-card-text>
            </v-card>
          </v-flex>

          <!-- Make this card better -->
          <v-flex xs12 sm6 md4 pa-1 v-else-if="!hasSubjects&& !attLogged">
            <v-card>
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
import db from "../firebase/init";
import firebase from "firebase";
import { bus } from "../main";

import "epic-spinners/dist/lib/epic-spinners.min.css";
import OrbitSpinner from "epic-spinners/src/components/lib/OrbitSpinner";

export default {
  components: {
    OrbitSpinner
  },
  data() {
    return {
      seasons: ["Winter", "Spring", "Summer"],
      userDB: null,
      snackbar: false,
      msg: null,
      timeout: 3000,
      color: undefined,
      disabled: false,
      subj: [],
      present: [],
      absent: [],
      cancelled: [],
      hasSubjects: null,
      day: null,
      currentDate: null,
      currentMonth: null,
      currentYear: null,
      currentFullDate: null,
      attendData: [],
      sendReq: true,
      isDupe: false,
      dupeSub: [],
      loading: false,
      style: "opacity: 1",
      attLogged: null
    };
  },
  methods: {
    season(val) {
      return this.seasons[val];
    },
    getVal: function(data, sub) {
      // Checks if sub is in another array(absent, cancelled), if yes then removes it

      if (data == "present") {
        if (this.absent.includes(sub)) {
          this.absent.splice(this.absent.indexOf(sub), 1);
        } else if (this.cancelled.includes(sub)) {
          this.cancelled.splice(this.cancelled.indexOf(sub), 1);
        }
        this.present.push(sub);
      } else if (data == "absent") {
        if (this.present.includes(sub)) {
          this.present.splice(this.present.indexOf(sub), 1);
        } else if (this.cancelled.includes(sub)) {
          this.cancelled.splice(this.cancelled.indexOf(sub), 1);
        }
        this.absent.push(sub);
      } else if (data == "cancelled") {
        if (this.present.includes(sub)) {
          this.present.splice(this.present.indexOf(sub), 1);
        } else if (this.absent.includes(sub)) {
          this.absent.splice(this.absent.indexOf(sub), 1);
        }
        this.cancelled.push(sub);
      }
    },
    submit: function() {
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

      for (let i in this.subj) {
        if (
          this.present.includes(this.subj[i]) ||
          this.absent.includes(this.subj[i]) ||
          this.cancelled.includes(this.subj[i])
        ) {
          // Checks if data for every subject is selected
        } else {
          this.color = "error";
          this.msg = "Select Attendance For All Subjects";
          this.snackbar = true;
          this.sendReq = false;
        }
      }
      console.log(this.present);
      console.log(this.absent);
      console.log(this.cancelled);

      let obj = {},
        userData,
        dbData;
      let someData = {};
      let isoDate = new Date().toISOString().substr(0, 10);

      if (this.sendReq) {
        this.userDB
          .get()
          .then(res => {
            for (let i in this.subj) {
              let someValue = this.subj[i];

              if (this.dupeSub.includes(someValue)) {
                let dupeData = someValue;
                someValue = someValue.slice(0, -12);
                someData[someValue] = {
                  weekdays: [0, 0, 0, 0, 0, 0, 0],
                  presentDates: [],
                  absentDates: [],
                  cancelledDates: [],
                  present: 0,
                  absent: 0,
                  cancelled: 0,
                  total: 0
                };
                if (this.present.includes(dupeData)) {
                  someData[someValue].present += 1;
                  someData[someValue].total += 1;

                  someData[someValue].presentDates.push(cDate);
                  someData[someValue].weekdays[new Date().getDay()] += 1;
                } else if (this.absent.includes(dupeData)) {
                  someData[someValue].absent += 1;
                  someData[someValue].total += 1;

                  someData[someValue].absentDates.push(cDate);
                  someData[someValue].weekdays[new Date().getDay()] -= 1;
                } else if (this.cancelled.includes(dupeData)) {
                  someData[someValue].cancelled += 1;
                  someData[someValue].total += 1;

                  someData[someValue].cancelledDates.push(cDate);
                }
                // console.log(someData);
                continue;
              }

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
                  obj[someValue].present += 1;
                  obj[someValue].total += 1;

                  obj[someValue].presentDates.push(cDate);
                  obj[someValue].weekdays[new Date().getDay()] += 1;

                  if (this.dupeSub.includes(someValue + " (Duplicate)")) {
                    let duplicateSub = someValue + " (Duplicate)";
                    if (this.present.includes(duplicateSub)) {
                      // console.log("present");
                      obj[someValue].present += someData[someValue].present;
                      obj[someValue].total += someData[someValue].total;

                      obj[someValue].presentDates.push(
                        someData[someValue].presentDates[0]
                      );
                      obj[someValue].weekdays[new Date().getDay()] += 1;
                      someData = {};
                    } else if (this.absent.includes(duplicateSub)) {
                      // console.log("absent");
                      obj[someValue].absent += someData[someValue].absent;
                      obj[someValue].total += someData[someValue].total;

                      obj[someValue].absentDates.push(
                        someData[someValue].absentDates[0]
                      );
                      obj[someValue].weekdays[new Date().getDay()] -= 1;
                      someData = {};
                    } else if (this.cancelled.includes(duplicateSub)) {
                      // console.log("cancelled");
                      obj[someValue].cancelled += someData[someValue].cancelled;
                      obj[someValue].total += someData[someValue].total;

                      obj[someValue].cancelledDates.push(
                        someData[someValue].cancelledDates[0]
                      );
                      someData = {};
                    }
                  }
                } else if (this.absent.includes(someValue)) {
                  obj[someValue].absent += 1;
                  obj[someValue].total += 1;

                  obj[someValue].absentDates.push(cDate);
                  obj[someValue].weekdays[new Date().getDay()] -= 1;

                  if (this.dupeSub.includes(someValue + " (Duplicate)")) {
                    let duplicateSub = someValue + " (Duplicate)";
                    if (this.present.includes(duplicateSub)) {
                      // console.log("present");
                      obj[someValue].present += someData[someValue].present;
                      obj[someValue].total += someData[someValue].total;

                      obj[someValue].presentDates.push(
                        someData[someValue].presentDates[0]
                      );
                      obj[someValue].weekdays[new Date().getDay()] += 1;
                      someData = {};
                    } else if (this.absent.includes(duplicateSub)) {
                      // console.log("absent");
                      obj[someValue].absent += someData[someValue].absent;
                      obj[someValue].total += someData[someValue].total;

                      obj[someValue].absentDates.push(
                        someData[someValue].absentDates[0]
                      );
                      obj[someValue].weekdays[new Date().getDay()] -= 1;
                      someData = {};
                    } else if (this.cancelled.includes(duplicateSub)) {
                      // console.log("cancelled");
                      obj[someValue].cancelled += someData[someValue].cancelled;
                      obj[someValue].total += someData[someValue].total;

                      obj[someValue].cancelledDates.push(
                        someData[someValue].cancelledDates[0]
                      );
                      someData = {};
                    }
                  }
                } else if (this.cancelled.includes(someValue)) {
                  obj[someValue].cancelled += 1;
                  obj[someValue].total += 1;

                  obj[someValue].cancelledDates.push(cDate);

                  if (this.dupeSub.includes(someValue + " (Duplicate)")) {
                    let duplicateSub = someValue + " (Duplicate)";
                    if (this.present.includes(duplicateSub)) {
                      // console.log("present");
                      obj[someValue].present += someData[someValue].present;
                      obj[someValue].total += someData[someValue].total;

                      obj[someValue].presentDates.push(
                        someData[someValue].presentDates[0]
                      );
                      obj[someValue].weekdays[new Date().getDay()] += 1;
                      someData = {};
                    } else if (this.absent.includes(duplicateSub)) {
                      // console.log("absent");
                      obj[someValue].absent += someData[someValue].absent;
                      obj[someValue].total += someData[someValue].total;

                      obj[someValue].absentDates.push(
                        someData[someValue].absentDates[0]
                      );
                      obj[someValue].weekdays[new Date().getDay()] -= 1;
                      someData = {};
                    } else if (this.cancelled.includes(duplicateSub)) {
                      // console.log("cancelled");
                      obj[someValue].cancelled += someData[someValue].cancelled;
                      obj[someValue].total += someData[someValue].total;

                      obj[someValue].cancelledDates.push(
                        someData[someValue].cancelledDates[0]
                      );
                      someData = {};
                    }
                  }
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
                  obj[someValue].present += 1;
                  obj[someValue].total += 1;

                  if (!this.currentFullDate) {
                    obj[someValue].presentDates.push(isoDate);
                    obj[someValue].weekdays[new Date().getDay()] += 1;
                  } else {
                    obj[someValue].presentDates.push(
                      new Date(this.currentFullDate).toISOString().substr(0, 10)
                    );
                    obj[someValue].weekdays[
                      new Date(this.currentFullDate).getDay()
                    ] += 1;
                  }

                  if (this.dupeSub.includes(someValue + " (Duplicate)")) {
                    let duplicateSub = someValue + " (Duplicate)";
                    if (this.present.includes(duplicateSub)) {
                      // console.log("present");
                      obj[someValue].present += someData[someValue].present;
                      obj[someValue].total += someData[someValue].total;

                      obj[someValue].presentDates.push(
                        someData[someValue].presentDates[0]
                      );
                      obj[someValue].weekdays[new Date().getDay()] += 1;
                      someData = {};
                    } else if (this.absent.includes(duplicateSub)) {
                      // console.log("absent");
                      obj[someValue].absent += someData[someValue].absent;
                      obj[someValue].total += someData[someValue].total;

                      obj[someValue].absentDates.push(
                        someData[someValue].absentDates[0]
                      );
                      obj[someValue].weekdays[new Date().getDay()] -= 1;
                      someData = {};
                    } else if (this.cancelled.includes(duplicateSub)) {
                      // console.log("cancelled");
                      obj[someValue].cancelled += someData[someValue].cancelled;
                      obj[someValue].total += someData[someValue].total;

                      obj[someValue].cancelledDates.push(
                        someData[someValue].cancelledDates[0]
                      );
                      someData = {};
                    }
                  }
                } else if (this.absent.includes(someValue)) {
                  obj[someValue].absent += 1;
                  obj[someValue].total += 1;

                  if (!this.currentFullDate) {
                    obj[someValue].absentDates.push(isoDate);
                    obj[someValue].weekdays[new Date().getDay()] -= 1;
                  } else {
                    obj[someValue].absentDates.push(
                      new Date(this.currentFullDate).toISOString().substr(0, 10)
                    );
                    obj[someValue].weekdays[
                      new Date(this.currentFullDate).getDay()
                    ] -= 1;
                  }

                  if (this.dupeSub.includes(someValue + " (Duplicate)")) {
                    let duplicateSub = someValue + " (Duplicate)";
                    if (this.present.includes(duplicateSub)) {
                      // console.log("present");
                      obj[someValue].present += someData[someValue].present;
                      obj[someValue].total += someData[someValue].total;

                      obj[someValue].presentDates.push(
                        someData[someValue].presentDates[0]
                      );
                      obj[someValue].weekdays[new Date().getDay()] += 1;
                      someData = {};
                    } else if (this.absent.includes(duplicateSub)) {
                      // console.log("absent");
                      obj[someValue].absent += someData[someValue].absent;
                      obj[someValue].total += someData[someValue].total;

                      obj[someValue].absentDates.push(
                        someData[someValue].absentDates[0]
                      );
                      obj[someValue].weekdays[new Date().getDay()] -= 1;
                      someData = {};
                    } else if (this.cancelled.includes(duplicateSub)) {
                      // console.log("cancelled");
                      obj[someValue].cancelled += someData[someValue].cancelled;
                      obj[someValue].total += someData[someValue].total;

                      obj[someValue].cancelledDates.push(
                        someData[someValue].cancelledDates[0]
                      );
                      someData = {};
                    }
                  }
                } else if (this.cancelled.includes(someValue)) {
                  obj[someValue].cancelled += 1;
                  obj[someValue].total += 1;

                  if (!this.currentFullDate) {
                    obj[someValue].cancelledDates.push(isoDate);
                  } else {
                    obj[someValue].cancelledDates.push(
                      new Date(this.currentFullDate).toISOString().substr(0, 10)
                    );
                  }

                  if (this.dupeSub.includes(someValue + " (Duplicate)")) {
                    let duplicateSub = someValue + " (Duplicate)";
                    if (this.present.includes(duplicateSub)) {
                      // console.log("present");
                      obj[someValue].present += someData[someValue].present;
                      obj[someValue].total += someData[someValue].total;

                      obj[someValue].presentDates.push(
                        someData[someValue].presentDates[0]
                      );
                      obj[someValue].weekdays[new Date().getDay()] += 1;
                      someData = {};
                    } else if (this.absent.includes(duplicateSub)) {
                      // console.log("absent");
                      obj[someValue].absent += someData[someValue].absent;
                      obj[someValue].total += someData[someValue].total;

                      obj[someValue].absentDates.push(
                        someData[someValue].absentDates[0]
                      );
                      obj[someValue].weekdays[new Date().getDay()] -= 1;
                      someData = {};
                    } else if (this.cancelled.includes(duplicateSub)) {
                      // console.log("cancelled");
                      obj[someValue].cancelled += someData[someValue].cancelled;
                      obj[someValue].total += someData[someValue].total;

                      obj[someValue].cancelledDates.push(
                        someData[someValue].cancelledDates[0]
                      );
                      someData = {};
                    }
                  }
                }
              }

              if (this.subj.indexOf(this.subj[i]) === this.subj.length - 1) {
                dbData = obj;
                console.log(dbData);
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

                this.userDB.set(
                  { attendance: this.attendData },
                  { merge: true }
                );
              }
            }
          })
          .catch(err => {
            console.log("Errarta: ", err);
          });
      }

      this.$router.push({ name: "home" });
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

        // if (res.data().attendance.includes(new Date().toISOString().substr(0, 10)) ===true) {
        //   this.attLogged = true;
        // } else {
        //   this.attLogged = false;
        // }

        let dayValue = res.data()["timetable"][this.day];
        if (dayValue) {
          this.subj = dayValue;
          this.hasSubjects = true;
          console.log(`TimeTable Found for ${this.day}`);

          for (let i in dayValue) {
            if (dayValue[i].includes("Duplicate")) {
              this.isDupe = true;
              let someVal = dayValue[i].slice(0, -12);

              if (this.dupeSub.includes(dayValue[i])) {
                this.dupeSub.splice(this.dupeSub.indexOf(dayValue[i]), 1);
                this.dupeSub.push(dayValue[i]);
              } else {
                this.dupeSub.push(dayValue[i]);
              }
              console.log(this.dupeSub);
            }
          }
        } else {
          this.hasSubjects = false;
          console.log(`No timetable for ${this.day}`);
        }

        if (res.data().attendance.includes(this.currentFullDate) === true) {
          this.attLogged = true;
          this.hasSubjects = false;
        } else {
          this.attLogged = false;
        }
      });
    });

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

    // Code to fix the padding issue, make required changes

    // if(window.screen.width > 370){
    //   document.getElementById('devWidth').className += "ml-2"
    //   console.log(document.getElementById('devWidth'))
    // }

    this.userDB.get().then(res => {
      if (res.data().timetable !== undefined) {
        if (res.data().timetable[this.day] !== undefined) {
          let dayValue = res.data()["timetable"][this.day];

          if (dayValue) {
            this.subj = dayValue;
            this.hasSubjects = true;
            console.log(`TimeTable Found for ${this.day}`);

            for (let i in dayValue) {
              if (dayValue[i].includes("Duplicate")) {
                let someVal = dayValue[i].slice(0, -12);
                this.isDupe = true;
                this.dupeSub.push(dayValue[i]);
              }
            }
          } else {
            this.hasSubjects = false;
            console.log(`No timetable for ${this.day}`);
          }
        }
      }

      if (
        res
          .data()
          .attendance.includes(new Date().toISOString().substr(0, 10)) === true
      ) {
        this.attLogged = true;
        this.hasSubjects = false;
      } else {
        this.attLogged = false;
      }
    });
  }
};
</script>
