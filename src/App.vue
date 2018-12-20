<template>
  <div id="app" style="background-color:white">
    <toolbar/>
    <keep-alive include="MainView">
      <router-view/>
    </keep-alive>

  </div>
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
  text-align: center;
  color: #2c3e50;
}
</style>
