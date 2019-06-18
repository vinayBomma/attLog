<template>
  <div>
    <p>Sign in Page</p>
    <v-btn v-on:click="googleLogin">Sign in with Google</v-btn>
    <v-btn v-on:click="googleLogout">Signout</v-btn>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  data() {
    return {};
  },
  methods: {
    googleLogin() {
      const provider = new firebase.auth.GoogleAuthProvider();

      firebase.auth().signInWithRedirect(provider);

      // let user = firebase.auth().currentUser
      // if (user){
      //   console.log('Current User: ', user)
      //   this.$router.push({name: 'home'})
      // }else{
      //   console.log('No Current User')
      // }
    },
    googleLogout() {
      firebase.auth().signOut().then(() => {
        console.log('Signout Successful')
        this.$router.push({name: 'signup'})
      })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted(){
      firebase.auth().getRedirectResult()
        .catch((err) => {
        console.log('Errarta: ',err)
      })

      firebase.auth().onAuthStateChanged((user) => {
        if (user){
          console.log('New Sign in')
          this.$router.push({name: 'home'})
          console.log(user.email)
          // this.userData = user.displayName
        }else{
          console.log('No user signed')
        }
      })
  }
};

</script>