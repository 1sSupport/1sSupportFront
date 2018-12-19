
<template>
  <v-app id="app" style="background-color:white">
    <toolbar/>
    <router-view/>
  </v-app>
</template>

<script>
import ModalComponent from "./components/ModalComponent";
import Toolbar from "./components/Toolbar";
import axios from "axios";
export default {
  name: "app",
  components: { ModalComponent, Toolbar }
};
</script>

<!--<style src='vuetify/dist/vuetify.min.css'>
</style>-->

<style>
@import "vuetify/dist/vuetify.min.css";
#app {
  /* font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center; 
  color: #2c3e50;*/
}
</style>
