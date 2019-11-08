<template>
  <div>
    <v-container :style="style">

      <!-- If Subjects Added !-->
      <template v-if="hasSubjects">
        <v-card
          class="mb-2"
          style="border-radius: 10px;background: linear-gradient(25deg,#d64c7f,#ee4758 50%);"
          v-for="(sub, i) in subjects"
          :key="i"
        >
          <v-card-text>
            <span class="letter-spacing: 2px;">{{ i + 1}}. {{ sub }}</span>
          </v-card-text>
        </v-card>
      </template>
      <!-- ============== !-->

      <!-- No Subjects Added !-->
      <v-card
        flat
        v-else-if="!hasSubjects"
        style="border-radius: 20px;background-image: linear-gradient( 108deg,  rgba(0,166,81,1) 9.3%, rgba(0,209,174,1) 118.3% );"
      >
        <v-card-title class="justify-center">
          <v-icon x-large color="white">error</v-icon>
        </v-card-title>
        <v-card-text
          class="subheading"
          style="letter-spacing: 2px; text-align:center;"
        >No subjects have been added yet! Please click the edit(pencil) icon to add subjects.</v-card-text>
      </v-card>
      <!-- ============== !-->

    </v-container>

    <!-- Snackbar !-->
    <v-snackbar v-model="snackbar" :timeout="timeout" multi-line bottom :color="color">
      {{ msg }}
      <v-btn flat @click="snackbar === false">Close</v-btn>
    </v-snackbar>
    <!-- ============== !-->

    <!-- Loader !-->
    <v-dialog v-model="loading" persistent full-width>
      <v-card color="transparent">
        <v-layout v-model="loading" justify-center pa-3>
          <OrbitSpinner v-show="loading === true" :size="55" color="cyan" />
        </v-layout>
        <v-layout justify-center>
          <p text-align="center">Loading...</p>
        </v-layout>
      </v-card>
    </v-dialog>
    <!-- ============== !-->
  </div>
</template>

<script>
import { db } from "../configFirebase";
import firebase from "firebase/app";

import "epic-spinners/dist/lib/epic-spinners.min.css";
import OrbitSpinner from "epic-spinners/src/components/lib/OrbitSpinner";

export default {
  components: {
    OrbitSpinner
  },
  data() {
    return {
      userDB: null,
      subjects: [],
      hasSubjects: null,
      snackbar: false,
      msg: null,
      timeout: 3000,
      color: undefined,
      loading: false,
      style: "opacity: 1"
    };
  },
  created() {
    let user = firebase.auth().currentUser;

    if (user) {
      this.userDB = db.collection("attData").doc(user.uid);
    }

    this.loading = true;
    this.style = "opacity: 0.3";
    this.userDB.get().then(res => {
      this.loading = false;
      this.style = "opacity: 1";
      let sub = res.data().allSubjects;
      if (Object.keys(sub).length > 0) {
        this.subjects = sub;
        this.hasSubjects = true;
      } else if (sub.length === 0 || sub === undefined) {
        this.hasSubjects = false;
      } else {
        this.hasSubjects = false;
      }
    });
  }
};
</script>
