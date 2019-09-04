<template>
  <v-dialog v-model="signOutModal" full-width>
    <template v-slot:activator="{ on }">
      <v-layout align-start justify-end row class="pa-3">
        <v-icon v-if="isUser === true" @click="signOutModal = true" v-on="on">exit_to_app</v-icon>
      </v-layout>
    </template>
    <v-card>
      <v-card-title>Are You Sure You Want To Sign Out?</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn aria-label="No" flat color="blue" @click="signOutModal = false">No</v-btn>
        <v-btn aria-label="Yes" flat color="blue" @click="googleLogout">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import firebase from "firebase";
import { bus } from '../main'

export default {
  data() {
    return {
      signOutModal: null,
      signOutUser: null,
      isUser: null
    };
  },
  methods: {
    googleLogout() {
      this.signOutModal = false;
      this.signOutUser = true;

      if (this.signOutUser) {
        firebase
          .auth()
          .signOut()
          .then(() => {
            this.$router.push({ name: "signup" });
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  },
  created() {
    bus.$on("userSend", data => {
      this.isUser = data;
    });
  }
};
</script>