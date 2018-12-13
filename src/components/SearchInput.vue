<template>
  <v-container >
    <v-layout>
      <v-flex xs12>
        <v-card flat tile>
          <v-card-title primary-title>
            <h1>Введите ключевые слова, описывающие проблему</h1>
          </v-card-title>

          <v-card-actions>
            <v-layout>
              <v-flex xs8>
                <v-text-field v-model="searchString" label="Search" solo clearable></v-text-field>
              </v-flex>
              <v-flex xs2>
                <v-btn color="#3f66b2" style="height: 47px">
                  <v-icon dark>search</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      searchString: ""
    };
  }
};
</script>


<style scoped>
/* .v-model {
  width: 60%;
  margin-left: 3%;
  margin-top: 1%;
} */
/* .SearchHeadline {
  width: 60%;
  margin-top: 2%;
  margin-left: -8%;
} */
/* .SearchBtn {
  margin-top: -6%;
  margin-left: 40%;
  color: white;
  height: 47px;
} */
</style>