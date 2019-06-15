export const planetChartData = {
    type: 'horizontalBar',
    // data: {
    //   labels: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'],
    //   datasets: [
    //     { // one line graph
    //       label: 'Number of Moons',
    //       data: [0, 0, 1, 2, 67, 62, 27, 14],
    //       backgroundColor: [
    //         'rgba(54,73,93,.5)', // Blue
    //         'rgba(54,73,93,.5)',
    //         'rgba(54,73,93,.5)',
    //         'rgba(54,73,93,.5)',
    //         'rgba(54,73,93,.5)',
    //         'rgba(54,73,93,.5)',
    //         'rgba(54,73,93,.5)',
    //         'rgba(54,73,93,.5)'
    //       ],
    //       borderColor: [
    //         '#36495d',
    //         '#36495d',
    //         '#36495d',
    //         '#36495d',
    //         '#36495d',
    //         '#36495d',
    //         '#36495d',
    //         '#36495d',
    //       ],
    //       borderWidth: 3
    //     },
    //     { // another line graph
    //       label: 'Planet Mass (x1,000 km)',
    //       data: [4.8, 12.1, 12.7, 6.7, 139.8, 116.4, 50.7, 49.2],
    //       backgroundColor: [
    //         'rgba(71, 183,132,.5)', // Green
    //       ],
    //       borderColor: [
    //         '#47b784',
    //       ],
    //       borderWidth: 3
    //     }
    //   ]
    // },
    // options: {
    //   responsive: true,
    //   lineTension: 1,
    //   scales: {
    //     yAxes: [{
    //       ticks: {
    //         beginAtZero: true,
    //         padding: 25,
    //       }
    //     }]
    //   }
    // }
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 5, 2, 3],
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
        // scales: {
        //   yAxes: [
        //     {
        //       ticks: {
        //         beginAtZero: true
        //       }
        //     }
        //   ]
        // }
      }
  }
  
  export default planetChartData;
  