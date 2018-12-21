<template>
  <v-app id="app" style="background-color:white">
    <toolbar/>
    <keep-alive include="MainView">
      <router-view/>
    </keep-alive>

  </v-app>
</template>

<script>
import ModalComponent from "./components/ModalComponent";
import Toolbar from "./components/Toolbar";
export default {
  name: "App",
  components: { ModalComponent, Toolbar }

};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
