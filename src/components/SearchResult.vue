<template>
    <v-layout row>
      <v-flex xs12>
        <v-card>
  
          <v-list two-line>
            <template v-for="(item, index) in items">
              <v-subheader
                v-if="item.header"
                :key="item.header"
              >
                {{ item.header }}
              </v-subheader>
  
              <v-divider
                v-else-if="item.divider"
                :inset="item.inset"
                :key="index"
              ></v-divider>
  
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.title"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
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
          
          title: 'Название статьи',
          subtitle: "<Очень важное описание статьи"
        },
        { divider: true, inset: true },
        {
          title: 'Название статьи2',
          subtitle: "Очень важное описание статьи2"
        },
        { divider: true, inset: true },

      ]
    }
  }
}


</script>