<template>
  <div>
    <v-subheader>{{ currentDate }} {{ currentMonth }}, {{ day }}</v-subheader>
    <v-container>
      <v-layout row wrap>
        <template v-if="hasSubjects">
          <v-flex xs12 sm6 md4 pa-1 v-for="(val, index) in subj" :key="index">
            <v-card>
              <v-card-title primary-title>{{ val }}</v-card-title>
              <v-radio-group row id="logData">
                <v-radio
                  id="devWidth"
                  label="Present"
                  class="ml-2"
                  value="Present"
                  v-on:change="getVal('present', val)"
                ></v-radio>
                <v-radio label="Absent" value="Absent" v-on:change="getVal('absent', val)"></v-radio>
                <v-radio label="Cancelled" value="Cancelled" v-on:change="getVal('cancelled', val)"></v-radio>
              </v-radio-group>
            </v-card>
          </v-flex>
          <v-btn color="blue" :disabled="disabled" v-on:click="submit()">Save</v-btn>
        </template>

        <!-- Make this card better -->
        <v-flex xs12 sm6 md4 pa-1 v-else>
          <v-card>
            <v-card-text>No Timetable Added For {{this.day}}</v-card-text>
            <v-card-actions>
              <p>Add Timetable</p>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-snackbar v-model="snackbar" :timeout="timeout" multi-line bottom :color="color">
      {{ msg }}
      <v-btn flat @click="snackbar === false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import db from "../firebase/init";
import firebase from "firebase";
import { bus } from "../main";

export default {
  data() {
    return {
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
      sendReq: true
    };
  },
  methods: {
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
        this.color = undefined;
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
        } else {
          this.color = "error";
          this.msg = "Enter Data for all subjects";
          this.snackbar = true;
          this.sendReq = false;
        }
      }
      // console.log(this.present);
      // console.log(this.absent);
      // console.log(this.cancelled);

      let obj = {},
        userData,
        dbData;
      let isoDate = new Date().toISOString().substr(0, 10);

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
                  obj[someValue].present += 1;
                  obj[someValue].total += 1;

                  obj[someValue].presentDates.push(cDate);
                  obj[someValue].weekdays[new Date().getDay()] += 1;
                } else if (this.absent.includes(someValue)) {
                  obj[someValue].absent += 1;
                  obj[someValue].total += 1;

                  obj[someValue].absentDates.push(cDate);
                  obj[someValue].weekdays[new Date().getDay()] -= 1;
                } else if (this.cancelled.includes(someValue)) {
                  obj[someValue].cancelled += 1;
                  obj[someValue].total += 1;

                  obj[someValue].cancelledDates.push(cDate);
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

      this.userDB.get().then(res => {
        let dayValue = res.data()["timetable"][this.day];
        if (dayValue) {
          this.subj = dayValue;
          this.hasSubjects = true;
          console.log(`TimeTable Found for ${this.day}`);
        } else {
          this.hasSubjects = false;
          console.log(`No timetable for ${this.day}`);
        }
      });
    });

    this.userDB.get().then(res => {
      if(res.data().attendance !== undefined){
        let attDates = res.data().attendance;

        if (attDates === undefined || attDates.length === 0) {
          this.attendData = [];
        }else if (attDates.length > 0) {
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
      if(res.data().timetable !== undefined){
        if(res.data().timetable[this.day] !== undefined){
          let dayValue = res.data()["timetable"][this.day];
          if (dayValue) {
            this.subj = dayValue;
            this.hasSubjects = true;
            console.log(`TimeTable Found for ${this.day}`);
          }else {
            this.hasSubjects = false;
            console.log(`No timetable for ${this.day}`);
          }
        }  
      }

    });
  }
};
</script>
