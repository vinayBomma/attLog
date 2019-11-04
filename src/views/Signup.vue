<template>
  <div>
    <section id="full-carousel">
      <v-carousel height="100%" :cycle="cycle" hide-controls>
        <v-carousel-item v-for="(slide, i) in slides" :key="i">
          <v-sheet height="92vh" :color="slide.color">
            <v-layout align-start justify-center>
              <v-img class="mt-3" :src="slide.image" max-height="300" max-width="300"></v-img>
            </v-layout>
            <v-layout align-center justify-center>
              <v-container>
                <h3 class="display-1 text-xs-center">{{ slide.title }}</h3>
                <p class="subheading text-xs-center mt-2">{{ slide.info }}</p>
                <v-layout align-end justify-space-between fill-height></v-layout>
              </v-container>
            </v-layout>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
    </section>
  </div>
</template>

<style scoped>
#full-carousel {
  height: 92vh;
}
#feat_icon {
  height: 20%;
}
</style>


<script>

export default {
  data() {
    return {
      slides: [
        {
          title: "Cross Platform",
          color: "blue lighten-2",
          image: require("../../public/cross-platform.svg"),
          info:
            "Attend It supports Android, iOS, Windows and Linux. Heck, it even works on a Blackberry! This way you can view and manage your attendance easily on any device."
        },
        {
          title: "Powerful Insights",
          color: "yellow darken-3",
          image: require("../../public/analysis.svg"),
          info:
            "With powerful insights, you can view and analyse your attendance in more detail. Not sure whether to bunk? We have got you covered!"
        },
        {
          title: "Intuitive Design",
          color: "green darken-1",
          image: require("../../public/block.svg"),
          info:
            "With User Experience in mind, Attend It features a simple and intuitive design. With no Ads and Offline Capability, tracking your attendance is whole lot easier."
        },
        {
          title: "Seamless Updates",
          color: "cyan darken-2",
          image: require("../../public/computing-cloud.svg"),
          info:
            "We embrace powerful new technologies which help us simplify user experience. No need to regularly install a new update. When there is a new update available, Attend It updates just by restarting the app!\nSign In To Get Started!"
        }
      ],
      cycle: false
    };
  }
};
</script>