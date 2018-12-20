<template>
  <v-container>
    <v-layout>
      <v-flex xs12>
        <v-card flat tile>
          <v-card-title primary-title>
            <h1>Введите ключевые слова, описывающие проблему</h1>
          </v-card-title>

          <v-card-actions>
            <v-layout row wrap>
              <v-flex xs12 sm8>
                <v-autocomplete
                  :items="marks"
                  :menu-props="{ overflowY: false}"
                  v-model="searchString"
                  clearable
                  solo
                  hide-no-data
                  hide-details
                  label="Поиск"
                ></v-autocomplete>
                <!-- <v-text-field
                  v-model="searchString"
                  label="Search"
                  solo
                  clearable
                  hide-details
                  @input="HintSelections(searchString)"
                  @change="searchRequest($event)"
                ></v-text-field>-->
                <!-- <v-menu v-model="showHints" bottom right> -->
                <!-- <v-list elevation-24>
                  <v-list-tile v-for="item in shownHint" :key="item" @click="PickHint(item)">
                    <v-list-tile-content>
                      <v-list-tile-title v-html="item"></v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>-->
                <!-- </v-menu> -->
              </v-flex>
              <v-flex xs12 sm2>
                <v-btn
                  color="#3f66b2"
                  style="height: 47px"
                  @click.native.stop="GetArticles(searchString)"
                >
                  <v-icon medium color="white">search</v-icon>
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
import axios from "axios";
export default {
  name: "SearchInput",
  props: {
    sessionId: {
      required: false,
      type: String
    },
    marks: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      searchString: "",
      shownHint: []
      // showHints: false
    };
  },
  mounted() {
    this.shownHint = this.marks.slice(0, 5);
  },
  methods: {
    searchRequest: function(payload) {
      this.$emit("search", payload);
    },
    PickHint(text) {
      this.searchString = text;
      this.showHints = false;
    },
    HintSelections(searchString) {
      //alert("a");
      this.shownHint = [];
      var search = searchString.toLowerCase();
      for (var i = 0; i < this.marks.length; i++) {
        var mark = this.marks[i].toLowerCase();
        if (mark.indexOf(search) > -1 && this.shownHint.length < 5) {
          this.shownHint.push(this.marks[i]);
        }
      }
      this.showHints = true;
    },
    customFilter(item, queryText, itemText) {
      return true;
    },
    GetArticles(searchString) {
      // alert('Поисковой запрос по запросу "' + this.searchString + '"');
    }
  }
};
</script>


<style>
</style>
