<template>
  <div>
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
        <template v-if="hasSubjects === 'showTable'">
          <draggable v-model="subjects" @start="drag=true" @end="drag=false">
            <v-flex xs12 sm6 md4 v-for="(sub,index) in subjects" :key="index" class="mb-2">
              <v-card flat class="pa-3">
                <v-icon left>reorder</v-icon>
                <span>{{ sub }}</span>
              </v-card>
            </v-flex>
          </draggable>
          <v-layout row>
            <v-btn @click="submitTable">Submit</v-btn>
          </v-layout>
        </template>
        <template v-else-if="hasSubjects === 'showDelete'">
          <v-flex xs12 sm6 md4 v-for="(sub,index) in subjects" :key="index" class="mb-2">
            <v-card flat class="pa-3">
              <v-checkbox v-model="checkData" :label="sub" :value="sub"></v-checkbox>
              <!-- <span>{{ sub }}</span> -->
            </v-card>            
          </v-flex>
          <v-layout row>
            <v-btn @click="deleteSubj">Delete</v-btn>
          </v-layout>
        </template>
        <!-- <template v-for="(sub,index) in subjects">
              <v-card flat class="pa-3" :key="index">
                <v-checkbox v-model="checkData" :label="sub" :value="sub"></v-checkbox>
              </v-card>
        </template>-->
        <v-card flat v-else-if="!hasSubjects">
          <v-card-text>No Subjects Added</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template> 

<script>
import firebase from "firebase";
import db from "../firebase/init";
import { bus } from "../main";
import draggable from "vuedraggable";

export default {
  components: {
    draggable
  },
  data() {
    return {
      dialog: false,
      checkData: [],
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
      orderedSubs: [],
      defSubs: []
    };
  },
  methods: {
    submitTable() {
      this.orderedSubs = this.subjects;
      this.subjects = this.defSubs;

      let obj = {};
      obj[this.currentItem] = this.orderedSubs;

      db.collection("attData")
        .doc("test")
        .set(
          {
            timetable: obj
          },
          { merge: true }
        );
    },
    tabChange() {
      db.collection("attData")
        .doc("test")
        .get()
        .then(res => {
          if (res.data().timetable[this.currentItem] === undefined) {
            this.subjects = res.data().allSubjects;
          } else if (res.data().timetable[this.currentItem] === undefined) {
            this.subjects = res.data().allSubjects;
            this.defSubs = this.subjects;
            this.hasSubjects = "showTable";
          } else {
            this.subjects = res.data().timetable[this.currentItem];
            this.defSubs = this.subjects;
            this.hasSubjects = "showTable";
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteSubj(){
      console.log('delete btn clicked')
      console.log(this.checkData)
      for(let i in this.checkData){
        if(this.subjects.includes(this.checkData[i])){
          this.subjects.splice(this.subjects.indexOf(this.checkData[i]), 1)
        }
      }
      this.hasSubjects = 'showTable'
    }
  },
  mounted() {
    db.collection("attData")
      .doc("test")
      .get()
      .then(res => {
        if (res.data().timetable === undefined) {
          this.subjects = res.data().allSubjects;
          this.defSubs = this.subjects;
          this.hasSubjects = "showTable";
        } else if (res.data().timetable[this.currentItem] === undefined) {
          this.subjects = res.data().allSubjects;
          this.defSubs = this.subjects;
          this.hasSubjects = "showTable";
        } else {
          this.subjects = res.data().timetable[this.currentItem];
          this.defSubs = this.subjects;
          this.hasSubjects = "showTable";
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  created() {
    bus.$on("restoreBtn", () => {
      db.collection("attData")
        .doc("test")
        .get()
        .then(res => {
          this.subjects = res.data().allSubjects;
        });

      let dbData = db.collection("attData").doc("test");

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
    });

    bus.$on("deleteBtn", () => {
      console.log("the dustbin is open");
      this.hasSubjects = "showDelete";
    });
  }
};
</script>
