<template>
  <div>
    <toolbar/>
    <keep-alive include="MainView">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import MainView from './MainView'
import Toolbar from '../components/Toolbar'
export default {
  name: "DefaultView",
  components: { Toolbar, MainView }
};
</script>

<style scoped="">
</style>
