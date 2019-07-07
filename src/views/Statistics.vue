<template>
  <section>
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
            <v-card-title>
              <v-progress-circular rotate="360" size="100" width="15" color="teal" :value="value" >{{value}}%</v-progress-circular>
            </v-card-title>
            <h4 class="text-xs-center">Attendance</h4>
          </v-card>
        </v-flex>

        <!-- <v-flex xs6 sm6 md4 pa-1>
          <v-card>
            <v-card-title>
              <v-progress-circular rotate='360' size='100' width='15' color='teal' :value='value'>{{value}}%</v-progress-circular>
            </v-card-title>
            <h4 class="text-xs-center">Attendance</h4>
          </v-card>
        </v-flex> -->

        <!-- <v-flex xs12 sm6 md4 pa-1>
          <v-card>
            <v-card-title>
              <h3>History</h3>
              <v-date-picker v-model="date1" no-title readonly :events="dateEvent" :event-color="date => date[9] % 2 ? 'red' : 'yellow'" full-width></v-date-picker>
            </v-card-title>
          </v-card>
        </v-flex> -->
      </v-layout>
    </v-container>
  </section>
</template>

<script>
import Chart from "chart.js";
import planetChart from "../chart-data";
import db from "../firebase/init";

export default {
  data() {
    return {
      arrayEvents: null,
      moreEvents: null,
      date1: new Date().toISOString().substr(0, 10),
      value: 75,
      planetChart,
      items: [],
      currentItem: null
    };
  },
  methods: {
    createChart(chartId, chartData, dbData) {
      const ctx = document.getElementById(chartId);
      const myChart = new Chart(ctx, {
        type: chartData.type,
        data: dbData.data,
        options: chartData.options
      });
    },
    dateEvent (date) {
        const [,, day] = date.split('-')
        if ([12, 17, 28].includes(parseInt(day, 10))) return true
        if ([1, 19, 22].includes(parseInt(day, 10))) return ['red', 'green']
        return false
    },
    statChange(){
      db.collection("attData")
      .doc("test")
      .get()
      .then(res => {
        let statData = res.data().data[this.currentItem];

        let pieData = [
          statData.present,
          statData.absent,
          statData.cancelled,
          statData.total
        ];

        if(pieData[0] === 0 || pieData[1] === 0){
          this.value = 100
        }else{
          this.value = Math.floor((pieData[0] * 100 / (pieData[3] - pieData[2])))
        }

        let obj = {
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
          }
        };

        this.createChart("mychart1", this.planetChart, obj);
      });  
    }
  },
  mounted() {
    // this.arrayEvents = [...Array(6)].map(() => {
    //   const day = Math.floor(Math.random() * 30)
    //   const d = new Date()
    //   d.setDate(day)
    //   return d.toISOString().substr(0, 10)
    // })

    db.collection("attData")
      .doc("test")
      .get()
      .then(res => {

        this.items = res.data().allSubjects;
        this.currentItem = res.data().allSubjects[0]

        let statData = res.data().data[this.currentItem];

        let pieData = [
          statData.present,
          statData.absent,
          statData.cancelled,
          statData.total
        ];

        if(pieData[0] === 0 || pieData[1] === 0){
          this.value = 100
        }else{
          this.value = Math.floor((pieData[0] * 100 / (pieData[3] - pieData[2])))
        }

        let obj = {
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
          }
        };

        this.createChart("mychart1", this.planetChart, obj);
      });

    // this.createChart("mychart1", this.planetChart);
  }
  // mounted() {
  // db.collection("attData")
  //   .doc("test")
  //   .get()
  //   .then(res => {
  //     let statData = res.data().data["Nodejs"];

  //     let pieData = [statData.present, statData.absent, statData.cancelled, statData.total];

  //     let obj = {
  //       labels: ["Red", "Blue", "Yellow", "Green"],
  //       datasets: [
  //         {
  //           label: "# of Votes",
  //           backgroundColor: [
  //             "rgba(255, 99, 132, 0.2)",
  //             "rgba(54, 162, 235, 0.2)",
  //             "rgba(255, 206, 86, 0.2)",
  //             "rgba(75, 192, 192, 0.2)",
  //             "rgba(153, 102, 255, 0.2)",
  //             "rgba(255, 159, 64, 0.2)"
  //           ],
  //           borderColor: [
  //             "rgba(255, 99, 132, 1)",
  //             "rgba(54, 162, 235, 1)",
  //             "rgba(255, 206, 86, 1)",
  //             "rgba(75, 192, 192, 1)",
  //             "rgba(153, 102, 255, 1)",
  //             "rgba(255, 159, 64, 1)"
  //           ],
  //           borderWidth: 1
  //         }
  //       ]
  //     };

  //     obj.datasets["data"] = pieData;

  //     // console.log(obj);

  // this.createChart("mychart1", this.planetChart);
  //   });
  // }
};
// let ctx = document.getElementById("mychart");
// console.log(ctx);
// var myChart = new Chart(ctx, {
//   type: "bar",
//   data: {
//     labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
//     datasets: [
//       {
//         label: "# of Votes",
//         data: [12, 19, 3, 5, 2, 3],
// backgroundColor: [
//   "rgba(255, 99, 132, 0.2)",
//   "rgba(54, 162, 235, 0.2)",
//   "rgba(255, 206, 86, 0.2)",
//   "rgba(75, 192, 192, 0.2)",
//   "rgba(153, 102, 255, 0.2)",
//   "rgba(255, 159, 64, 0.2)"
// ],
// borderColor: [
//   "rgba(255, 99, 132, 1)",
//   "rgba(54, 162, 235, 1)",
//   "rgba(255, 206, 86, 1)",
//   "rgba(75, 192, 192, 1)",
//   "rgba(153, 102, 255, 1)",
//   "rgba(255, 159, 64, 1)"
// ],
// borderWidth: 1
//       }
//     ]
//   },
//   options: {
//     scales: {
//       yAxes: [
//         {
//           ticks: {
//             beginAtZero: true
//           }
//         }
//       ]
//     }
//   }
// });
</script>


