<template>
  <div>
    <section id="full-carousel">
      <v-carousel height="100%" :cycle="cycle" > 
        <v-carousel-item v-for="(slide, i) in slides" :key="i">
          <v-sheet height="92vh">
            <v-layout align-center justify-center fill-height>
              <p class="display-3">{{ slide }}</p>
            </v-layout>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
    </section>

    <!-- <v-btn aria-label="Sign In" v-on:click="googleLogin">
      <img src="../../public/google.png" alt="Google" class="mr-2" />Sign In
    </v-btn>-->
  </div>
</template>

<style scoped>
  #full-carousel{
    height: 92vh;
  }
</style>


<script>
import firebase from "firebase/app";
import db from "../firebase/init";

export default {
  data() {
    return {
      slides: ["First", "Second", "Third", "Fourth", "Fifth"],
      cycle: false,
    };
  },
  methods: {
    googleLogin() {
      const provider = new firebase.auth.GoogleAuthProvider();

      firebase
        .auth()
        .signInWithPopup(provider)
        .then(() => {
          this.$router.push({ name: "home" });
          this.someText = "test";
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    // firebase
    //   .auth()
    //   .getRedirectResult()
    //   .catch(err => {
    //     console.log("Errarta: ", err);
    //   });

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$router.push({ name: "home" });
        db.collection("attData")
          .doc(user.uid)
          .set({}, { merge: true });
      } else {
        console.log("No User Found");
      }
    });
  }
};
</script>