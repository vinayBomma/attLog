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
            <v-card flat v-if="!hastt" class="pa-3 mb-2">
              <v-icon color="red" left>error</v-icon>
              <span class="subheadline">Timetable Not Saved For {{ currentItem }}</span>
            </v-card>
            <v-flex xs12 sm6 md4 v-for="(sub,i) in select" :key="i" class="mb-2">
              <v-card flat class="pa-3">
                <span>{{ i+1 }}. {{ sub }}</span>
                <v-card-actions v-if="i === select.length - 1">
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

                            <v-select :items="defaultSubs" label="Select Subject" v-model="value1">
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
          </v-tab-item>
        </v-tabs-items>
      </div>
      <div v-else-if="!showtt">
        <v-container>
          <v-card>
            <v-card-text>
              <p>No Subjects Added</p>
              <p>
                Click
                <router-link to="/add_subjects">Here</router-link>To Add Subjects
              </p>
            </v-card-text>
          </v-card>
        </v-container>
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
      hastt: null,
      subjects: [],
      select: [],
      clsBtn: null,
      defaultSubs: [],
      showtt: true,
      loading: false,
      style: "opacity: 1"
    };
  },
  methods: {
    tabChange() {
      this.loading = true;
      this.style = "opacity: 0.3";
      this.userDB
        .get()
        .then(res => {
          this.loading = false;
          this.style = "opacity: 1";
          if (
            res.data().timetable === undefined ||
            res.data().timetable[this.currentItem] === undefined
          ) {
            this.subjects = res.data().allSubjects;
            this.select = this.subjects.concat();
            this.hastt = false;
          } else {
            this.subjects = res.data().timetable[this.currentItem];
            this.select = this.subjects.concat();
            this.hastt = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    doneBtn() {
      if (!this.value1) {
        this.msg = "Please Select A Subject";
        this.snackbar = true;
        this.color = "red";
      } else if (this.value1) {
        this.subjects.push(this.value1);
        this.value1 = null;
      }
    },
    clsBtnFunc() {
      this.dialog = false;
      if (this.clsBtn) {
        this.subjects = this.select.concat();
        this.clsBtn = false;
      }
    },
    saveSubjects() {
      let obj = {};
      this.select = this.subjects.concat();
      obj[this.currentItem] = this.select;

      this.userDB
        .set(
          {
            timetable: obj
          },
          { merge: true }
        )
        .then(() => {
          this.color = "success";
          this.msg = `Timetable Created for ${this.currentItem}`;
          this.snackbar = true;
        });
    },
    clearBtn(index, subject) {
      this.subjects.splice(this.subjects.indexOf(this.subjects[index]), 1);
      this.clsBtn = true;
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
        if (
          res.data().timetable === undefined ||
          res.data().timetable[this.currentItem] === undefined
        ) {
          this.subjects = res.data().allSubjects;
          this.select = this.subjects.concat();
          this.hastt = false
        } else {
          this.subjects = res.data().timetable[this.currentItem];
          this.select = this.subjects.concat();
          this.hastt = true;
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
        this.defaultSubs = res.data().allSubjects;
        this.showtt = true;
      }
    });
  }
};
</script>
