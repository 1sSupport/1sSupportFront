<template>
<v-container>
    <v-layout row>
      <v-flex xs12>

          <v-card flat class="text-xs-left"> 
            
              Результатов найдено: {{ totalItems }} 
            
          </v-card>

        <v-card flat max-width="90%">
          <v-list three-line >
            <item v-for="(item) in items" :key="item">

                <v-list-tile-content >
                  <v-list-tile-title class='text' v-html="item.title"></v-list-tile-title>
                  <v-list-tile-sub-title class='subtitle' v-html="item.subtitle"></v-list-tile-sub-title>
                </v-list-tile-content>
                
            </item>
          </v-list>
        </v-card>

        <v-pagination
          v-model="items"
          :length="4"
          prev-icon="mdi-menu-left"
          next-icon="mdi-menu-right"
        ></v-pagination>
      </v-flex>
    </v-layout>
</v-container>
</template>

<script>
export default {
name: "SearchResult",
 data () {
    return {
      totalItems: 3,
      items: [
        {
          
          title: "Статья 1",
          subtitle: "<span class='text--primary'>Посадил дед репку. Выросла репка большая-пребольшая. Стал дед репку из земли тащить: тянет-потянет, вытянуть не может. Позвал дед бабку. Бабка за дедку, дедка за репку — тянут-потянут, вытянуть не могут. Позвала бабка внучку. Внучка за бабку, бабка за дедку, дедка за репку — тянут-потянут, вытянуть не могут."
        },
        { divider: true, inset: true },
        {
          title: "Статья 2 статья 2",
          subtitle: "Кликнула внучка Жучку. Жучка за внучку, внучка за бабку, бабка за дедку, дедка за репку — тянут-потянут, вытянуть не могут. Кликнула Жучка кошку. Кошка за Жучку, Жучка за внучку, внучка за бабку, бабка за дедку, дедка за репку — тянут-потянут, вытянуть не могут. Позвала кошка мышку. Мышка за кошку, кошка за Жучку, Жучка за внучку, внучка за бабку, бабка за дедку, дедка за репку — тянут-потянут, вытащили репку!"
        },
        { divider: true, inset: true },
                {
          title: "Статья 3 статья 3 статья 3 статья 3",
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
        font-size: 23px;
        font-weight: bold;
        color: #00008e;
    }
    .subtitle{
      font-size: 18px;
    }

  .text-xs-left {
    margin-bottom: 2%;
    font-size: 16px;
  }

</style>