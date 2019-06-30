<template>
  <section>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12 sm6 md4 pa-1>
          <v-card>
            <div id="doughnut" style="display: block;">
              <canvas id="mychart1" width="400" height="300" class="pa-2"></canvas>
            </div>
          </v-card>
        </v-flex>
        <v-flex xs12 sm6 md4 pa-1>
          <v-card>
            <v-progress-circular rotate='360' size='100' width='15' color='teal' :value='value'>{{value}}</v-progress-circular>
          </v-card>
        </v-flex>
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
      value: 75,
      planetChart
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
    }
  },
  mounted() {
    db.collection("attData")
      .doc("test")
      .get()
      .then(res => {
        let statData = res.data().data["Nodejs"];

        let pieData = [
          statData.present,
          statData.absent,
          statData.cancelled,
          statData.total
        ];

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

