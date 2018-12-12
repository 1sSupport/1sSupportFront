
<template>
  <div id="app">
    <Footer/>
    <SearchInput/>
    <SearchResult/>
    <router-view/>
  </div>
</template>

<script>
import ModalComponent from "./components/ModalComponent";
import Footer from "./components/Footer";
import SearchInput from "./components/SearchInput";
import SearchResult from "./components/SearchResult";
export default {
  name: "App",
  components: { Footer, SearchInput, SearchResult }
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
