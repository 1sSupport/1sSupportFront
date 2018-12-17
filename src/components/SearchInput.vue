<template>
  <v-container>
    <v-layout>
      <v-flex xs12>
        <v-card flat tile>
          <v-card-title primary-title>
            <h1>Введите ключевые слова, описывающие проблему</h1>
          </v-card-title>

          <v-card-actions>
            <v-layout>
              <v-flex xs8>
                <v-text-field
                  v-model="searchString"
                  label="Search"
                  solo
                  clearable
                  hide-details
                  @input="HintSelections(searchString)"
                  @change="searchRequest($event)"
                ></v-text-field>
                <v-list>
                  <v-list-tile
                    v-for="item in shownHint"
                    :key="item.id"
                    @click="PickHint(item.text)"
                    v-if="showHints"
                  >
                    <v-list-tile-content>
                      <v-list-tile-title v-html="item.text"></v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-flex>
              <v-flex xs2>
                <v-btn
                  color="#3f66b2"
                  style="height: 47px"
                  @click.native.stop="GetArticles(searchString)"
                >
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
import axios from 'axios';

export default {
  name: "SearchInput",
  props: {
    sessionId: {
      required: false,
      type: String
    }
  },
  data() {
    return {
      searchString: "",
      usersView: true,
      showHints: false,
      shownHint: [],
      overlapOldHint: [],
      overlapNewHint: [],
      allHint: [
        {
          id: 1,
          text: "иностранцы"
        },
        {
          id: 2,
          text: "налоги"
        },
        {
          id: 3,
          text: "иностранцы1"
        },
        {
          id: 4,
          text: "иииии"
        },
        {
          id: 5,
          text: "иноаааа"
        },
        {
          id: 6,
          text: "налоги78888"
        }
      ]
    };
  },
  mounted() {
    this.overlapNewHint = this.allHint;
  },
  methods: {
    searchRequest: function(payload) {
      this.$emit('search', payload)
    },
    PickHint(text) {
      this.searchString = text;
      this.showHints = false;
    },
    HintSelections(searchString) {
      //alert(searchString);
      this.overlapOldHint = this.overlapNewHint;
      this.overlapNewHint = [];
      for (var i = 0; i < this.overlapOldHint.length; i++) {
        if (this.overlapOldHint[i].text.startsWith(searchString)) {
          this.overlapNewHint.push(this.overlapOldHint[i]);
          console.log(this.overlapOldHint[i]);
        }
      }
      if (this.overlapNewHint.length >= 5) {
        this.shownHint = this.overlapNewHint.slice(0, 5);
      } else {
        this.shownHint = this.overlapNewHint.slice(
          0,
          this.overlapNewHint.length
        );
      }
      if (searchString != null && searchString.length != 0) {
        this.showHints = true;
      } else {
        this.showHints = false;
        this.overlapNewHint = this.allHint;
      }
    },
    GetArticles(searchString) {
      // alert('Поисковой запрос по запросу "' + this.searchString + '"');
    }
  }
};
</script>


<style>
</style>
