<template>
  <div>
    <!-- <v-card> -->
    <v-list three-line subheader>
      <v-subheader>User Controls</v-subheader>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>Set Attendance Criteria</v-list-tile-title>
          <v-list-tile-sub-title
            >Change minimum attendance required</v-list-tile-sub-title
          >
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>Delete All Subjects</v-list-tile-title>
          <v-list-tile-sub-title
            >All subjects will be deleted. Cannot be undone.</v-list-tile-sub-title
          >
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile avatar>
        <v-list-tile-content>
          <v-list-tile-title>Reset Attendance</v-list-tile-title>
          <v-list-tile-sub-title
            >Attendance data is reset. Cannot be undone.</v-list-tile-sub-title
          >
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <v-divider></v-divider>
    <v-list three-line subheader>
      <v-subheader>General</v-subheader>
      <v-list-tile avatar>
        <v-list-tile-content>
          <v-list-tile-title>Share</v-list-tile-title>
          <v-list-tile-sub-title
            >Share the app</v-list-tile-sub-title
          >
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>Report Bug</v-list-tile-title>
          <v-list-tile-sub-title
            >Report bugs you encountered</v-list-tile-sub-title
          >
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>Feedback</v-list-tile-title>
          <v-list-tile-sub-title
            >Any feedback for the developer</v-list-tile-sub-title
          >
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <!-- </v-card> -->
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>
