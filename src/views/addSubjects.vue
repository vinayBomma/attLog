<template>
  <div>
    <v-container>
      <template v-if="hasSubjects">
          <v-flex xs12 sm6 md4 v-for="(sub,index) in subjects" :key="index" class="mb-2">
            <v-card flat class="pa-3">
              <v-icon left>reorder</v-icon>
              <span>{{sub}}</span>
              <v-card-actions v-if="index === subjects.length - 1">
                <v-btn color="blue" absolute bottom right fab>
                  <v-icon>add</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
      </template>
      <v-card flat v-else>
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
                <span class="headline">Add Subjects</span>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout>
                    <v-flex>
                      <v-combobox
                        v-model="select"
                        label="Enter Subjects"
                        multiple
                        chips
                        deletable-chips
                        hint="Press Enter Key To Add Subject"
                        persistent-hint
                      ></v-combobox>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
                <v-btn color="blue darken-1" flat @click="testFun">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      select: ["Maths", "History"],
      hasSubjects: null,
      subjects: null
    };
  },
  methods: {
    testFun() {
      this.hasSubjects = true;
      this.subjects = this.select;
      console.log(this.select);
      this.dialog = false;
    }
  }
};
</script>
