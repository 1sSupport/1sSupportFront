<template>
  <v-container grid-list-xl>
        <table style="margin-right: 100px">
          <tr>
            <td>
              <img class="warn-img" src="@/assets/if_alert-caution-exclamation-mark-error_3209400.png">
            </td>
            <td>
              <h3>По Вашему запросу ничего не найдено</h3>
              <p>Не удалось найти страницы, содержащие слова из Вашего запроса</p>
              <p>Убедитесь, что все слова написаны правильно, или попробуйте использовать
другие ключевые слова</p>
            </td>
          </tr>
        </table>
  </v-container>
</template>


<!-- "scoped" нужно что бы CSS действовало только на этот компонент -->
<style scoped>

  td p {
    color: #003399;
    font-size: 24px;
  }
  td h3 {
    color: #333333;
    font-size: 32px;
    font-weight: normal;
  }
  td {
    vertical-align: top;
  }
  .warn-img {
    width: 70px;
    height: 65px;
    margin-right: 50px;
  }
</style>
