
<template>
  <div id="app">
    <v-app id='inspire'>
    <modal-component/>
    <router-view/>
    </v-app>
  </div>
</template>

<script>
import ModalComponent from './components/ModalComponent';
export default {
  name: 'App',
  components: { ModalComponent },
};
</script>

<style src='vuetify/dist/vuetify.min.css'>
</style>


<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
