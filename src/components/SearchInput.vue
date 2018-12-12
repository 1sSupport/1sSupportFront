<template>
      <v-form>

            <v-flex xs12>
                <h1 class='SearchHeadline'> Введите ключевые слова, описывающие проблему</h1>
           
              <v-autocomplete class='v-model'
                v-model="searchString"
                :disabled="isUpdating"
                solo
                label="Search"
                clearable

              >
              </v-autocomplete>
                <v-btn class='SearchBtn' color="#3f66b2"> <v-icon dark>search</v-icon></v-btn>
            </v-flex>
      </v-form>

</template>

<style scoped>
    .v-model {
        width: 60%;
        margin-left: 3%;
        margin-top: 1%;
    }

    .SearchHeadline {
        width: 60%;
        margin-top: 2%;
        margin-left: -8%;
    }
    .SearchBtn{
        margin-top: -6%;
        margin-left: 40%;
        color: white;
        height: 47px;
    }
</style>