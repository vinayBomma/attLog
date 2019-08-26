<template>
  <section>
    <template v-if="$route.name === 'home'">
      <v-dialog v-model="modal" :return-value.sync="date" lazy full-width width="290px">
        <template v-slot:activator="{ on }">
          <v-icon v-model="date" v-on="on">today</v-icon>
        </template>
        <v-date-picker v-model="date">
          <v-spacer></v-spacer>
          <v-btn aria-label="Cancel" flat color="primary" @click="modal = false">Cancel</v-btn>
          <v-btn aria-label="Ok" flat color="primary" @click="saveDate">OK</v-btn>
        </v-date-picker>
      </v-dialog>
    </template>
  </section>
</template>

<script>
import { bus } from "../main";

export default {
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      modal: null,
      currentDate: null,
      currentMonth: null,
      currentFullDate: null,
      currentYear: null
    };
  },
  methods: {
    saveDate() {
      let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ];
      let months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec"
      ];

      let obj = {};

      this.currentMonth = months[new Date(this.date).getMonth()];
      this.currentDate = new Date(this.date).getDate();
      this.currentYear = new Date(this.date).getFullYear();
      this.currentFullDate = this.date;
      this.date = days[new Date(this.date).getDay()];

      obj["date"] = this.date;
      obj["currentMonth"] = this.currentMonth;
      obj["currentDate"] = this.currentDate;
      obj["currentYear"] = this.currentYear;
      obj["currentFullDate"] = this.currentFullDate;

      bus.$emit("dateValue", obj);
      this.modal = !this.modal;
    }
  }
};
</script>