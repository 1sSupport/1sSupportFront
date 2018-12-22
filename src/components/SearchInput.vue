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
                <!-- <v-autocomplete
                  :items="marksItems"
                  :menu-props="{ overflowY: false}"
                  browser-autocomplete="on"
                  :search-input.sync="searchString"
                  clearable
                  solo
                  hide-no-data
                  hide-details
                  label="Поиск"

                ></v-autocomplete> -->
                <v-combobox
                  v-model="searchString"
                  :filter="filter"
                  :items="marksItems"
                  :search-input.sync="search"
                  label="Поиск"
                  hide-no-data
                  hide-details
                  solo
                  append-icon="null"

                  :menu-props="{ overflowY: false}"
                >
                  <template
                    slot="item"
                    slot-scope="{ index, item, parent }"
                  >
                    <v-list-tile-content>
                        {{ item.text }}
                    </v-list-tile-content>
                  </template>
                </v-combobox>
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
      shownHint: [],
      // showHints: false
      search: "",
    };
  },
  computed: {
    marksItems: function() {
      return this.marks.map( (item, index) => {
        return {"text": item, "value": item}
      })
    }
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
    },
    // this is default filter function
    filter (item, queryText, itemText) {
      if (item.header) return false

      const hasValue = val => val != null ? val : ''

      const text = hasValue(itemText)
      const query = hasValue(queryText)

      return text.toString()
        .toLowerCase()
        .indexOf(query.toString().toLowerCase()) > -1
    }
  },
  watch: {
    searchString (val, prev) {
      console.log(val)
      if ("text" in val) {
        this.$emit("search", val.text)
      }
      else {
        this.$emit("search", val)
      }
    }
  }
};
</script>


<style>
</style>
