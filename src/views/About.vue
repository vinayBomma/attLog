<template>
  <section>
    <v-container>
      <v-layout class="mb-3">
        <v-flex class="sm12 md12">
        <v-card flat color="cyan" elevation="0">
          <v-card-title class="title pa-3" style="letter-spacing: 1px"
            >Icon Credits</v-card-title
          >
          <v-card-text>
            <p
              class="subheading font-weight-thin mx-3"
              style="letter-spacing: 1px"
            >
              <a
                href="https://www.flaticon.com/free-icon/windows_882702"
                style="text-decoration: none; color: white"
                target="_blank"
                >'Windows' icon made by freepik.com from flaticon.com</a
              >
            </p>
            <p
              class="subheading font-weight-thin mx-3"
              style="letter-spacing: 1px"
            >
              <a
                href="https://www.flaticon.com/free-icon/apple_1532495"
                style="text-decoration: none; color: white"
                target="_blank"
                >'Apple' icon made by freepik.com from flaticon.com</a
              >
            </p>
            <p
              class="subheading font-weight-thin mx-3"
              style="letter-spacing: 1px"
            >
              <a
                href="https://www.flaticon.com/free-icon/android_226770"
                style="text-decoration: none; color: white"
                target="_blank"
                >'Android' icon made by freepik.com from flaticon.com</a
              >
            </p>
            <p
              class="subheading font-weight-thin mx-3"
              style="letter-spacing: 1px"
            >
              <a
                href="https://www.flaticon.com/free-icon/test_1057584"
                style="text-decoration: none; color: white"
                target="_blank"
                >'Test' icon made by freepik.com from flaticon.com</a
              >
            </p>
          </v-card-text>
        </v-card>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex>
          <v-card flat color="cyan" elevation="0">
          <v-card-title class="subheading justify-center pa-3" style="letter-spacing: 1px"
            >Made with love by Vinay Bomma</v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </section>
</template>

<script>
export default {
  data() {
    return {
      img: "../test.jpg",
    };
  },
};
</script>
