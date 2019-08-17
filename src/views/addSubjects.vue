<template>
  <div>
    <v-container :style="style">
      <template v-if="hasSubjects === true">
        <v-flex xs12 sm6 md4 v-for="(sub,index) in select" :key="index" class="mb-2">
          <v-card flat class="pa-3">
            <v-icon left>description</v-icon>
            <span>{{sub}}</span>
            <v-card-actions v-if="index === select.length - 1">
              <v-dialog v-model="dialog" scrollable>
                <template v-slot:activator="{ on }">
                  <v-btn color="blue" absolute bottom right fab v-on="on">
                    <v-icon>edit</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">Your Subjects</span>
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

                        <v-text-field label="Add Subject" v-model="value">
                          <v-icon
                            slot="append"
                            class="mt-1 mr-2"
                            color="green"
                            @click="doneBtn"
                          >check</v-icon>
                        </v-text-field>
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
      </template>

      <v-card flat v-else-if="hasSubjects === false">
        <v-card-text>No Subjects Added</v-card-text>
        <v-card-actions>
          <v-dialog v-model="dialog">
            <template v-slot:activator="{ on }">
              <v-btn color="blue" absolute bottom right fab v-on="on">
                <v-icon>add</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Your Subjects</span>
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

                    <v-text-field label="Add Subject" v-model="value">
                      <v-icon slot="append" class="mt-1 mr-2" color="green" @click="doneBtn">check</v-icon>
                    </v-text-field>
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
    </v-container>

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
  </div>
</template>

<script>
import db from "../firebase/init";
import firebase from "firebase";
import { bus } from "../main";

import "epic-spinners/dist/lib/epic-spinners.min.css";
import OrbitSpinner from "epic-spinners/src/components/lib/OrbitSpinner";

export default {
  components: {
    OrbitSpinner
  },
  data() {
    return {
      userDB: null,
      dialog: false,
      select: [],
      subjects: [],
      hasSubjects: null,
      value: "",
      clsBtn: null,
      subName: [],
      items: [
        "Maths",
        "History",
        "Vuejs",
        "Frightened Frankenstein Home Alone Bazooka Skadoodle"
      ],
      snackbar: false,
      msg: null,
      timeout: 3000,
      color: undefined,
      loading: false,
      style: "opacity: 1"
    };
  },
  methods: {
    saveSubjects() {
      this.select = this.subjects.concat();
      let obj = {};

      this.userDB.get().then(res => {
        if (this.select.length > 0) {
          for (var i in this.select) {
            if (res.data().data !== undefined) {
              if (res.data().data[this.select[i]] !== undefined) {
                if (Object.keys(res.data().data[this.select[i]]).length !== 0) {
                  obj[this.select[i]] = res.data().data[this.select[i]];
                } else if (
                  Object.keys(res.data().data[this.select[i]]).length === 0
                ) {
                  obj[this.select[i]] = [];
                }
              } else if (res.data().data[this.select[i]] === undefined) {
                obj[this.select[i]] = [];
              }
            } else {
              obj[this.select[i]] = [];
            }

            if (
              this.select.indexOf(this.select[i]) ===
              this.select.length - 1
            ) {
              this.userDB
                .set(
                  {
                    allSubjects: this.select,
                    data: obj
                  },
                  { merge: true }
                )
                .then(() => {
                  this.loading = true;
                  this.style = "opacity: 0.3";
                  this.userDB.get().then(res => {
                    this.loading = false;
                    this.style = "opacity: 1";
                    if (Object.keys(res.data().allSubjects).length === 0) {
                      this.hasSubjects = false;
                    } else if (Object.keys(res.data().allSubjects).length > 0) {
                      this.hasSubjects = true;
                    }
                  });
                });
            }
          }
        } else {
          this.userDB
            .set(
              {
                allSubjects: this.select
              },
              { merge: true }
            )
            .then(() => {
              this.loading = true;
              this.style = "opacity: 0.3";
              this.userDB.get().then(res => {
                this.loading = false;
                this.style = "opacity: 1";
                if (Object.keys(res.data().allSubjects).length === 0) {
                  this.hasSubjects = false;
                } else if (Object.keys(res.data().allSubjects).length > 0) {
                  this.hasSubjects = true;
                }
              });
            });
        }
      });

      this.dialog = false;
      this.msg = "Subjects Saved Successfully";
      this.timeout = 3000;
      this.snackbar = true;
      this.color = "green";
    },
    doneBtn() {
      if (this.value === "") {
        this.msg = "Subject Name Cannot Be Empty";
        this.snackbar = true;
        this.color = "red";
      } else if (this.select.includes(this.value)) {
        this.msg = "Subject Already Present";
        this.snackbar = true;
        this.color = "red";
      } else {
        this.subjects.push(this.value);
        this.value = "";
      }
    },
    clearBtn(index, subject) {
      this.subjects.splice(this.subjects.indexOf(this.subjects[index]), 1);
      this.clsBtn = true;
    },
    clsBtnFunc() {
      this.dialog = false;
      if (this.clsBtn) {
        this.subjects = this.select.concat();
        this.clsBtn = false;
      }
    }
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
        this.hasSubjects = true;
        this.select = sub;
        this.subjects = this.select.concat();
      } else if (sub.length === 0) {
        this.hasSubjects = false;
      } else {
        this.hasSubjects = false;
      }
    });
  }
};
</script>
