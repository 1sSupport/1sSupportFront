<template>
  <div class="d0">

        <div class="d1">
          <h1>Служба техподдержки 1С</h1>
        </div>

        <div class="d2">

          <div class="d2-1">
            <table>
              <tr>
                <td>
                  <img src="@/assets/if_alert-caution-exclamation-mark-error_3209400.png" class="warn-img">
                </td>
                <td>
                  <h2>Сервис временно недоступен</h2>
                  <p>Приносим свои извенения за доставленные неудобства.</p>
                  <p>Пожалуйста, повторите попытку позже или свяжитесь напрямую с Вашим франчайзи по телефону, указанному ниже:</p>
                </td>
              </tr>
            </table>
          </div>

          <div class="d2-2">
            <table>
                <tr>
                  <td class="td1">
                    <p class="name">1С:ФРАНЧАЙЗИНГ Софт-Маркет</p>
                    <p class="phone">(812) 324-7070</p>
                  </td>
                  <td>
                    <p class="name">Диалог Информационные Технологии</p>
                    <p class="phone">(812) 448-0148</p>
                  </td>
                </tr> 
                <tr>
                  <td class="td1">
                    <p class="name">1С-ВЕКТОР. Группа компаний</p>
                    <p class="phone">(812) 333-5353</p>
                  </td>
                  <td>
                    <p class="name">Группа компаний "ОМЕГА"</p>
                    <p class="phone">(812) 448-0148</p>
                  </td>
                </tr> 
                <tr>
                  <td class="td1">
                    <p class="name">Группа компаний "СофтБаланс"</p>
                    <p class="phone">(812) 325-4400</p>
                  </td>
                  <td>
                    <p class="name">АстроСофт</p>
                    <p class="phone">(812) 494-9090</p>
                  </td>
                </tr> 
                <tr>
                  <td class="td1">
                    <p class="name">АРГОС УЧЕТ</p>
                    <p class="phone">(812) 603-4603</p>
                  </td>
                  <td>
                    <p class="name">Амбер</p>
                    <p class="phone">(812) 244-0161</p>
                  </td>
                </tr> 
                <tr>
                  <td class="td1">
                    <p class="name">УльтраЮнион Центр Информационных Технологий</p>
                    <p class="phone">(812) 648-0077</p>
                  </td>
                  <td>
                    <p class="name">КОМПАС</p>
                    <p class="phone">(812) 329-1170</p>
                  </td>
                </tr> 
              </table>
          </div>

        </div>

      </div>
</template>


<!-- "scoped" нужно что бы CSS действовало только на этот компонент -->
<style scoped>
          
  .d0 {
    background: white;
  }

  p {
    color: #003399;
    font-size: 24px;
    margin-top: 10px;
    margin-bottom: 10px;
    font-family: RobReg;
  }

  .d1 {
    background-image: url(../assets/Rectangle7@2x.jpg);
    background-size: 100% 100%;
    height: 120px;
    margin-bottom: 5px;
  }

  h1 {
    color: #6A6A6A;
    font-size: 36px;
    padding-top:40px;
    padding-left:90px;
    font-family: RobThin;
  }

  h2 {
    color: #333333;
    font-size: 32px;
    padding-top: 0;
    margin-top: 0;
    margin-bottom: 0;
    font-family: RobThin;
  }

  .d2-2 {
    border-top-style: solid;
    border-top-color: #BEBEBE;
    border-top-width: 0.5px;
    padding-top: 10px;
  }

  p.name {
    font-size: 20px;
    margin: 5px 0;
    font-family: RobBold;
  }

  p.phone {
    color: #6A6A6A;
    font-size: 20px;
    margin: 0;
  }

  table {
    margin: 0 auto;
  }

  td.td1 {
    padding-right: 60px;
  }

  .d2-1 {
    margin: 0 auto;
    margin-bottom: 25px;
    width: 80%;
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