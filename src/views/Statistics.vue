<template>
  <section>
    <div :style="style">
      <div v-if="showStat">
        <v-flex xs8 sm6 md3 pt-2 pl-2>
          <v-select
            :items="items"
            v-model="currentItem"
            v-on:change="statChange"
            solo
          ></v-select>
        </v-flex>
        <v-container v-if="!subjectStat">
          <v-card
            flat
            style="border-radius: 20px;background-image: linear-gradient( 108deg,  rgba(0,166,81,1) 9.3%, rgba(0,209,174,1) 118.3% );"
          >
            <v-card-title class="justify-center">
              <v-icon x-large color="white">info</v-icon>
            </v-card-title>
            <v-card-text
              class="subheading"
              style="letter-spacing: 2px; text-align:center;"
              >Statistics not available for this subject!</v-card-text
            >
          </v-card>
        </v-container>
        <v-container v-else-if="subjectStat">
          <v-layout row wrap>
            <!-- Pie Chart !-->
            <v-flex xs12 sm12 md4 pl-1 pr-1 pb-1>
              <v-card>
                <div id="doughnut" style="display: block;">
                  <canvas
                    id="mychart1"
                    width="400"
                    height="300"
                    class="pa-2"
                  ></canvas>
                </div>
              </v-card>
            </v-flex>
            <!-- ============== !-->

            <!-- Percentage !-->
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
                    >{{ value }}%</v-progress-circular
                  >
                </v-layout>
                <v-layout justify-center>
                  <v-card-text style="letter-spacing:1px; text-align:center"
                    >Attendance</v-card-text
                  >
                </v-layout>
              </v-card>
            </v-flex>
            <!-- ============== !-->

            <!-- Leaves Remaining !-->
            <v-flex xs6 sm6 md4 pa-1>
              <v-card>
                <v-layout justify-center>
                  <v-card-title class="display-3"
                    >{{ sign }}{{ leaves }}</v-card-title
                  >
                </v-layout>
                <v-layout justify-center>
                  <v-card-text style="letter-spacing:1px; text-align:center"
                    >Leaves Remaining</v-card-text
                  >
                </v-layout>
              </v-card>
            </v-flex>
            <!-- ============== !-->

            <!-- History View !-->
            <v-flex xs12 sm6 md8 offset-md2 pa-1>
              <v-card>
                <v-card-title
                  class="subheading"
                  style="letter-spacing: 2px; background-image: linear-gradient( 110.7deg,  rgba(9,154,151,1) 6.3%, rgba(21,205,168,1) 90.6% );"
                  >History</v-card-title
                >
                <v-date-picker
                  v-model="date1"
                  no-title
                  readonly
                  :events="objectDates"
                  full-width
                  color="yellow darken-1"
                ></v-date-picker>
              </v-card>
            </v-flex>
            <!-- ============== !-->
          </v-layout>
        </v-container>
      </div>
    </div>

    <!-- No Statistics !-->
    <v-container>
      <v-card
        flat
        v-if="!showStat"
        style="border-radius: 20px;background-image: linear-gradient( 108deg,  rgba(0,166,81,1) 9.3%, rgba(0,209,174,1) 118.3% );"
      >
        <v-card-title class="justify-center">
          <v-icon x-large color="white">info</v-icon>
        </v-card-title>
        <v-card-text
          class="subheading"
          style="letter-spacing: 2px; text-align:center;"
          >No statistics available!</v-card-text
        >
      </v-card>
    </v-container>
    <!-- ============== !-->

    <!-- </div> -->

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
  </section>
</template>

<script>
import Chart from "chart.js";
import { db } from "../configFirebase";
import firebase from "firebase/app";

import "epic-spinners/dist/lib/epic-spinners.min.css";
import OrbitSpinner from "epic-spinners/src/components/lib/OrbitSpinner";

export default {
  components: {
    OrbitSpinner,
  },
  data() {
    return {
      userDB: null,
      date1: new Date().toISOString().substr(0, 10),
      value: 0,
      items: [],
      currentItem: null,
      showStat: true,
      loading: false,
      style: "opacity: 1",
      leaves: 0,
      sign: "",
      track: 100,
      pieData: [],
      obj: {},
      presentDates: [],
      absentDates: [],
      cancelledDates: [],
      objectDates: null,
      subjectStat: true,
      attCriteria: 75,
    };
  },
  methods: {
    createChart(chartId, chartData) {
      const ctx = document.getElementById(chartId);
      new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options,
      });
    },
    pieChart() {
      this.obj = {
        type: "pie",
        data: {
          labels: ["Present", "Absent", "Cancelled", "Total"],
          datasets: [
            {
              label: "# of Votes",
              data: this.pieData,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
              // fill: false
            },
          ],
        },
        options: {
          legend: {
            display: true,
            position: "left",
          },
        },
      };

      if (this.pieData[3] > 0 && this.pieData[2] === this.pieData[3]) {
        this.value = 100;
      } else if (this.pieData[3] === this.pieData[0] + this.pieData[2]) {
        this.value = 100;
      } else {
        this.value = Math.floor(
          (this.pieData[0] * 100) / (this.pieData[3] - this.pieData[2])
        );
      }

      if (this.value >= this.attCriteria) {
        this.track = this.value;
        for (let i = 1; this.track >= this.attCriteria; i++) {
          this.track = Math.floor(
            (this.pieData[0] * 100) / (this.pieData[3] + i - this.pieData[2])
          );
          if (this.track <= this.attCriteria) {
            this.leaves = i - 1;
            this.sign = "+";
          }
        }
      } else if (this.value <= this.attCriteria) {
        this.track = this.value;
        for (let i = 1; this.track <= this.attCriteria; i++) {
          this.track = Math.floor(
            ((this.pieData[0] + i) * 100) /
              (this.pieData[3] + i - this.pieData[2])
          );
          if (this.track >= this.attCriteria) {
            this.leaves = i - 1;
            this.sign = "-";
          }
        }
      }

      if (this.leaves === 0) {
        this.sign = "";
      }
    },
    statChange() {
      if (this.showStat) {
        this.userDB.get().then((res) => {
          let statData = res.data().data[this.currentItem];

          if (Object.keys(statData).length > 0) {
            this.subjectStat = true;
            this.objectDates = {};
            if (statData.presentDates !== undefined) {
              if (statData.presentDates.length > 0) {
                this.presentDates = statData.presentDates;
                for (let i in this.presentDates) {
                  this.objectDates[this.presentDates[i]] = ["green"];
                }
              }
            }

            if (statData.absentDates !== undefined) {
              if (statData.absentDates.length > 0) {
                this.absentDates = statData.absentDates;
                for (let i in this.absentDates) {
                  this.objectDates[this.absentDates[i]] = ["red"];
                }
              }
            }

            if (statData.cancelledDates !== undefined) {
              if (statData.cancelledDates.length > 0) {
                this.cancelledDates = statData.cancelledDates;
                for (let i in this.cancelledDates) {
                  this.objectDates[this.cancelledDates[i]] = ["grey"];
                }
              }
            }

            this.pieData = [
              statData.present,
              statData.absent,
              statData.cancelled,
              statData.total,
            ];

            this.pieChart();

            this.createChart("mychart1", this.obj);
          } else {
            this.subjectStat = false;
          }
        });
      }
    },
  },
  mounted() {
    if (this.showStat) {
      this.loading = true;
      this.style = "opacity: 0.3";
      this.userDB.get().then((res) => {
        this.loading = false;
        this.style = "opacity: 1";
        this.items = res.data().allSubjects;
        this.currentItem = res.data().allSubjects[0];
        if(this.attCriteria){
          this.attCriteria = res.data().attCriteria;
        }else{
          this.attCriteria = 75
        }

        let statData = res.data().data[this.currentItem];

        if (Object.keys(statData).length > 0) {
          this.subjectStat = true;
          this.objectDates = {};
          if (statData.presentDates !== undefined) {
            if (statData.presentDates.length > 0) {
              this.presentDates = statData.presentDates;
              for (let i in this.presentDates) {
                this.objectDates[this.presentDates[i]] = ["green"];
              }
            }
          }

          if (statData.absentDates !== undefined) {
            if (statData.absentDates.length > 0) {
              this.absentDates = statData.absentDates;
              for (let i in this.absentDates) {
                this.objectDates[this.absentDates[i]] = ["red"];
              }
            }
          }

          if (statData.cancelledDates !== undefined) {
            if (statData.cancelledDates.length > 0) {
              this.cancelledDates = statData.cancelledDates;
              for (let i in this.cancelledDates) {
                this.objectDates[this.cancelledDates[i]] = ["grey"];
              }
            }
          }

          this.pieData = [
            statData.present,
            statData.absent,
            statData.cancelled,
            statData.total,
          ];

          this.pieChart();

          this.createChart("mychart1", this.obj);
        } else {
          this.subjectStat = false;
        }
      });
    }
  },
  created() {
    let user = firebase.auth().currentUser;
    if (user) {
      this.userDB = db.collection("attData").doc(user.uid);
    }

    this.loading = true;
    this.style = "opacity: 0.3";
    this.userDB.get().then((res) => {
      this.loading = false;
      this.style = "opacity: 1";
      if (
        res.data().allSubjects === undefined ||
        res.data().attendance === undefined
      ) {
        this.showStat = false;
      } else {
        this.showStat = true;
      }
    });
  },
};
</script>
