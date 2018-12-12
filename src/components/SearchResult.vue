<template>
    <v-layout row>
      <v-flex xs12>
        <v-card>
  
          <v-list two-line>
            <template v-for="(item, index) in items">

                <v-list-tile-content>
                  <v-list-tile-title class='text' v-html="item.title"></v-list-tile-title>
                  <v-list-tile-sub-title class='subtitle' v-html="item.subtitle"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>

</template>

<script>
export default {
name: "SearchResult",
 data () {
    return {
      items: [
        {
          
          title: "<class='text'>Название статьи",
          subtitle: "Посадил дед репку. Выросла репка большая-пребольшая. Стал дед репку из земли тащить: тянет-потянет, вытянуть не может. Позвал дед бабку. Бабка за дедку, дедка за репку — тянут-потянут, вытянуть не могут. Позвала бабка внучку. Внучка за бабку, бабка за дедку, дедка за репку — тянут-потянут, вытянуть не могут."
        },
        { divider: true, inset: false },
        {
          title: "<span class='text-title'>Название статьи",
          subtitle: "Кликнула внучка Жучку. Жучка за внучку, внучка за бабку, бабка за дедку, дедка за репку — тянут-потянут, вытянуть не могут. Кликнула Жучка кошку. Кошка за Жучку, Жучка за внучку, внучка за бабку, бабка за дедку, дедка за репку — тянут-потянут, вытянуть не могут. Позвала кошка мышку. Мышка за кошку, кошка за Жучку, Жучка за внучку, внучка за бабку, бабка за дедку, дедка за репку — тянут-потянут, вытащили репку!"
        },
        { divider: true, inset: true },

      ]
    }
  }
}


</script>

<style scoped>
    .text{
        margin-left: 3%;
        font-size: 20px;
        font-weight: bold;
    }

    .subtitle {
        margin-left: 3%;
        margin-top: 1%;
        width: 90%;
    }
</style>