<template>
  <div>
    <!-- <OrbitSpinner v-show="loader" :size="55" :color="'#ff1d5e'" /> -->
    <v-btn v-on:click="googleLogin">
      <img src="../../public/google.png" class="mr-2" />Sign In
    </v-btn>
  </div>
</template>

<script>
import firebase, { functions } from "firebase/app";
import db from "../firebase/init";
// import "epic-spinners/dist/lib/epic-spinners.min.css";
// import OrbitSpinner from "epic-spinners/src/components/lib/OrbitSpinner";
import router from '../router';

export default {
  data(){
    return{
    }
  },
  methods: {
    googleLogin() {
      const provider = new firebase.auth.GoogleAuthProvider();

      firebase
        .auth()
        .signInWithPopup(provider)
        .then(res => {
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