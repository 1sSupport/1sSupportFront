<template>
  <v-container>
    <v-layout row>
      <v-dialog v-model="dialog" max-width="700">
        <p @click="opForm()" class ="activ" slot="activator" persistent maxwidth="100px" color="grey" dark>Я не нашел подоходящей статьи</p>
        <!-- окно форма связи начало -->
        <v-card v-if="modlst == 1" ref="form" class="text-xs-center">

          <div class = "header-logo">
            <img class="img-logo" src="@/assets/logo.png">
            <v-btn flat icon color="#003399" class="ic-btn" @click.native="dialog = false">
              <v-icon>clear</v-icon>
            </v-btn>
          </div>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>

                <v-flex xs12>
                  <v-text-field
                    v-model="phone"
                    label="Контактный телефон"
                    color="#003399"
                    mask="# (###) ###-##-##"
                    placeholder="8 (123) 456-78-90"
                    ref="phone"
                    :rules="[
                      () => !!phone || 'Пожалуйста, введите номер телефона',
                    ]"
                    :error-messages="errorMessages"
                    required
                  ></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <v-select
                    v-model="theme"
                    color="#003399"
                    :append-icon="null"
                    :items="themes"
                    label="Тема обращения"
                    ref="theme"
                    :rules="[() => !!theme || 'Пожалуйста, укажите тему обращения']"
                    :error-messages="errorMessages"
                    required
                  ></v-select>
                </v-flex>

                <v-flex xs12>
                  <v-textarea
                    v-model="probl"
                    color="#003399"
                    rows='3'
                    label="Пожалуйста, опишите вашу проблему и мы свяжемся с вами"
                    ref="probl"
                    :rules="[() => !!probl || 'Пожалуйста, опишите вашу проблему']"
                    :error-messages="errorMessages"
                    required
                  ></v-textarea>
                </v-flex>

              </v-layout>
            </v-container>
            <small></small>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="v-btn-save" color="#003399" @click="submit()">ОТПРАВИТЬ ЗАЯВКУ</v-btn>
          </v-card-actions>

        </v-card>
        <!-- окно форма связи конец -->
        <!-- окно спасибо за заявку начало -->
        <v-card v-else class="text-xs-center">

          <div class = "header-logo">
            <img class="img-logo" src="@/assets/logo.png">
            <!-- <v-img class="v-img-logo" src="https://argos1c.ru/templates/argos/images/logo.png"></v-img> -->
            <v-btn flat icon color="#003399" class="ic-btn" @click.native="dialog = false">
              <v-icon>clear</v-icon>
            </v-btn>
          </div>

          <v-card-text>
            <v-flex xs12>
              <br><br><br>
              <p class="p1">Спасибо!<br>Ваша заявка успешно отправлена!</p>
              <br>
              <p class="p2">В скором времени с Вами свяжется наш специалист.<br>Надеемся, наши совместные усилия сделают Вашу работу проще и приятнее.</p>
              <br><br>
            </v-flex>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="v-btn-save" color="#003399" @click.native="dialog = false">ГОТОВО</v-btn>
          </v-card-actions>

        </v-card>
        <!-- окно спасибо за заявку конец -->
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
  import axios from 'axios';
  export default {
    name: "ModalComponent",
    props: {
    },
    data () {
      return {
        // token: this.$store.state.authorizationToken,
        // sessionId: this.$store.state.sessionId,
        dialog: false,
        modlst: 1,
        themes: ['Тема 1', 'Тема 2', 'Тема 3', 'Тема 4'],
        errorMessages: '',
        phone: null,
        theme: null,
        probl: null,
        formHasErrors: false
      }
    },
    computed: {
      form: function() {
        return {
          phone: this.phone,
          theme: this.theme,
          probl: this.probl
        }
      },
      token: function() {
        return this.$store.state.authorizationToken
      },
      sessionId: function() {
        return this.$store.state.sessionId
      }
    },
    watch: {
      phone () {
        this.errorMessages = ''
      }
    },
    methods: {
      opForm () {
        this.modlst = 1
        this.theme = null
        this.probl = null
      },
      submit () {
        this.formHasErrors = false
        Object.keys(this.form).forEach(f => {
          if (!this.form[f]) this.formHasErrors = true
          this.$refs[f].validate(true)
        })
        if (this.formHasErrors == false) this.closeAndSend()
      },
      closeAndSend: async function() {
        this.modlst = 2
        let axiosConfig = {
          method: "post",
          url: "http://www.u0612907.plsk.regruhosting.ru/api/Session/CreateSupportMessage",
          headers: {
            "Authorization": "Bearer " + this.token
          },
          data: {
            // supportMessage: {
              "ContactData": this.phone,
              "SessionID": this.sessionId,
              "Text": this.probl,
              "Title": this.theme
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

<!-- "scoped" нужно что бы CSS действовало только на этот компонент -->
<style scoped>
  .v-btn-save {
    margin-bottom: 30px;
    margin-top: -40px;
    margin-right: 32px;
    width: 620px;
    color: white;
    font-weight: bold;
  }
  .header-logo {
    height: 80px;
    margin-bottom: -50px;
    background: rgb(175,175,175);
    background: linear-gradient(180deg, rgba(213,213,225,1) 0%, rgba(228,228,235,1) 50%, rgba(255,255,255,1) 100%);
    text-align: left;
  }
  .v-img-logo {
    left: 40px;
    top: 10px;
    width: 80%;
    height: auto;
  }
  .img-logo {
    margin-left: 40px;
    margin-top: 10px;
    width: 140px;
    height: auto;
  }
  .ic-btn {
    margin-left: 465px;
    margin-top: -20px;
  }
  p.p1 {
    color: #003399;
    font-size: 24px;
  }
  p.p2 {
    color: #808080;
    font-size: 20px;
    padding-bottom: 2px;
    margin-left: 20px;
    margin-right: 20px;
  }
</style>
