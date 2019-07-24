<template>
  <section>
    <div :style="style">
      <div v-if="showtt">
        <template>
          <v-tabs
            v-model="currentItem"
            color="transparent"
            fixed-tabs
            show-arrows
            slider-color="blue"
            @change="tabChange"
          >
            <v-tab v-for="item in items" :key="item" :href="'#' + item">{{ item }}</v-tab>
          </v-tabs>
        </template>
        <v-tabs-items v-model="currentItem">
          <v-tab-item v-for="(item, index) in items" :key="index" :value="item">
            <template v-if="hasSubjects && extraSub === false">
              <draggable v-model="subjects" @start="drag=true" @end="drag=false">
                <v-flex xs12 sm6 md4 v-for="(sub,index) in subjects" :key="index" class="mb-2">
                  <v-card flat class="pa-3">
                    <v-icon left>reorder</v-icon>
                    <span>{{ sub }}</span>
                  </v-card>
                </v-flex>
              </draggable>
              <v-layout row>
                <v-btn @click="submitTable">Save Timetable</v-btn>
              </v-layout>
            </template>
            <template v-else-if="!hasSubjects && extraSub === false">
              <v-flex xs12 sm6 md4 v-for="(sub,index) in subjects" :key="index" class="mb-2">
                <v-card flat class="pa-3">
                  <v-checkbox v-model="checkData" :label="sub" :value="sub"></v-checkbox>
                </v-card>
              </v-flex>
              <v-layout row>
                <v-btn @click="deleteSubj">Delete</v-btn>
              </v-layout>
            </template>
            <template v-if="extraSub">
              <v-flex xs12 sm6 md4 v-for="(sub,index) in subjects" :key="index" class="mb-2">
                <v-card flat class="pa-3">
                  <v-checkbox v-model="subData" :label="sub" :value="sub"></v-checkbox>
                </v-card>
              </v-flex>
              <v-layout row>
                <v-btn @click="addSub">Duplicate Subject</v-btn>
              </v-layout>
            </template>
          </v-tab-item>
        </v-tabs-items>
      </div>
      <div v-else-if="!showtt">
        <v-card>
          <v-card-text>No Subjects Added</v-card-text>
        </v-card>
      </div>
    </div>

    <v-snackbar v-model="snackbar" :timeout="timeout" multi-line bottom :color="color">
      {{ msg }}
      <v-btn flat @click="snackbar === false">Close</v-btn>
    </v-snackbar>

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

  </section>
</template> 

<script>
import firebase from "firebase";
import db from "../firebase/init";
import { bus } from "../main";

import draggable from "vuedraggable";
import "epic-spinners/dist/lib/epic-spinners.min.css";
import OrbitSpinner from "epic-spinners/src/components/lib/OrbitSpinner";

export default {
  components: {
    draggable,
    OrbitSpinner
  },
  data() {
    return {
      snackbar: false,
      msg: null,
      timeout: 3000,
      color: undefined,
      userDB: null,
      dialog: false,
      checkData: [],
      subData: [],
      currentItem: "Monday",
      items: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      hasSubjects: null,
      extraSub: false,
      subjects: [],
      orderedSubs: [],
      defSubs: [],
      showtt: true,
      loading: false,
      style: "opacity: 1"
    };
  },
  methods: {
    submitTable() {
      this.orderedSubs = this.subjects;

      let obj = {};
      obj[this.currentItem] = this.orderedSubs;

      this.color = "success";
      this.msg = `Timetable Created For ${this.currentItem}`;
      this.snackbar = true;

      this.userDB.set({ timetable: obj }, { merge: true });
    },
    tabChange() {
      this.loading = true;
      this.style = "opacity: 0.3";
      this.userDB
        .get()
        .then(res => {
          this.loading = false;
          this.style = "opacity: 1";
          if (res.data().timetable === undefined) {
            // if(res.data().timetable[this.currentItem] === undefined){
            this.subjects = res.data().allSubjects;
            // }
          } else if (res.data().timetable[this.currentItem] === undefined) {
            this.subjects = res.data().allSubjects;
            this.defSubs = this.subjects;
            this.hasSubjects = true;
          } else {
            this.subjects = res.data().timetable[this.currentItem];
            this.defSubs = this.subjects;
            this.hasSubjects = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteSubj() {
      for (let i in this.checkData) {
        if (this.subjects.includes(this.checkData[i])) {
          this.subjects.splice(this.subjects.indexOf(this.checkData[i]), 1);
        }
      }
      this.checkData = [];
      this.hasSubjects = true;
    },
    addSub() {
      for (let i in this.subData) {
        let dupe = this.subData[i] + " (Duplicate)";
        this.subjects.push(dupe);
      }
      this.subData = [];
      this.extraSub = false;
    }
  },
  mounted() {
    this.loading = true;
    this.style = "opacity: 0.3";
    this.userDB
      .get()
      .then(res => {
        this.loading = false;
        this.style = "opacity: 1";
        if (res.data().timetable === undefined) {
          this.subjects = res.data().allSubjects;
          this.defSubs = this.subjects;
          this.hasSubjects = true;
        } else if (res.data().timetable[this.currentItem] === undefined) {
          this.subjects = res.data().allSubjects;
          this.defSubs = this.subjects;
          this.hasSubjects = true;
        } else {
          this.subjects = res.data().timetable[this.currentItem];
          this.defSubs = this.subjects;
          this.hasSubjects = true;
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  created() {
    let user = firebase.auth().currentUser;
    if (user) {
      this.userDB = db.collection("attData").doc(user.uid);
    }

    this.userDB.get().then(res => {
      if (res.data().allSubjects === undefined) {
        this.showtt = false;
      } else {
        this.showtt = true;
      }
    });

    bus.$on("restoreBtn", () => {
      this.userDB.get().then(res => {
        this.subjects = res.data().allSubjects;
      });

      let dbData = this.userDB;

      switch (this.currentItem) {
        case "Monday":
          dbData.update({
            "timetable.Monday": firebase.firestore.FieldValue.delete()
          });
          break;
        case "Tuesday":
          dbData.update({
            "timetable.Tuesday": firebase.firestore.FieldValue.delete()
          });
          break;
        case "Wednesday":
          dbData.update({
            "timetable.Wednesday": firebase.firestore.FieldValue.delete()
          });
          break;
        case "Thursday":
          dbData.update({
            "timetable.Thursday": firebase.firestore.FieldValue.delete()
          });
          break;
        case "Friday":
          dbData.update({
            "timetable.Friday": firebase.firestore.FieldValue.delete()
          });
          break;
        case "Saturday":
          dbData.update({
            "timetable.Saturday": firebase.firestore.FieldValue.delete()
          });
          break;
      }

      this.color = "error";
      this.msg = `Timetable Deleted For ${this.currentItem}`;
      this.snackbar = true;
    });

    bus.$on("deleteBtn", () => {
      this.hasSubjects = !this.hasSubjects;
    });

    bus.$on("add_sub", () => {
      this.extraSub = !this.extraSub;
    });
  }
};
</script>
