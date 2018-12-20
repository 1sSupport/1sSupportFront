<template>
  <div>
    <v-container>
      <div v-if="article != ''" class="article" v-html="article.title + '\n' + article.text"></div>
    </v-container>
    <modal-component
    :token="token"
    :sessionId="sessionId"/>
  </div>
</template>

<script>
import axios from 'axios';
import ModalComponent from "./ModalComponent";

export default {
  name: "ArticlePage",
  components: { ModalComponent },
  props: {
    token: {
      required: true,
      type: String
    },
    sessionId: {
      required: false,
      type: Number
    },
    articleId: {
      required: true,
      type: Number
    },
    query: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      article: ""
  }
  },
  methods: {
    getArticle: async function(id, query) {
      let axiosConfig = {
        method: "get",
        url: "http://www.u0612907.plsk.regruhosting.ru/api/Article/GetArticle",
        headers: {
          "Authorization": "Bearer " + this.token
        },
        params: {
          "id": id,
          "query": query
        }
      }
      let response = await axios(axiosConfig)
      console.log(response)
      return response.data
    },
  },
  mounted() {
    (async () => {
      this.article = await this.getArticle(this.articleId, this.query);
    })()
  }
}
</script>

<style scoped>
.article {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
