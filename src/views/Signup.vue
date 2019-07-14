<template>
  <div>
    <v-btn v-on:click="googleLogin">
      <img src="../../public/google.png" class="mr-2" />Sign In
    </v-btn>
  </div>
</template>

<script>
import firebase from "firebase/app";
import db from "../firebase/init";

export default {
  data() {
    return {
    };
  },
  methods: {
    googleLogin() {
      const provider = new firebase.auth.GoogleAuthProvider();

      firebase.auth().signInWithPopup(provider)
        .then((res) => {
          this.$router.push({name: 'home'})
          this.someText = 'test'
        }).catch((err) => {
          console.log(err)
        })
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