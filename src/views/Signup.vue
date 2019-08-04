<template>
  <div>
    <section>
      <v-layout row align-center justify-center>
        <h1 class="text-center headline mt-2">Attendance Tracker</h1>
        <br />
        <!-- <v-btn aria-label="Sign In" v-on:click="googleLogin">
          <img src="../../public/google.png" alt="Google" class="mr-2" />Sign In
        </v-btn>-->
      </v-layout>
    </section>

    <section>
      <v-layout row align-center justify-center>
        <v-flex xs12 sm4>
          <h1 class="text-xs-center headline mt-2">Features</h1>
        </v-flex>
      </v-layout>
      <v-layout row wrap align-center>
        <!-- <v-flex> -->
          <v-flex xs12>
            <v-card flat class="transparent">
              <v-card-text class="text-center">
                <v-icon>code</v-icon>
              </v-card-text>
              <v-card-title>Cross Platform</v-card-title>

            </v-card>
          </v-flex>
        <!-- </v-container> -->
      </v-layout>
    </section>

    <!-- <v-btn aria-label="Sign In" v-on:click="googleLogin">
      <img src="../../public/google.png" alt="Google" class="mr-2" />Sign In
    </v-btn>-->
  </div>
</template>

<script>
import firebase from "firebase/app";
import db from "../firebase/init";

export default {
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