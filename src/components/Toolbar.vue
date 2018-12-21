<template>
  <v-card flat>
    <v-layout class="header-logo" :justify-center="$vuetify.breakpoint.smAndDown">
      <v-flex xs3>
        <img class="v-img-logo" src="@/assets/logo.jpeg"/>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<style scoped>
.header-logo {
  height: 150px;
  margin-top: 0%;
  background: rgb(175, 175, 175);
  background: linear-gradient(
    180deg,
    rgba(213, 213, 225, 1) 0%,
    rgba(228, 228, 235, 1) 50%,
    rgba(255, 255, 255, 1) 100%
  );
}
.v-img-logo {
  margin-left: 40px;
  margin-top: 10px;
  width: auto;
  height: auto;
}
</style>
