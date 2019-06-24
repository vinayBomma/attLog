<template>
  <div>
    <v-subheader>{{ day }}</v-subheader>
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

export default {
  data() {
    return {
      subj: [],
      present: [],
      absent: [],
      cancelled: [],
      hasSubjects: null,
      day: null
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

      // this.$router.push({ name: "about" });
    }
  },
  created() {
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
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
        if (this.day === "Monday") {
          if (res.data().timetable.Monday) {
            this.subj = res.data().timetable.Monday;
            this.hasSubjects = true;
          } else {
            console.log("No timetable for ", this.day);
          }
        } else if (this.day === "Tuesday") {
          if (res.data().timetable.Tuesday) {
            this.subj = res.data().timetable.Tuesday;
            this.hasSubjects = true;
          } else {
            console.log("No timetable for ", this.day);
          }
        } else if (this.day === "Wednesday") {
          if (res.data().timetable.Wednesday) {
            this.subj = res.data().timetable.Wednesday;
            this.hasSubjects = true;
          } else {
            console.log("No timetable for ", this.day);
          }
        } else if (this.day === "Thursday") {
          if (res.data().timetable.Thursday) {
            this.subj = res.data().timetable.Thursday;
            this.hasSubjects = true;
          } else {
            console.log("No timetable for ", this.day);
          }
        } else if (this.day === "Friday") {
          if (res.data().timetable.Friday) {
            this.subj = res.data().timetable.Friday;
            this.hasSubjects = true;
          } else {
            console.log("No timetable for ", this.day);
          }
        } else if (this.day === "Saturday") {
          if (res.data().timetable.Saturday) {
            this.subj = res.data().timetable.Saturday;
            this.hasSubjects = true;
          } else {
            console.log("No timetable for ", this.day);
          }
        }
      });
  }
};

// db.collection("attData")
//   .doc("test")
//   .set({
//     present: this.present,
//     absent: this.absent,
//     cancelled: this.cancelled
//   });
</script>
