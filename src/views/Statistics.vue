<template>
  <section>
    <div :style="style">
      <div v-if="showStat">
        <v-flex xs5 pt-2 pl-2>
          <v-select :items="items" v-model="currentItem" v-on:change="statChange" solo></v-select>
        </v-flex>
        <v-container>
          <v-layout row wrap>
            <v-flex xs12 sm12 md4 pl-1 pr-1 pb-1>
              <v-card>
                <div id="doughnut" style="display: block;">
                  <canvas id="mychart1" width="400" height="300" class="pa-2"></canvas>
                </div>
              </v-card>
            </v-flex>

            <v-flex xs6 sm6 md4 pa-1>
              <v-card>
                <v-layout justify-center>
                  <v-progress-circular
                    rotate="360"
                    size="100"
                    width="15"
                    color="teal"
                    :value="value"
                    class="mt-2"
                  >{{value}}%</v-progress-circular>
                </v-layout>
                <v-layout justify-center>
                  <p class="mt-2" text-align="center">Attendance</p>
                </v-layout>
              </v-card>
            </v-flex>

            <v-flex xs6 sm6 md4 pa-1>
              <v-card>
                <v-layout justify-center>
                  <v-card-title class="display-3">{{sign}}{{ leaves }}</v-card-title>
                </v-layout>
                <v-layout justify-center>
                  <p class="text-xs-center mt-2 mb-3">Leaves Remaining</p>
                </v-layout>
              </v-card>
            </v-flex>

            <!-- <v-flex xs12 sm6 md4 pa-1>
              <v-card>
                <v-layout row>
                  <v-card-title>History</v-card-title>
                </v-layout>
                <v-date-picker v-model="date1" no-title readonly :events="dateEvent" full-width></v-date-picker>
              </v-card>
            </v-flex>-->
          </v-layout>
        </v-container>
      </div>
      <div v-else-if="!showStat">
        <v-container>
          <v-card>
            <v-card-text>No Statistics Available</v-card-text>
          </v-card>
        </v-container>
      </div>
    </div>

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
// const Chart = () => import('chart.js')
import Chart from "chart.js";
import {db} from '../configFirebase'
import firebase from "firebase/app";

import "epic-spinners/dist/lib/epic-spinners.min.css";
import OrbitSpinner from "epic-spinners/src/components/lib/OrbitSpinner";

export default {
  components: {
    OrbitSpinner
  },
  data() {
    return {
      userDB: null,
      moreEvents: null,
      date1: new Date().toISOString().substr(0, 10),
      value: 75,
      items: [],
      currentItem: null,
      showStat: true,
      loading: false,
      style: "opacity: 1",
      leaves: 0,
      sign: "",
      track: 100
    };
  },
  methods: {
    createChart(chartId, chartData) {
      const ctx = document.getElementById(chartId);
      new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options
      });
    },
    dateEvent(date) {
      const [, , day] = date.split("-");
      // console.log(let [,,date])
      if ([12, 17, 28].includes(parseInt(day, 10))) return true;
      if ([1, 19, 22].includes(parseInt(day, 10))) return ["red", "green"];
      return false;
    },
    statChange() {
      this.userDB.get().then(res => {
        let statData = res.data().data[this.currentItem];

        let pieData = [
          statData.present,
          statData.absent,
          statData.cancelled,
          statData.total
        ];

        if (pieData[3] > 0 && pieData[2] === pieData[3]) {
          this.value = 100;
        } else if (pieData[3] === pieData[0] + pieData[2]) {
          this.value = 100;
        } else {
          this.value = Math.floor(
            (pieData[0] * 100) / (pieData[3] - pieData[2])
          );
        }

        let obj = {
          type: "pie",
          data: {
            labels: ["Present", "Absent", "Cancelled", "Total"],
            datasets: [
              {
                label: "# of Votes",
                data: pieData,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                  "rgba(255, 159, 64, 0.2)"
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 159, 64, 1)"
                ],
                borderWidth: 1
                // fill: false
              }
            ]
          },
          options: {
            legend: {
              display: true,
              position: "left"
            }
          }
        };

        this.createChart("mychart1", obj);

        if (this.value >= 75) {
          this.track = this.value;
          for (let i = 1; this.track >= 75; i++) {
            this.track = Math.floor(
              (pieData[0] * 100) / (pieData[3] + i - pieData[2])
            );
            if (this.track <= 75) {
              this.leaves = i - 1;
              this.sign = "+";
            }
          }
        } else if (this.value <= 75) {
          this.track = this.value;
          for (let i = 1; this.track <= 75; i++) {
            this.track = Math.floor(
              ((pieData[0] + i) * 100) / (pieData[3] + i - pieData[2])
            );
            if (this.track >= 75) {
              this.leaves = i - 1;
              this.sign = "-";
            }
          }
        }

        if (this.leaves === 0) {
          this.sign = "";
        }
      });
    }
  },
  mounted() {
    this.loading = true;
    this.style = "opacity: 0.3";
    this.userDB.get().then(res => {
      this.loading = false;
      this.style = "opacity: 1";
      this.items = res.data().allSubjects;
      this.currentItem = res.data().allSubjects[0];

      let statData = res.data().data[this.currentItem];

      let pieData = [
        statData.present,
        statData.absent,
        statData.cancelled,
        statData.total
      ];

      if (pieData[0] === 0 || pieData[1] === 0) {
        this.value = 100;
      } else {
        this.value = Math.floor((pieData[0] * 100) / (pieData[3] - pieData[2]));
      }

      let obj = {
        type: "pie",
        data: {
          labels: ["Present", "Absent", "Cancelled", "Total"],
          datasets: [
            {
              label: "# of Votes",
              data: pieData,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)"
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)"
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          legend: {
            display: true,
            position: "left"
          }
        }
      };

      this.createChart("mychart1", obj);

      if (this.value >= 75) {
        this.track = this.value;
        for (let i = 1; this.track >= 75; i++) {
          this.track = Math.floor(
            (pieData[0] * 100) / (pieData[3] + i - pieData[2])
          );
          if (this.track <= 75) {
            this.leaves = i - 1;
            this.sign = "+";
          }
        }
      } else if (this.value <= 75) {
        this.track = this.value;
        for (let i = 1; this.track <= 75; i++) {
          this.track = Math.floor(
            ((pieData[0] + i) * 100) / (pieData[3] + i - pieData[2])
          );
          if (this.track >= 75) {
            this.leaves = i - 1;
            this.sign = "-";
          }
        }
      }

      if (this.leaves === 0) {
        this.sign = "";
      }
    });
  },
  created() {
    let user = firebase.auth().currentUser;
    if (user) {
      this.userDB = db.collection("attData").doc(user.uid);
    }

    this.loading = true;
    this.style = "opacity: 0.3";
    this.userDB.get().then(res => {
      this.loading = false;
      this.style = "opacity: 1";
      if (res.data().allSubjects === undefined) {
        this.showStat = false;
      } else {
        this.showStat = true;
      }
    });
  }
};
</script>