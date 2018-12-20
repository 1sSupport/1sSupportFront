<template>
<v-container>
    <v-layout row>
      <v-dialog v-model="dialog"  max-width="700" >

        <p  class ="activ" slot="activator" persistent maxwidth="100px" color="grey" dark>Я не нашел подоходящей статьи</p>

      <v-card >

        <div class = "header-logo">
        <v-flex xs3 >

        <v-img class="v-img-logo"
          src="https://argos1c.ru/templates/argos/images/logo.png"

        >
        </v-img>

        </v-flex>
        </div>

          <v-card-text>
            <v-container grid-list-md >
              <v-layout wrap>

                <v-flex xs12>
                  <v-text-field label="Контактный телефон" v-model="supportRequestTelephone"></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <v-select
                  :append-icon="null"
                   clearable
                    :items="['Тема 1', 'Тема 2', 'Тема 3', 'Тема 4']"
                    label="Тема обращения"
                    required
                    v-model="supportRequestTitle"
                  ></v-select>
                </v-flex>

                <v-flex xs12>
                  <v-textarea
                  v-model="supportRequestText"
                  rows='3'
                  label="Пожалуйста, опишите вашу проблему и мы свяжемся с вами" required ></v-textarea>
                </v-flex>

              </v-layout>
            </v-container>
            <small></small>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn class="v-btn-save" color="#3f66b2" @click="closeAndSend()">ОТПРАВИТЬ ЗАЯВКУ</v-btn>
          </v-card-actions>

        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>


<script>
import axios from 'axios';
  export default {
    name: "ModalComponent",
    props: {
      token: {
        required: true,
        type: String
      },
      sessionId: {
        required: true,
        type: Number
      }
    },
    data () {
      return {
        dialog: false,
        supportRequestTelephone: "",
        supportRequestText: "",
        supportRequestTitle: ""
      }
    },
    methods: {
      closeAndSend: async function() {
        this.dialog = false
        let axiosConfig = {
          method: "post",
          url: "http://www.u0612907.plsk.regruhosting.ru/api/Session/CreateSupportMessage",
          headers: {
            "Authorization": "Bearer " + this.token
          },
          data: {
            // supportMessage: {
              "ContactData": this.supportRequestTelephone,
              "SessionID": this.sessionId,
              "Text": this.supportRequestText,
              "Title": this.supportRequestTitle
            // }
          }
        }
        var response = await axios(axiosConfig)
        console.log(response)
        // return response.data

      }
    }
  }
</script>

<style scoped>


  .v-btn-save {

    top: 50%;
    right: 4%;
    margin-bottom: 30px;
    margin-top: -40px;
    width: 625px;
    color: white;
    font-weight: bold;
  }

  .header-logo {

    height: 80px;
    margin-bottom: -50px;
    background: rgb(175,175,175);
    background: linear-gradient(180deg, rgba(213,213,225,1) 0%, rgba(228,228,235,1) 50%, rgba(255,255,255,1) 100%);

  }

  .v-img-logo {

    left: 40px;
    top: 10px;
    width: 80%;
    height: auto;
  }




</style>
