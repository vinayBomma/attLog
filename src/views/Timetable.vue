<template>
  <div>
    <template>
      <v-tabs v-model="currentItem" color="transparent" fixed-tabs show-arrows slider-color="blue">
        <v-tab v-for="item in items" :key="item" :href="'#tab-' + item">{{ item }}</v-tab>
      </v-tabs>
    </template>
    <v-tabs-items v-model="currentItem">
      <v-tab-item v-for="(item, index) in items" :key="index" :value="'tab-' + item">
        <template v-if="hasSubjects">
          <draggable v-model="subjects" group="people" @start="drag=true" @end="drag=false">
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
        <v-card flat v-else-if="!hasSubjects">
          <v-card-text>No Subjects Added</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template> 

<script>
import db from "../firebase/init";
import draggable from "vuedraggable";

export default {
  components: {
    draggable
  },
  data() {
    return {
      dialog: false,
      currentItem: "tab-Monday",
      dragging: -1,
      items: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      hasSubjects: null,
      subjects: []
    };
  },
  methods: {
    submitTable(){
      console.log(this.subjects)
    }
  },
  created() {
    db.collection("attData")
      .doc("test")
      .get()
      .then(res => {
        if (!res.data().subjects) {
          console.log("No subjects found");
        } else {
          this.subjects = res.data().subjects;
          this.hasSubjects = true;
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>
