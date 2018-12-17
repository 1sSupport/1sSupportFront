
<template>
  <div>
    <search-input
      @search="searchHandler($event)"/>
    <search-result
      :searchResponse="searchRequestResponse"
      :token="token"
      :sessionId="sessionId"
      :lastQuery="lastQuery"/>
    <modal-component
      :token="token"
      :sessionId="sessionId"/>

  </div>
</template>

<script>
import SearchInput from "../components/SearchInput";
import SearchResult from "../components/SearchResult";
import ModalComponent from "../components/ModalComponent";
import axios from 'axios'

export default {
  name: "MainView",
  components: { SearchInput, SearchResult, ModalComponent},
  data() {
    return {
      token: "",
      sessionId: "",
      searchRequestResponse: [],
      lastQuery: ""
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
      return response.data
    },
    searchHandler: async function(payload) {
      this.lastQuery = payload
      this.searchRequestResponse = await this.getArticles(payload, this.sessionId)
    }
  },
  created() {
    (async () => {
      this.token = await this.getToken();
      this.sessionId = await this.startSession(this.token);
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
