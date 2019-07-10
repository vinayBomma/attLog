<template>
  <div>
    <v-btn v-on:click="googleLogin">
      <img src="../../public/google.png" class="mr-2">Sign In
    </v-btn>
    <!-- <v-btn v-on:click="googleLogout">Signout</v-btn> -->

  </div>
</template>

<script>
import firebase from "firebase";
import db from '../firebase/init'

export default {
  data() {
    return {};
  },
  methods: {
    googleLogin() {
      const provider = new firebase.auth.GoogleAuthProvider();

      firebase.auth().signInWithRedirect(provider);
    },
    // googleLogout() {
    //   firebase.auth().signOut().then(() => {
    //     this.$router.push({name: 'signup'})
    //   })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // }
  },
  mounted(){
      firebase.auth().getRedirectResult()
        .catch((err) => {
        console.log('Errarta: ',err)
      })

      firebase.auth().onAuthStateChanged((user) => {
        if (user){
          this.$router.push({name: 'home'})
          db.collection('attData').doc(user.uid).set({

          }, {merge: true})
        }else{
          console.log('No User Found')
        }
      })
  }
};

</script>