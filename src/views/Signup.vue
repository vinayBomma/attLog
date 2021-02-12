<template>
  <div>
    <section id="full-carousel">
      <v-carousel height="100%" :cycle="cycle">
        <v-carousel-item v-for="(slide, i) in slides" :key="i">
            <v-sheet height="92vh" :style="slide.color">
            <v-layout align-start justify-center>
              <v-img class="mt-3" :src="slide.image" max-height="300" max-width="300"></v-img>
            </v-layout>
            <v-layout align-center justify-center>
              <v-container>
                <h3 class="display-1 text-xs-center">{{ slide.title }}</h3>
                <p class="subheading text-xs-center mt-2" style="letter-spacing: 2px">{{ slide.info }}</p>
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
          color: "background-image: radial-gradient( circle farthest-corner at -3.1% -4.3%,  rgba(57,255,186,1) 0%, rgba(21,38,82,1) 90% );",
          image: require("../../public/cross-platform.svg"),
          info:
            "Attend It supports Android, iOS, Windows and Linux. Heck, it even works on a Blackberry! This way you can view and manage your attendance easily on any device."
        },
        {
          title: "Powerful Insights",
          color: "background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgba(238,204,39,1) 0%, rgba(252,173,3,1) 44.7%, rgba(252,132,3,1) 90% );",
          image: require("../../public/analysis.svg"),
          info:
            "With powerful insights, you can view and analyse your attendance in more detail. Not sure whether to bunk? We have got you covered!"
        },
        {
          title: "Intuitive Design",
          color: "background-image: radial-gradient( circle 561px at 81.4% 88.4%,  rgba(236,111,102,1) 0%, rgba(243,161,131,1) 90% );",
          image: require("../../public/block.svg"),
          info:
            "With User Experience in mind, Attend It features a simple and intuitive design. With no ads and offline capability, tracking your attendance is whole lot easier."
        },
        {
          title: "Seamless Updates",
          color: "background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgba(51,102,153,1) 0%, rgba(68,116,163,1) 90% );",
          image: require("../../public/computing-cloud.svg"),
          info:
            "We embrace powerful new technologies which help us simplify user experience. When there is a new update available, Attend It updates without any interruptions!"
        }
      ],
      cycle: true
    };
  }
};
</script>