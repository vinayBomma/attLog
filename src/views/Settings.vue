<template>
  <section>
    <v-list three-line subheader style="background-color: #1e1e1e">
      <v-subheader>User Controls</v-subheader>
      <v-list-tile
        ripple
        v-for="setting in userSettings"
        :key="setting.id"
        @click="userControlSettings(setting.id)"
      >
        <v-list-tile-action>
          <v-icon>{{ setting.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ setting.text }}</v-list-tile-title>
          <v-list-tile-sub-title>{{ setting.subText }}</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <v-divider></v-divider>

    <v-list three-line subheader style="background-color: #1e1e1e">
      <v-subheader>General</v-subheader>
      <v-list-tile
        ripple
        v-for="setting in generalSettings"
        :key="setting.id"
        @click="featureOption(setting.id)"
      >
        <v-list-tile-action>
          <v-icon>{{ setting.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ setting.text }}</v-list-tile-title>
          <v-list-tile-sub-title>{{ setting.subText }}</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <!-- ============= Report App =============== -->
    <v-dialog v-model="reportBugsDialog" max-width="500">
      <v-card>
        <v-card-title
          class="subheading justify-center"
          style="letter-spacing: 2px; background-image: radial-gradient( circle farthest-corner at -0.2% 99.7%,  rgba(190,53,145,1) 0%, rgba(239,69,115,1) 100.2% );"
          >Report Bug</v-card-title
        >
        <v-card-text>
          <v-textarea
            auto-grow
            color="cyan"
            outline
            label="Description"
            v-model="reportText"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            aria-label="No"
            flat
            @click="reportBugsDialog = !reportBugsDialog"
            >Cancel</v-btn
          >
          <v-btn aria-label="Yes" round color="cyan" @click="bugReport"
            >Yes</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- ======================================== -->

    <!-- ============= App Version =============== -->
    <v-dialog v-model="appVersionDialog" max-width="500">
      <v-card>
        <v-card-title
          class="subheading justify-center"
          style="letter-spacing: 2px; background-image: radial-gradient( circle farthest-corner at -0.2% 99.7%,  rgba(190,53,145,1) 0%, rgba(239,69,115,1) 100.2% );"
          >App Version</v-card-title
        >
        <v-card-text>
          <v-layout class="justify-center">
            <img :src="logo" alt="Attend It Logo" height="100" width="100" />
            <br />
          </v-layout>
          <v-layout class="justify-center mt-2">
            <span class="subheading text-center">v2.1</span>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            aria-label="Close"
            round
            color="cyan"
            @click="appVersionDialog = !appVersionDialog"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- ========================================= -->

    <!-- ============= Attendance Criteria =============== -->
    <v-dialog v-model="attCriteria" persistent max-width="600">
      <v-card>
        <v-card-title
          class="justify-center subheading"
          style="letter-spacing: 2px; background-image: radial-gradient( circle farthest-corner at -0.2% 99.7%,  rgba(190,53,145,1) 0%, rgba(239,69,115,1) 100.2% );"
          >Attendance Criteria</v-card-title
        >
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12>
              <v-slider
                v-model="attCriteriaValue"
                color="cyan"
                label="Minimum Required:"
                min="30"
                step="5"
                thumb-label
              ></v-slider>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions class="justify-end pa-3">
          <v-btn flat @click="attCriteria = !attCriteria">Cancel</v-btn>
          <v-btn round color="cyan" @click="saveToDb('attCriteria')"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- ============================================ -->

    <!-- ============= Delete Subjects =============== -->

    <v-dialog v-model="deleteSubDialog" max-width="600">
      <v-card>
        <v-card-title
          class="subheading justify-center"
          style="letter-spacing: 2px; background-image: radial-gradient( circle farthest-corner at -0.2% 99.7%,  rgba(190,53,145,1) 0%, rgba(239,69,115,1) 100.2% );"
          >Delete Subjects</v-card-title
        >
        <v-card-text
          class="subheading"
          style="text-align: center; word-spacing: 2px; letter-spacing: 2px"
          >Are you sure you want to delete all subjects?</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            aria-label="Cancel"
            flat
            @click="deleteSubDialog = !deleteSubDialog"
            >Cancel</v-btn
          >
          <v-btn aria-label="Yes" round color="cyan" @click="saveToDb('delete')"
            >Yes</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ========================================= -->

    <!-- ============= Reset =============== -->

    <v-dialog v-model="resetDialog" max-width="600">
      <v-card>
        <v-card-title
          class="subheading justify-center"
          style="letter-spacing: 2px; background-image: radial-gradient( circle farthest-corner at -0.2% 99.7%,  rgba(190,53,145,1) 0%, rgba(239,69,115,1) 100.2% );"
          >Reset Attendance</v-card-title
        >
        <v-card-text
          class="subheading"
          style="text-align: center; word-spacing: 2px; letter-spacing: 2px"
          >Are you sure you want to reset your attendance data? This operation
          deletes all subjects and timetable as well!</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn aria-label="Cancel" flat @click="resetDialog = !resetDialog"
            >Cancel</v-btn
          >
          <v-btn aria-label="Yes" round color="cyan" @click="saveToDb('reset')"
            >Yes</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ========================================= -->

    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      multi-line
      bottom
      :color="color"
    >
      {{ msg }}
      <v-btn flat @click="snackbar === false">Close</v-btn>
    </v-snackbar>
  </section>
</template>

<script>
import { db } from "../configFirebase";
import firebase from "firebase/app";

export default {
  data() {
    return {
      userSettings: [
        {
          id: 1,
          icon: "description",
          text: "Set Attendance Criteria",
          subText: "Change minimum attendance required",
        },
        {
          id: 2,
          icon: "delete",
          text: "Delete All Subjects",
          subText: "All subjects will be deleted. Cannot be undone.",
        },
        {
          id: 3,
          icon: "restore",
          text: "Reset Attendance",
          subText: "Attendance data is reset. Cannot be undone.",
        },
      ],
      generalSettings: [
        {
          id: 1,
          icon: "share",
          text: "Share",
          subText: "Share the app with everyone",
        },
        {
          id: 2,
          icon: "bug_report",
          text: "Report Bug",
          subText: "Report bugs you've encountered",
        },
        {
          id: 3,
          icon: "mail",
          text: "Contact Us",
          subText: "Send feedback to the developer",
        },
        {
          id: 4,
          icon: "new_releases",
          text: "App Version",
          subText: "Display current app version",
        },
      ],
      snackbar: false,
      msg: null,
      timeout: 3000,
      color: undefined,
      reportBugsDialog: null,
      reportText: null,
      appVersionDialog: null,
      logo: "../android-chrome-192x192.png",
      attCriteria: null,
      attCriteriaValue: null,
      deleteSubDialog: null,
      resetDialog: null,
    };
  },
  methods: {
    featureOption(option) {
      if (option == 1) {
        if (navigator.share) {
          navigator.share({
            title: "Attend It",
            text: `Log your attendance with Attend It. Available on all platforms!`,
            url: "https://attendit.web.app",
          });
        } else {
          window.open(
            "https://twitter.com/intent/tweet?url=https%3A%2F%2Fattendit.web.app%2F&text=Log+your+attendance+with+Attend+It%21+Available+on+all+platforms%21&hashtags=attendance,college",
            "_blank"
          );
        }
      } else if (option == 2) {
        this.reportBugsDialog = true;
      } else if (option == 3) {
        window.open("mailto:secvinay@gmail.com", "_blank");
      } else if (option == 4) {
        this.appVersionDialog = true;
      }
    },
    bugReport() {
      this.msg = `Bug report sent successfully`;
      this.color = "green";
      this.snackbar = true;
      this.reportBugsDialog = !this.reportBugsDialog;
    },
    userControlSettings(option) {
      let user = firebase.auth().currentUser;
      if (option == 1) {
        db.collection("attData")
          .doc(user.uid)
          .get()
          .then((res) => {
            this.attCriteriaValue = res.data().attCriteria;
          });
        this.attCriteria = true;
      } else if (option == 2) {
        this.deleteSubDialog = !this.deleteSubDialog;
      } else if (option == 3) {
        this.resetDialog = !this.resetDialog;
      }
    },
    saveToDb(option) {
      let user = firebase.auth().currentUser;
      if (option == "attCriteria") {
        db.collection("attData")
          .doc(user.uid)
          .set(
            {
              attCriteria: this.attCriteriaValue,
            },
            { merge: true }
          );
        this.msg = `Attendance criteria modified successfully`;
        this.color = "green";
        this.snackbar = true;
        this.attCriteria = !this.attCriteria;
      }else if(option == "delete"){
        db.collection("attData")
          .doc(user.uid)
          .set(
            {
              allSubjects: firebase.firestore.FieldValue.delete(),
            },
            { merge: true }
          );
        this.msg = `All the subjects have been deleted!`;
        this.color = "green";
        this.snackbar = true;
        this.deleteSubDialog = !this.deleteSubDialog;
      }else if(option == 'reset'){
        db.collection("attData")
          .doc(user.uid)
          .set(
            {
              allSubjects: firebase.firestore.FieldValue.delete(),
              attendance: firebase.firestore.FieldValue.delete(),
              data: firebase.firestore.FieldValue.delete(),
              timetable: firebase.firestore.FieldValue.delete(),
            },
            { merge: true }
          );
        this.msg = `Attendance data has been reset`;
        this.color = "green";
        this.snackbar = true;
        this.resetDialog = !this.resetDialog;
      }
    },
  },
};
</script>
