<template>
  <v-card flat>
    <div class="header-logo">
      <v-flex xs3>
        <v-img class="v-img-logo" src="https://argos1c.ru/templates/argos/images/logo.png"></v-img>
      </v-flex>
    </div>
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
  left: 40px;
  top: 10px;
  width: 80%;
  height: auto;
}
</style>