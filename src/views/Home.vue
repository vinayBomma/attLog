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
          <v-btn color="blue" v-on:click="submit()">Save</v-btn>
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
  </div>
</template>

<script>
import db from "../firebase/init";
import { bus } from "../main";

export default {
  data() {
    return {
      subj: [],
      present: [],
      absent: [],
      cancelled: [],
      hasSubjects: null,
      day: null,
      currentDate: null,
      currentMonth: null
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
      console.log(this.present);
      console.log(this.absent);
      console.log(this.cancelled);

      // db.collection("attData")
      //   .doc("test")
      //   .set(
      //     {
      //       present: this.present,
      //       absent: this.absent,
      //       cancelled: this.cancelled
      //     },
      //     { merge: true }
      //   )

      let obj = {}

      for(let i in this.subj){
        obj[this.subj[i]] = {
          'present': 0,
          'absent': 0,
          'cancelled': 0,
          'total': 0
        }

        if(this.present.includes(this.subj[i])){
          obj[this.subj[i]].present += 1
          obj[this.subj[i]].total += 1
        } else if(this.absent.includes(this.subj[i])){
          obj[this.subj[i]].absent += 1
          obj[this.subj[i]].total += 1
        } else if(this.cancelled.includes(this.subj[i])){
          obj[this.subj[i]].cancelled += 1
        }
      }

      db.collection("attData").doc('test').set({
        data: obj
      }, {merge: true})

      this.$router.push({ name: "home" });
    }
  },
  created() {
    bus.$on("dateValue", data => {
      this.day = data.date;
      this.currentMonth = data.currentMonth
      this.currentDate = data.currentDate

      db.collection("attData")
        .doc("test")
        .get()
        .then(res => {
          let dayValue = res.data()["timetable"][this.day];

          if (dayValue) {
            this.subj = dayValue;
            this.hasSubjects = true;
            console.log(`TimeTable Found for ${this.day}`);
          } else {
            console.log(`No timetable for ${this.day}`);
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

    // Code to fix the padding issue, make required changes
    // if(window.screen.width > 370){
    //   document.getElementById('devWidth').className += "ml-2"
    //   console.log(document.getElementById('devWidth'))
    // }

    db.collection("attData")
      .doc("test")
      .get()
      .then(res => {
        let dayValue = res.data()["timetable"][this.day];

        if (dayValue) {
          this.subj = dayValue;
          this.hasSubjects = true;
          console.log(`TimeTable Found for ${this.day}`);
        } else {
          console.log(`No timetable for ${this.day}`);
        }
      });
  }
};
</script>
