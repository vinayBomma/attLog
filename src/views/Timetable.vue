<template>
  <div>
    <template>
      <v-tabs v-model="currentItem" color="transparent" fixed-tabs show-arrows slider-color="blue">
        <v-tab v-for="item in items" :key="item" :href="'#tab-' + item">{{ item }}</v-tab>
      </v-tabs>
    </template>
    <v-tabs-items v-model="currentItem">
      <v-tab-item v-for="(item, index) in items" :key="index" :value="'tab-' + item">
        <v-card flat>
          <v-card-text>
            <p>{{ subjects[index] }}</p>
          </v-card-text>
        </v-card> 
      </v-tab-item>
    </v-tabs-items>
  </div>
</template> 

<script>
export default {
  data() {
    return {
      dialog: false,
      currentItem: "tab-Monday",
      items: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      subjects: ['python', 'java', 'maths', 'web programming', 'test', 'something', 'vuejs']
    };
  },
  methods: {
  }
};
</script>
