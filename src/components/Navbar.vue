<template>
  <nav>
    <v-toolbar flat app>
      <v-toolbar-side-icon v-on:click="drawer = !drawer"></v-toolbar-side-icon>
      <!-- <v-toolbar-title>Test</v-toolbar-title> -->
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-tile v-for="(link, j) in links" :key="j" router v-bind:to="link.route">
            <v-list-tile-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ link.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <!-- <v-list-tile v-for="link in links" v-bind:key="link.text" router v-bind:to="link.route">
          <v-list-tile-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="grey--text">{{ link.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>-->
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      links: [
          {icon: "home", text: 'Home', route: '/'},
          {icon: 'insert_chart', text: 'Statistics', route: 'statistics'},
          {icon: 'settings', text: 'Settings', route: 'settings'},
          {icon: 'signup' , text: "signup", route: 'signup'}
      ]
    };
  }
};
</script>

