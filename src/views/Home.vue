<template>
  <div>
    <v-subheader>Monday</v-subheader>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12 sm6 md4 pa-1 v-for="(val, index) in subj" :key="index">
          <v-card>
            <v-card-title primary-title>{{ val }}</v-card-title>
            <v-radio-group row id="logData">
              <v-radio label="Present" value="Present" v-on:change="getVal('present', val)"></v-radio>
              <v-radio label="Absent" value="Absent" v-on:change="getVal('absent', val)"></v-radio>
              <v-radio label="Cancelled" value="Cancelled" v-on:change="getVal('cancelled', val)"></v-radio>
            </v-radio-group>
          </v-card>
        </v-flex>
        <v-btn color="blue" v-on:click="submit()">Save</v-btn>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import db from "../firebase/init";
export default {
  data() {
    return {
      subj: [
        "Python",
        "Java",
        "Discrete math",
        "Statistics",
        "Linux",
        "Data Structures"
      ],
      present: [],
      absent: [],
      cancelled: []
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
      // console.log(`Subject: ${sub} - ${data}`)
    },
    submit: function() {
      console.log("Present: ", this.present);
      console.log("Absent: ", this.absent);
      console.log("Cancelled: ", this.cancelled);

      db.collection("attData")
        .doc("test")
        .set({
          present: this.present,
          absent: this.absent,
          cancelled: this.cancelled
        });

      this.$router.push({ name: "about" });
    }
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
