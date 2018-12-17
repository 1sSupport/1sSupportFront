
<template>
  <div id="app">
    <toolbar/>
    <router-view/>

  </div>
</template>

<script>
import ModalComponent from "./components/ModalComponent";
import Toolbar from "./components/Toolbar";
import axios from 'axios';
export default {
  name: "App",
  components: { ModalComponent, Toolbar }

};
</script>

<style src='vuetify/dist/vuetify.min.css'>
</style>

<style>
/* @import "vuetify/dist/vuetify.min.css"; */
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
