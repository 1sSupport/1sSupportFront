
<template>
  <div>
    <search-input
      @search="searchHandler($event)" :marks="articlesMarks"/>
    <not-found-message v-if="noDataInResponse"/>
    <search-result
      :searchResponse="searchRequestResponse"
      :lastQuery="lastQuery"/>
    <modal-component/>

  </div>
</template>

<script>
import SearchInput from "../components/SearchInput";
import SearchResult from "../components/SearchResult";
import ModalComponent from "../components/ModalComponent";
import NotFoundMessage from "../components/NotFoundMessage"
import axios from 'axios'

export default {
  name: "MainView",
  components: { SearchInput, SearchResult, ModalComponent, NotFoundMessage},
  data() {
    return {
      // not necessary to have Token and SessionId as data here,
      // but it's easier to debug
      token: "",
      sessionId: "",
      searchRequestResponse: [],
      lastQuery: "",
      noDataInResponse: false,
      articlesMarks: []
    }
  },
  methods: {
    getToken: async function() {
      var response = await axios.post("http://www.u0612907.plsk.regruhosting.ru/api/Token/CreateToken", {
        inn: "000000000000",
        login: "test"
      });
      return response.data.access_token
    },
    startSession: async function(token) {
      let axiosConfig = {
        method: "post",
        url: "http://www.u0612907.plsk.regruhosting.ru/api/Session/StartSession",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
      var response = await axios(axiosConfig)
      return response.data.sessionId
    },
    getArticles: async function(query, sessionId) {
      let axiosConfig = {
        method: "get",
        url: "http://www.u0612907.plsk.regruhosting.ru/api/Article/GetArticlesByQuery",
        headers: {
          "Authorization": "Bearer " + this.token
        },
        params: {
          "query": query,
          "sessionId": sessionId
        }
      }
      var response = await axios(axiosConfig)
      response.data.length == 0 ? this.noDataInResponse = true : this.noDataInResponse = false
      return response.data
    },
    searchHandler: async function(payload) {
      this.lastQuery = payload
      this.searchRequestResponse = await this.getArticles(payload, this.sessionId)
    },
    getMarks: async function(token) {
      let axiosConfig = {
        method: "get",
        url: "http://www.u0612907.plsk.regruhosting.ru/api/Article/GetMarks",
        headers: {
          Authorization: "Bearer " + this.token
        },
        params: {
          n: 1
        }
      };
      var response = await axios(axiosConfig);
      return response.data;
    }
  },
  created() {
    (async () => {
      // not necessary to have Token and SessionId as data here,
      // but it's easier to debug
      this.token = await this.getToken()
      this.$store.dispatch("updateAuthorizationToken", this.token)
      this.sessionId = await this.startSession(this.token)
      this.$store.dispatch("updateSessionId", this.sessionId)
      this.articlesMarks = await this.getMarks(this.token);
    })()
  }
};
</script>

<style>
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
