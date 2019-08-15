<template>
  <div>
    <section id="full-carousel">
      <v-carousel height="100%" :cycle="cycle" hide-controls>
        <v-carousel-item v-for="(slide, i) in slides" :key="i">
          <v-sheet height="92vh">
            <v-layout align-start justify-center>
              <!-- <v-icon size="150" color="pink">{{ slide.icon }}</v-icon> -->
              <!-- <img class="mt-3" src="../../public/cross-platform.svg" height="300px" width="300px"> -->
              <v-img class="mt-3" :src="slide.image" max-height="300" max-width="300"></v-img>
            </v-layout>
            <v-layout align-center justify-center>
              <v-container>
              <h3 class="display-1 text-xs-center">{{ slide.title }}</h3>
              <!-- <v-container> -->
                <p class="subheading text-xs-center"
                >Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ducimus totam in vitae! Esse dolorem, adipisci ipsam atque cum deserunt vero ex architecto, aliquam doloremque commodi officia sequi repellendus quibusdam.</p>
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
import firebase from "firebase/app";
import db from "../firebase/init";

export default {
  data() {
    return {
      slides: [
        {title: "Cross Platform", image: require('../../public/cross-platform.svg')}, 
        {title: "Powerful Insights", image: require('../../public/analysis.svg')},
        {title: "Intuitive Design", image: require('../../public/block.svg')}, 
        {title: "Seamless Updates", image: require('../../public/cloud.svg')}       
        ],
      cycle: false,
      colors: [
        "green",
        "secondary",
        "yellow darken-4",
        "red lighten-2",
        "orange darken-1"
      ]
    };
  },
  methods: {
    // googleLogin() {
    //   const provider = new firebase.auth.GoogleAuthProvider();

    //   firebase
    //     .auth()
    //     .signInWithPopup(provider)
    //     .then(() => {
    //       this.$router.push({ name: "home" });
    //       this.someText = "test";
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // }
  },
  mounted() {
    // firebase
    //   .auth()
    //   .getRedirectResult()
    //   .catch(err => {
    //     console.log("Errarta: ", err);
    //   });

    // firebase.auth().onAuthStateChanged(user => {
    //   if (user) {
    //     this.$router.push({ name: "home" });
    //     db.collection("attData")
    //       .doc(user.uid)
    //       .set({}, { merge: true });
    //   } else {
    //     console.log("No User Found");
    //   }
    // });
  }
};
</script>