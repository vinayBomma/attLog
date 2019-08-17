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
            <!-- <template v-if="hasSubjects && extraSub === false"> -->
            <v-flex xs12 sm6 md4 v-for="(sub,index) in subjects" :key="index" class="mb-2">
              <v-card flat class="pa-3">
                <v-icon left>description</v-icon>
                <span>{{ sub }}</span>
                <v-card-actions v-if="index === subjects.length - 1">
                  <v-dialog v-model="dialog" scrollable>
                    <template v-slot:activator="{ on }">
                      <v-btn color="blue" absolute bottom right fab v-on="on">
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="headline">Timetable - {{ currentItem }}</span>
                      </v-card-title>
                      <v-container grid-list-md>
                        <v-flex>
                          <v-card-text>
                            <p class="subheadline" v-for="(subs, i) in subjects" :key="i">
                              {{ i+1 }}. {{ subs }}
                              <span>
                                <v-icon class="ml-2" color="red" @click="clearBtn(i, subs)">clear</v-icon>
                              </span>
                            </p>

                            <v-select :items="subjects" label="Select Subject" v-model="value1">
                              <span slot="prepend" class="mt-1">1.</span>
                              <v-icon
                                slot="append"
                                class="mt-1 mr-2"
                                color="green"
                                @click="doneBtn"
                              >check</v-icon>
                            </v-select>
                          </v-card-text>
                        </v-flex>
                      </v-container>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click="clsBtnFunc">Close</v-btn>
                        <v-btn color="blue darken-1" flat @click="saveSubjects">Save</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-card-actions>
              </v-card>
            </v-flex>
            <!-- </template> -->

            <!-- <template v-else-if="!hasSubjects && extraSub === false">
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
            </template>-->
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

import "epic-spinners/dist/lib/epic-spinners.min.css";
import OrbitSpinner from "epic-spinners/src/components/lib/OrbitSpinner";

export default {
  components: {
    OrbitSpinner
  },
  data() {
    return {
      value1: null,
      snackbar: false,
      msg: null,
      timeout: 3000,
      color: undefined,
      userDB: null,
      dialog: true,
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
      subjects: [],
      defSubs: [],
      showtt: true,
      loading: false,
      style: "opacity: 1"
    };
  },
  methods: {
    submitTable() {
      // this.orderedSubs = this.subjects;
      // let obj = {};
      // obj[this.currentItem] = this.orderedSubs;
      // this.color = "success";
      // this.msg = `Timetable Created For ${this.currentItem}`;
      // this.snackbar = true;
      // this.userDB.set({ timetable: obj }, { merge: true });
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
    doneBtn() {
      // add verification(no sub selected, dupes etc)

      console.log(this.value1);
      this.subjects.push(this.value1);
      this.value1 = null;
    },
    clsBtnFunc() {
      console.log("clear btn");
      this.dialog = false;
    },
    saveSubjects() {
      console.log("save subjects");
    },
    clearBtn(index, subject) {
      // clearing subject removes subject from select also

      console.log("clear btn");
      this.subjects.splice(this.subjects.indexOf(this.subjects[index]), 1);
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
  }
};
</script>
