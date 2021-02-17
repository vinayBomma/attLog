<template>
  <section>
    <v-container>
      <v-timeline align-top dense>
        <v-timeline-item v-for="(note, i) in notes" :key="i" color="cyan" small>
          <!-- <template v-slot:opposite> -->
          <span
            :class="`headline font-weight-bold cyan--text`"
            v-text="note.version"
          ></span>
          <!-- </template> -->
          <div class="py-3">
            <h2 :class="`title font-weight-light mb-3 cyan--text`">
              {{ note.date }}
            </h2>
            <div>
              <ul class="body-2" style="letter-spacing: 1px" v-html="note.text">
                <!-- <li>Fixed not showing chart for new subjects</li>
                <li>Updated NPM packages</li>
                <li>Minor code refactor</li> -->
              </ul>
            </div>
          </div>
        </v-timeline-item>
      </v-timeline>
    </v-container>
  </section>
</template>

<script>
export default {
  data() {
    return {
      notes: [
        {
          version: "v2.1",
          date: "19th Feb, 2021",
          text: `<li>Fixed not showing chart for new subjects</li>
                <li>Minor code refactor</li>
                <li>Added a few bugs to fix them later /s</li>`,
        },
        {
          version: "v2.0",
          date: "13th Feb, 2021",
          text: `<li>Updated NPM Packages</li>
                <li>Replaced Passwordless Authentication with Google OAuth</li> 
                <li>Added app settings</li>
                <li>Bug Fixes</li>`,
        },
        {
          version: "v1.5",
          date: "6th Nov, 2019",
          text: `<li>Code Refactor</li>
                <li>Added helper messages and History View</li>
                <li>Released on Google Play Store🎉🎉</li>`,
        },
        {
          version: "v1.2",
          date: "3rd Sept, 2019",
          text: `<li>Accessibility Improvements</li>
                <li>Fixed Android app crashes by removing Google OAuth</li>
                <li>Added Passwordless Authentication</li>`,
        },
        {
          version: "v1.0",
          date: "17th Aug, 2019",
          text: `<li>Added Trusted Web Activities</li>
                <li>Redesigned UI and other UI fixes</li>
                <li>Fixed Timetable page causing crashes</li>`,
        },
        {
          version: "v0.7",
          date: "22nd Jul, 2019",
          text: `<li>Added Progressive Web App (PWA) Support</li>
                <li>Dynamic imports for improved performance</li>`,
        },
        {
          version: "v0.4",
          date: "4th Jul, 2019",
          text: `<li>Database storage improvements</li>
                <li>UI Fixes</li>`,
        },
        {
          version: "v0.1",
          date: "14th Jun, 2019",
          text: `<li>Project Initialisation</li>`,
        },
      ],
    };
  },
};
</script>
