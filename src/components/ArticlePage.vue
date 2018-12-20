<template>
  <div class="art">

    <!-- логотип и версии статей -->
    <div class="header-logo">
        <v-layout align-end fill-height>
          <v-flex xs3 offset-xs1>
            <img class="img-logo" src="@/assets/logo.png"/>
          </v-flex>
          <!-- версии статей -->
          <v-flex xs7>
            <div class="vers">
              <v-breadcrumbs :items="versions" divider="|" justify-end large></v-breadcrumbs>
            </div>
          </v-flex>
        </v-layout>
    </div>
    
    <!-- название страницы -->
    <v-container class="titl">
      <v-layout align-center justify-space-between row>
        <v-flex xs1>
          <img src="@/assets/ic_arrow_back_24px.png"/>
        </v-flex>
        <v-flex xs10>
          <div v-if="article == ''" class="ar-name text-xs-center" v-html="exampleTitl"></div>
          <div v-if="article != ''" class="ar-name text-xs-center" v-html="article.title"></div>
        </v-flex>
        <v-flex xs1>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- черта-->
    <dir class="my-hr"></dir>

    <!-- статья -->
    <div class="d-art">
      <v-container>
        <div v-if="article == ''" class="article" v-html="example"></div>
        <div v-if="article != ''" class="article" v-html="article.text"></div>
      </v-container>
    </div>

    <modal-component
    :token="token"
    :sessionId="sessionId"/>

    <!-- черта-->
    <dir class="my-hr"></dir>

    <!-- оценка статьи пользователем -->
    <div class="feedback text-xs-center">
      <p class="fb-que">Помогла ли вам информация из этой статьи?</p>
      <div v-if="rating == '0'" class="fb-answ">Нажмите, чтобы оценить</div>
      <div v-if="rating == '1'" class="fb-answ">Не помогла совсем</div>
      <div v-if="rating == '2'" class="fb-answ">Не помогла, но стало ясно в какую сторону думать</div>
      <div v-if="rating == '3'" class="fb-answ">Помогла, но было сложно найти ответ</div>
      <div v-if="rating == '4'" class="fb-answ">Помогла достаточно быстро</div>
      <div v-if="rating == '5'" class="fb-answ">Моментально помогла</div>
      <v-rating
        v-model="rating"
        :hover="true"
        color="#003399"
        large="true"
        :empty-icon="radio_button_unchecked"
        :full-icon="radio_button_checked"
      ></v-rating>
    </div>

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
      rating: 0,
      versions: [
        {
          text: 'Версия 1',
          disabled: true,
          href: 'breadcrumbs_dashboard'
        },
        {
          text: 'Версия 2',
          disabled: false,
          href: 'breadcrumbs_link_1'
        },
        {
          text: 'Версия 3',
          disabled: false,
          href: 'breadcrumbs_link_2'
        }
      ],
      article: "",
      exampleTitl: 'ЕГАИС при розничной торговле алкоголем',
      example: '<div class="header">ЕГАИС</div><div id="actinfo"><p>Дата публикации 18.02.2016</p></div><h2>ЕГАИС при оптовой торговле алкоголем</h2><h3>Схема работы с ЕГАИС при оптовой торговле алкогольной продукцией</h3><p>Оптовые продавцы алкогольной продукции должны отражать в ЕГАИС факты и объемы закупок алкоголя у производителя или поставщика, а также его дальнейшую реализацию. </p><p>Схема работы оптового склада с маркируемым алкоголем упрощенно выглядит так:</p><ol><li>производитель (оптовый поставщик, импортер) при отгрузке товара заводит товарно-транспортную накладную (далее - ТТН) в программу &quot;1С&quot;, далее ТТН передается в электронном виде в ЕГАИС через Универсальный транспортный модуль (далее - УТМ);</li><li>оптовый покупатель (магазин) при поступлении товара получает из ЕГАИС электронную ТТН через УТМ;</li><li>оптовый покупатель (магазин) проверяет фактическое наличие поступившего алкоголя с данными в ТТН из ЕГАИС (поштучного либо партионного):<ul><li>если данные ТТН сходятся с количеством поставленного товара, то в ЕГАИС уходит подтверждение о получении товара;</li><li>если обнаружена недостача или излишек, то партию товара можно принять (целиком или частично), либо отказаться от нее - в этом случае в ЕГАИС также уходит подтверждение;</li></ul></li><li>объем товара, подтверждение о приемке которого передано в ЕГАИС, списывается с остатков производителя (оптового поставщика) и зачисляется на баланс покупателя (оптовика или магазина) в личных кабинетах ЕГАИС покупателя и поставщика;</li><li>при продаже маркированного алкоголя в розницу марки на бутылках сканируются и данные цифрового идентификатора марки отправляются в ЕГАИС, где сопоставляются и проверяются с данными ЕГАИС (при реализации алкоголя через точки общепита (в том числе в розлив), сканирование и передача данных в ЕГАИС происходят в момент открытия бутылки);</li><li>после проверки ЕГАИС присылает ответ о том, что цифровой идентификатор найден, либо отказ в регистрации марки. В случае отказа поставщик должен разобраться с происхождением бутылки, не прошедшей проверку. </li></ol><h3>Формат ЕГАИС 3.0 для оптовых продавцов алкогольной продукции</h3><p>С 01.07.2018 все участники алкогольного рынка переходят на формат ЕГАИС 3.0, предполагающий помарочный (побутылочный) учет маркируемой алкогольной продукции. Это означает, что при перемещении алкогольной продукции в систему ЕГАИС передается информация не только о партии перемещаемой продукции, но и о движении каждой включенной в эту партию бутылки. Наклеиваемые на бутылку марки теперь выдаются производителем алкоголя не на партию, а привязываются к каждой конкретной бутылке и позволяют отследить информацию о ее происхождении и перемещении. Это, в свою очередь, позволит избежать попадания в продажу контрафактной продукции. </p><p>Помарочный учет каждой бутылки обязателен также при перемещении алкогольной продукции между складами и магазинами. Несмотря на это участникам оптового алкогольного рынка нет необходимости сканировать каждую бутылку при перемещении партии алкоголя между складами или торговыми точками. Для этих целей в ЕГАИС предусмотрена возможность поставки, отгрузки и хранения алкоголя в маркированной групповой таре (например, коробах или паллетах). Вместо сканирования каждой содержащейся в такой таре бутылки, для отражения в ЕГАИС факта принятия товара достаточно отсканировать нанесенный на тару штрихкод. При этом информация о цифровых индикаторах алкогольной продукции, находящейся в этой таре, заполнится в системе автоматически. </p><p>Сведения об упаковке, включая нанесенный на нее штрихкод и иерархию вложений, формируются в системе лицом, производящим упаковку (например, производителем) и отражаются во входящей товарно-транспортной накладной. </p><h3>Подключение к ЕГАИС поставщиков алкогольной продукции</h3><p>Поставщики алкогольной и спиртосодержащей продукции подключаются к системе ЕГАИС самостоятельно с использованием Универсального транспортного модуля (УТМ).</p><p>Для подключения к системе необходимо следующее оборудование (информация представлена на <a href="http://wiki.egais.ru/wiki/Подключение_к_ЕГАИС_оптовиков,_осуществляющих_закупку,_хранение_и_поставку_алкогольной_и_спиртосодержащей_продукции" target="_blank">сайте ЕГАИС</a>):</p><ul><li>Компьютер (рабочая станция):<ul><li>процессор х32 с частотой от 1,9 ГГц и выше</li><li>оперативная память объемом от 2 Гб или более</li><li>дисковый накопитель объемом не менее 50 Гб</li><li>Ethernet контроллер, 100/1000 Mbps, разъем RJ45</li></ul></li><li>Криптографическое оборудование (аппаратный крипто-ключ JaCarta со встроенным криптопровайдером PKI/ГОСТ)</li><li>Операционная система Windows 7 Starter и выше</li><li>Общесистемное программное обеспечение Java 8 и выше</li><li>Программное обеспечение ЕГАИС – УТМ (скачивается самостоятельно на сайте Росалкогольрегулирования через <a href="https://service.egais.ru/checksystem" target="_blank">личный кабинет</a>)</li><li>Усиленная квалифицированная электронная подпись (для ее оформления необходима выписка из ЕГРЮЛ (ЕГРИП), СНИЛС, ИНН, ОГРН, Паспорт ИП).</li><li>Бухгалтерская программа с возможностью взаимодействия с УТМ и возможностью формирования файла установленного формата для отправки в ЕГАИС.</li></ul><p>Для взаимодействия с ЕГАИС необходимо стабильное интернет-соединение со скоростью не менее 256 кбит/с. Однако в случае сбоя соединения можно продолжать работу. Универсальный транспортный модуль может работать без подключения к Интернету до трех дней, накапливая информацию о реализованном алкоголе. Когда интернет-соединение будет восстановлено, информация поступит в ЕГАИС.</p><p>Чтобы подключиться к ЕГАИС, нужно выполнить следующие действия:</p><ol><li>Приобрести защищенный носитель JaCarta PKIГОСТSE и усиленную квалифицированную электронную подпись (КЭП), которая будет использоваться для входа в личный кабинет на портале ЕГАИС, а также для подписания электронных документов перед их фиксацией в ЕГАИС. О том, как их можно приобрести, читайте <A href="/db/content/egais/src/этп/1. покупка защищенного носителя jacarta и кэп.htm?_=1544082579">подробнее</a>. Для корректной работы с ЕГАИС и УТМ необходимо установить "Единый клиент JaCarta" (см. <A href="/db/content/egais/src/этп/2. установка _единого клиента jacarta_.htm?_=1544082579">подробнее</a>).</li><li>Получить в <a href="https://service.egais.ru/checksystem" target="_blank">личном кабинете</a> на сайте ФС РАР сертификат для установки защищенного соединения с ЕГАИС (RSA-ключ). Он также необходим для идентификации организации в системе. Подробный порядок действий приведен в статьях: <A href="/db/content/egais/src/этп/3. настройка рабочего места для входа в личный кабинет егаис.htm?_=1544082579">Настройка рабочего места для входа в личный кабинет ЕГАИС</a>, <A href="/db/content/egais/src/этп/4. настройка торговых точек в личном кабинете егаис.htm?_=1544082579">Настройка торговых точек в личном кабинете ЕГАИС</a>, <A href="/db/content/egais/src/этп/5. формирование rsa – ключей для каждой торговой точки.htm?_=1544082579">Формирование RSA-ключей для каждой торговой точки</a>.</li><li>Скачать в <a href="https://service.egais.ru/login" target="_blank">личном кабинете</a> на сайте ФС РАР бесплатный Универсальный транспортный модуль (УТМ). Порядок получения дистрибутива УТМ и его установки рассмотрен в статье <A href="/db/content/egais/src/этп/6. универсальный транспортный модуль (утм).htm?_=1544082579">"Универсальный транспортный модуль"</a>.</li><li>Настроить учетную программу на взаимодействие с ЕГАИС. О настройке программ 1С и работе с ЕГАИС читайте в рубрике <A href="/db/content/egais/src/1с егаис.htm?_=1544082579">"Организация продаж алкогольной продукции в программах 1С"</a>.</li></ol> '
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

<!-- "scoped" нужно что бы CSS действовало только на этот компонент -->
<style scoped>

    .article {
    font-family: RobReg, 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  /*стили для всей страницы*/
  .art {
    background: white;
    color: #6A6A6A;
    font-family: RobReg;
  }

  /*стили для логотипа*/
  .header-logo {
    height: 150px;
    padding-bottom: 20px;
    margin-top: 0%;
    background: rgb(175, 175, 175);
    background: linear-gradient(
      180deg,
      rgba(213, 213, 225, 1) 0%,
      rgba(228, 228, 235, 1) 50%,
      rgba(255, 255, 255, 1) 100%
    );
  }

  .img-logo {
      padding-bottom: 15px;
      width: 80%;
      height: auto;
    }

  /*стили для названия статьи*/
  .ar-name {
    color: #333333;
    font-size: 26px;
  }

  .titl {
    padding-bottom: 10px;
    padding-top: 5px;
    background-color: white;
  }

  /*стили для черты под названием статьи*/
  .my-hr {
    border-top:  solid #DFDFDF 1px;
    width: 100%;
  }

  /*стили для оценки статьи*/
  .fb-answ {
    color: #003399;
    font-size: 18px;
  }

  .feedback {
    padding-top: 20px;
    padding-bottom: 15px;
  }

  .fb-que {
    color: #333333;
    font-size: 24px;
    margin-bottom: 10px;
  }






  /*стили для статей*/
  .d-art {
    background-color: #FCFCFC;
  }

  .article >>> h2, .article >>> b, .article >>> h3, .article >>> h4, .article >>> h5, .article >>> h6 {
    color: #333333;
  }

  .article >>> h2 {
    margin-top: 10px;
  }

  .article >>> h2.header {
    font-size: 100%;
    font-weight: normal;
  }

  .article >>> a { 
      color: #003399;
      text-decoration: none;
  }

  .article >>> a:hover { 
      color: #003399;
      text-decoration: underline;
  }

  .article >>> a:visited {
    color: #004EEB;
  }

  .article >>> #actinfo, .article >>> .header{
    font-family: RobLig;
  }

  .article >>> #actinfo p {
    margin-top: 0px;
    margin-bottom: 0px;
  }

  .article >>> ul li {
    list-style: disc;
  }

  .article >>> ol, .article >>> ul {
    padding-left: 50px;
  }

  .article >>> ol ul, .article >>> ul ol, .article >>> ul ul, .article >>> ol ol {
    padding-left: 25px;
  }

  .article >>> #sova_new, .article >>> #sova {
    float: left;
    margin-top: 5px;
    margin-right: 10px;
  }

  .article >>> .annotation, .article >>> .dopolnitelno {
    float: right;
    border-left: solid #DFDFDF 1px;
    width: 30%;
    padding-left: 20px;
    margin-left: 20px;
  }

  .article >>> div.dir {
    margin-left: 20px;
  }

  .article >>> div.dir p {
    text-indent: -20px;
  }

  .article >>> div.dir img {
    vertical-align: bottom;
    margin: 0 3pt 0 0;
  }

  .article >>> .list li{
    list-style: none;
  }

  .article >>> li.list {
    list-style: none;
  }

  .article >>> .sample, .article >>> .Primer {
    border-left: solid #DFDFDF 1px;
    padding-left: 20px;
  }

  .article >>> .vnimanie {
    color: #004EEB;
  }

  .article >>> table {
    border-collapse: collapse;
    border-color: #BFBFBF;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .article >>> th {
    border-color: #BFBFBF;
  }

  .article >>> td {
    border-color: #BFBFBF;
    padding: 10px;
  }

  .article >>> blockquote p {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .article >>> .Primehanie {
    font-size: 90%;
  }

  .article >>> hr {
    border: none;
    color: #DFDFDF;
    background-color: #DFDFDF;
    height: 1px;
    width: 30%;
    margin-bottom: 10px;
  }

  .article >>> .recommendation {
    margin-top: 10px;
  }

  .article >>> h4, .article >>> h5, .article >>> h6 {
    font-size: 100%;
  }

  .article >>> .note, .article >>> .Vnimanie {
    border: solid 1px red;
    margin: 20px 100px;
    padding: 15px;
    text-align: center;
  }

  .article >>> .note p {
    margin: 0px;
  }

  .article >>> #actually {
    font-family: RobLig;
    color: red;
  }

  .article >>> #actually b {
    color: red;
    font-weight: normal;
  }

  .article >>> ul, .article >>> ol {
    margin-bottom: 10px;
  }

  /*.article >>> .formula {
    border: solid 1px #BFBFBF;
    margin-left: 20px;
    margin-bottom: 10px;
    width: 30%;
    font-style: italic;
  }*/
  
  .article >>> .formula {
    margin-bottom: 15px;
    margin-left: 20px;
    width: 30%;
    background-color: #DFDFDF;
    font-style: italic;
  }

  /*.article >>> .formula {
    font-style: italic;
    margin-bottom: 15px;
    margin-left: 20px;
    width: 30%;
    font-style: italic;
  }*/

  .article >>> .formula p {
    padding: 10px;
    margin: 0px;
  }

  .article >>> .obnovlenie {
    color: #333333;
    font-size: 140%;
  }

</style>


<style>
  @font-face {
      font-family: RobReg;
      src: url(../assets/fonts/roboto/Roboto-Regular.woff2);
  }
  @font-face {
      font-family: RobBold;
      src: url(../assets/fonts/roboto/Roboto-Bold.woff2);
  }
  @font-face {
      font-family: RobThin;
      src: url(../assets/fonts/roboto/Roboto-Thin.woff2);
  }
  @font-face {
      font-family: RobMed;
      src: url(../assets/fonts/roboto/Roboto-Medium.woff2);
  }
  @font-face {
      font-family: RobLig;
      src: url(../assets/fonts/roboto/Roboto-Light.woff2);
  }
</style>
