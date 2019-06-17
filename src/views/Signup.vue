<template>
  <div>
    <p>Sign in with Google</p>
    <v-btn v-on:click="test">Login</v-btn>
    <v-btn v-on:click="out">Signout</v-btn>
  </div>
</template>

<script>
import firebase from "firebase";
// import firebaseui from "firebaseui";
export default {
  data() {
    return {};
  },
  methods: {
    test(){
      const provider = new firebase.auth.GoogleAuthProvider();

      firebase.auth().signInWithRedirect(provider)

      firebase.auth().getRedirectResult().then((result) => {
        console.log('User signing in: ', result) 
        // this.$router.push({path: '/:id', name: 'home'})
      }).catch((err) => {
        console.log('Errarta: ',err)
      })

      // firebase.auth().onAuthStateChanged((user) => {
      //   if (user){
      //     console.log(user)
      //   }else{
      //     console.log('no user signed')
      //   }
      // })
    },
    out(){
      firebase.auth().signOut().then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
    }
  }
};
// firebase.auth().getRedirectResult().then((result) => {
//        console.log('User signing in: ', result) 
//         // console.log('Result: ', result)
//         // this.$router.replace({name: 'home'})
//       }).catch((err) => {
//         console.log('Errarta: ',err)
//       })

firebase.auth().onAuthStateChanged((user) => {
        if (user){
          console.log('user signed in')
          // console.log('User: ', user.uid)
          // $router.push({path: '/:id', component: Home})
          // console.log(user.displayName)
        }else{
          console.log('no user signed in')
        }
      })
</script>