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
                <v-combobox
                  v-model="searchString"
                  @change="searchRequest($event)"
                  no-filter
                  :items="shownHint"
                  :search-input.sync="search"
                  label="Поиск"
                  hide-no-data
                  hide-details
                  solo
                  append-icon="null"
                  :menu-props="{ overflowY: false}"
                >
                  <template slot="item" slot-scope="{ index, item, parent }">
                    <v-list-tile-content>{{ item }}</v-list-tile-content>
                  </template>
                </v-combobox>
              </v-flex>
              <v-flex xs12 sm2>
                <v-btn color="#3f66b2" style="height: 47px">
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
      search: "",
      shownHint: []
    };
  },
  computed: {},
  mounted() {
    this.shownHint = this.marks.slice(0, 5);
  },
  methods: {
    searchRequest: function(payload) {
      this.$emit("search", payload);
    },
    newHintMas(query) {
      var mas = [];
      var search1 = this.searchString.toLowerCase();
      for (var i = 0; i < this.marks.length; i++) {
        var mark = this.marks[i].toLowerCase();
        if (mark.indexOf(search1) > -1 && mas.length < 5) {
          mas.push(this.marks[i]);
        }
      }
      return mas;
    }
  },
  watch: {
    searchString(val, prev) {
      console.log(val);
      // if ("text" in val) {
      //   this.$emit("search", val.text);
      // } else {
      this.$emit("search", val);
      //}
    },
    search(val, prev) {
      console.log(val);

      this.shownHint = [];
      var search1 = val.toLowerCase();
      for (var i = 0; i < this.marks.length; i++) {
        var mark = this.marks[i].toLowerCase();
        if (mark.indexOf(search1) > -1 && this.shownHint.length < 5) {
          this.shownHint.push(this.marks[i]);
        }
      }
    }
  }
};
</script>


<style>
</style>