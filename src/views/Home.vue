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
    <v-snackbar v-model="snackbar" multi-line top>Attendance logged
     <!-- <v-btn @click="snackbar === false">Close</v-btn>  -->
    </v-snackbar> 
  </div>
</template>

<script>
import db from "../firebase/init";
import { bus } from "../main";

export default {
  data() {
    return {
      snackbar: false,
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
      for (let i in this.subj){
        if(this.present.includes(this.subj[i]) || this.absent.includes(this.subj[i]) || this.cancelled.includes(this.subj[i])){
          // console.log('good to go')
        }else{
          // console.log('dont piss me off')
        }
      }
      // console.log(this.present);
      // console.log(this.absent);
      // console.log(this.cancelled);

      let obj = {}, userData, dbData;
      let isoDate = new Date().toISOString().substr(0, 10);

      db.collection("attData")
        .doc("test")
        .get()
        .then(res => {
          for (let i in this.subj) {
            let someValue = this.subj[i];
            userData = res.data().data[someValue];

            if (userData !== undefined) {
              obj[someValue] = {
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

                if(!this.currentFullDate){

                  if(obj[someValue].absentDates.includes(isoDate)){
                    obj[someValue].absentDates.splice(obj[someValue].absentDates.indexOf(isoDate), 1);
                  }
                  
                  if(obj[someValue].cancelledDates.includes(isoDate)){
                    obj[someValue].cancelledDates.splice(obj[someValue].cancelledDates.indexOf(isoDate), 1);
                  }
                  
                  if(obj[someValue].presentDates.includes(isoDate)){
                    obj[someValue].presentDates.splice(obj[someValue].presentDates.indexOf(isoDate), 1);
                  }

                  obj[someValue].presentDates.push(isoDate)
                }else{

                  if(obj[someValue].absentDates.includes(new Date(this.currentFullDate).toISOString().substr(0, 10))){
                    obj[someValue].absentDates.splice(obj[someValue].absentDates.indexOf(new Date(this.currentFullDate).toISOString().substr(0, 10)), 1);
                  }
                  
                  if(obj[someValue].cancelledDates.includes(new Date(this.currentFullDate).toISOString().substr(0, 10))){
                    obj[someValue].cancelledDates.splice(obj[someValue].cancelledDates.indexOf(new Date(this.currentFullDate).toISOString().substr(0, 10)), 1);
                  }
                  
                  if(obj[someValue].presentDates.includes(new Date(this.currentFullDate).toISOString().substr(0, 10))){
                    obj[someValue].presentDates.splice(obj[someValue].presentDates.indexOf(new Date(this.currentFullDate).toISOString().substr(0, 10)), 1);
                  }

                  obj[someValue].presentDates.push(new Date(this.currentFullDate).toISOString().substr(0, 10))
                }
                
              } else if (this.absent.includes(someValue)) {
                obj[someValue].absent += 1;
                obj[someValue].total += 1;
                
                if(!this.currentFullDate){

                  if(obj[someValue].absentDates.includes(isoDate)){
                    obj[someValue].absentDates.splice(obj[someValue].absentDates.indexOf(isoDate), 1);
                  }
                  
                  if(obj[someValue].cancelledDates.includes(isoDate)){
                    obj[someValue].cancelledDates.splice(obj[someValue].cancelledDates.indexOf(isoDate), 1);
                  }
                  
                  if(obj[someValue].presentDates.includes(isoDate)){
                    obj[someValue].presentDates.splice(obj[someValue].presentDates.indexOf(isoDate), 1);
                  }

                  obj[someValue].absentDates.push(isoDate)
                }else{

                  if(obj[someValue].absentDates.includes(new Date(this.currentFullDate).toISOString().substr(0, 10))){
                    obj[someValue].absentDates.splice(obj[someValue].absentDates.indexOf(new Date(this.currentFullDate).toISOString().substr(0, 10)), 1);
                  }
                  
                  if(obj[someValue].cancelledDates.includes(new Date(this.currentFullDate).toISOString().substr(0, 10))){
                    obj[someValue].cancelledDates.splice(obj[someValue].cancelledDates.indexOf(new Date(this.currentFullDate).toISOString().substr(0, 10)), 1);
                  }
                  
                  if(obj[someValue].presentDates.includes(new Date(this.currentFullDate).toISOString().substr(0, 10))){
                    obj[someValue].presentDates.splice(obj[someValue].presentDates.indexOf(new Date(this.currentFullDate).toISOString().substr(0, 10)), 1);
                  }

                  obj[someValue].absentDates.push(new Date(this.currentFullDate).toISOString().substr(0, 10))
                }

              } else if (this.cancelled.includes(someValue)) {
                obj[someValue].cancelled += 1;

                if(!this.currentFullDate){

                  if(obj[someValue].absentDates.includes(isoDate)){
                    obj[someValue].absentDates.splice(obj[someValue].absentDates.indexOf(isoDate), 1);
                  }
                  
                  if(obj[someValue].cancelledDates.includes(isoDate)){
                    obj[someValue].cancelledDates.splice(obj[someValue].cancelledDates.indexOf(isoDate), 1);
                  }
                  
                  if(obj[someValue].presentDates.includes(isoDate)){
                    obj[someValue].presentDates.splice(obj[someValue].presentDates.indexOf(isoDate), 1);
                  }

                  obj[someValue].cancelledDates.push(isoDate)
                }else{

                  if(obj[someValue].absentDates.includes(new Date(this.currentFullDate).toISOString().substr(0, 10))){
                    obj[someValue].absentDates.splice(obj[someValue].absentDates.indexOf(new Date(this.currentFullDate).toISOString().substr(0, 10)), 1);
                  }
                  
                  if(obj[someValue].cancelledDates.includes(new Date(this.currentFullDate).toISOString().substr(0, 10))){
                    obj[someValue].cancelledDates.splice(obj[someValue].cancelledDates.indexOf(new Date(this.currentFullDate).toISOString().substr(0, 10)), 1);
                  }
                  
                  if(obj[someValue].presentDates.includes(new Date(this.currentFullDate).toISOString().substr(0, 10))){
                    obj[someValue].presentDates.splice(obj[someValue].presentDates.indexOf(new Date(this.currentFullDate).toISOString().substr(0, 10)), 1);
                  }

                  obj[someValue].cancelledDates.push(new Date(this.currentFullDate).toISOString().substr(0, 10))
                }

              }

            } else {
              obj[someValue] = {
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
                
                if(!this.currentFullDate){
                  obj[someValue].presentDates.push(isoDate)
                }else{
                  obj[someValue].presentDates.push(new Date(this.currentFullDate).toISOString().substr(0, 10))
                }

              } else if (this.absent.includes(someValue)) {
                obj[someValue].absent += 1;
                obj[someValue].total += 1;
                
                if(!this.currentFullDate){
                  obj[someValue].absentDates.push(isoDate)
                }else{
                  obj[someValue].absentDates.push(new Date(this.currentFullDate).toISOString().substr(0, 10))
                }

              } else if (this.cancelled.includes(someValue)) {
                obj[someValue].cancelled += 1;
                
                if(!this.currentFullDate){
                  obj[someValue].cancelledDates.push(isoDate)
                }else{
                  obj[someValue].cancelledDates.push(new Date(this.currentFullDate).toISOString().substr(0, 10))
                }
                
              }
            }

            if (this.subj.indexOf(this.subj[i]) === this.subj.length - 1) {
              dbData = obj
              db.collection("attData").doc("test").set({data: dbData}, { merge: true });

              db.collection("attData").doc("test").set({
                attendance: {
                  today: {
                    'present': this.present,
                    'absent': this.absent,
                    'cancelled': this.cancelled
                  }
                }
              }, { merge: true });
            }
          }
        }).catch((err) => {
          console.log('Errarta: ', err)
        });

      this.$router.push({ name: "home" });
      this.snackbar = true
    }
  },
  created() {
    bus.$on("dateValue", data => {
      this.day = data.date;
      this.currentMonth = data.currentMonth;
      this.currentDate = data.currentDate;
      this.currentYear = data.currentYear;
      this.currentFullDate = data.currentFullDate;

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
