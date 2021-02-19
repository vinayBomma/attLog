<template>
  <section>
    <v-container fluid>
      <v-layout class="mb-3">
        <v-card flat color="cyan" elevation="0">
          <v-card-text>
            <p
              class="subheading font-weight-thin mx-3"
              style="letter-spacing: 1px"
            >
              <span class="font-weight-bold font-italic">Attend It</span> is a
              <a
                href="https://web.dev/what-are-pwas/"
                style="text-decoration: underline; color: white"
                target="_blank"
                >Progressive Web App(PWA).</a
              >
              Unlike traditional webapps, PWAs are built and enhanced with
              modern APIs to deliver enhanced capabilities while reaching
              anyone, anywhere, on any device.
            </p>
            <p
              class="subheading font-weight-thin mx-3"
              style="letter-spacing: 1px"
            >
              The latest version of Google Chrome or any Chromium browser(Brave,
              Microsoft Edge, Vivaldi) is recommended.
            </p>
            <p
              class="subheading font-weight-thin mx-3"
              style="letter-spacing: 1px"
            >
              Apart from being accessible at
              <a
                href="https://attendit.web.app/"
                style="text-decoration: underline; color: white"
                target="_blank"
                >attendit.web.app</a
              >, <span class="font-weight-bold font-italic">Attend It</span> can
              be installed natively on below operating systems.
            </p>
          </v-card-text>
        </v-card>
      </v-layout>
      <v-expansion-panel v-model="panel" expand>
        <v-expansion-panel-content v-for="(item, i) in items" :key="i">
          <template v-slot:header>
            <v-flex>
              <v-avatar tile size="25">
                <img :src="item.img" alt="avatar" />
              </v-avatar>
              <span class="ml-3 subheading">{{ item.name }}</span>
            </v-flex>
          </template>
          <v-card>
            <v-card-text v-html="item.text"></v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-container>
  </section>
</template>

<script>
export default {
  data() {
    return {
      panel: [],
      items: [
        {
          img: "../windows.png",
          name: "Windows",
          text: `<ul><li class="subheading font-weight-thin mx-2"
              style="letter-spacing: 1px">Open the webapp using the latest Chrome browser and click the install button at top right of the address bar.</li><li class="subheading font-weight-thin mx-2" style="letter-spacing: 1px">Install the app from the <a href="https://www.microsoft.com/store/productId/9PF8BJRD290V"
                style="text-decoration: underline; color: white"
                target="_blank">Windows Store</a></li></ul>`,
        },
        {
          img: "../android.png",
          name: "Android",
          text: `<ul><li class="subheading font-weight-thin mx-2"
              style="letter-spacing: 1px">Open the webapp using the latest Chrome browser and you'll be prompted to install the app on your device.</li><li class="subheading font-weight-thin mx-2" style="letter-spacing: 1px">Install the app from <a href="https://play.google.com/store/apps/details?id=com.chromium.twa.attendIt"
                style="text-decoration: underline; color: white"
                target="_blank">Google Play Store</a></li></ul>`,
        },
        {
          img: "../apple.png",
          name: "iOS",
          text: `<ul><li class="subheading font-weight-thin mx-2"
              style="letter-spacing: 1px">Open the webapp using Safari browser. Tap the ‘Share’ button, scroll down and tap ‘Add to Home Screen’.</li></ul>`,
        },
      ],
    };
  },
};
</script>
