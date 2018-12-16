<template>
	<v-content>

		<div class="header-logo">
			<v-flex xs3 offset-xs1>
				<img class="img-logo" src="@/assets/logo.png"/>
			</v-flex>
		</div>
		
		<v-container class="titl">
			<v-layout align-center justify-space-between row>
			<v-flex xs1>
			  <img src="@/assets/ic_arrow_back_24px.png"/>
			</v-flex>
			<v-flex xs10>
				<div class="ar-name text-xs-center">
          Расходы на рекламу в размере фактических затрат 
      	</div>
			</v-flex>
			<v-flex xs1>
			</v-flex>
			</v-layout>
		</v-container>

		<dir class="my-hr"></dir>

		<v-container>
		   <div class="header">Учет по налогу на прибыль организаций</div><h2>Расходы на рекламу в размере фактических затрат</h2><!--ISSSPEC ISS="PARSEFLAG" FLAG="0x4" --><div class="annotation"><h2>См. дополнительно</h2><div class="dir"><p><img src="https://its.1c.ru/db/content/hoosn/src/_pictures/icons/theory.gif?_=1544021280"><a href="/db/content/taxprib/src/2010000_т_реклама.htm?_=1544021279">Расходы на рекламу</a></p><p><img src="https://its.1c.ru/db/content/hoosn/src/_pictures/icons/pract.gif?_=1544021280"><a href="/db/content/hoosn/src/2002004 п_нормиррасходыреклама.htm?_=1544076494">Нормируемые расходы на рекламу</a></p><p><img src="https://its.1c.ru/db/content/hoosn/src/_pictures/icons/pract.gif?_=1544021280"><A href="/db/content/accprib/src/нп 1с прочие расходы расходы на рекламу1проц.htm?_=1544021280">Расходы на рекламу в размере, не превышающем 1 процента выручки от реализации</a></p></div></div><!--ISSSPEC ISS="PARSEFLAG" FLAG="RESTORE" --><p>Расходы на рекламу относятся к прочим расходам, связанным с производством и реализацией (<a href="/db/garant/content/10800200/1/264128" target="_top">пп. 28 п. 1 ст. 264 НК РФ</a>).</p><p>Для целей налогообложения прибыли расходы на рекламу подразделяются на два вида: признаваемые в размере фактических расходов и признаваемые в размере, не превышающем 1 процента выручки от реализации, определяемой в соответствии со <a href="/db/garant/content/10800200/1/249" target="_top">статьей 249 НК РФ</a> (<a href="/db/garant/content/10800200/1/2644" target="_top">п. 4 ст. 264 НК РФ</a>).</p><p>Учет расходов на рекламу, признаваемых&nbsp; для целей налогообложения прибыли в размере фактических затрат, рассмотрим на следующем примере.</p><p>&nbsp;</p><div class=sample><p><b>Пример</b></p><p>Организация ООО &quot;Белая акация&quot; заключила договор с ЗАО &quot;Кактус&quot; договор, предметом которого является оказание услуг по организации участия в выставке. Договором предусмотрена предварительная оплата услуг.</p><p>Стоимость услуг составила 250000 руб. без учета НДС по ставке 18%. Расходы на услуги признаются прочими расходами, признаваемыми для целей налогообложения в размере фактических затрат.</p><p>&nbsp;</p></div><p>&nbsp;</p><p>Пошаговая инструкция:</p><div class="dir"><p><img src="https://its.1c.ru/db/content/hoosn/src/_pictures/icons/pract.gif?_=1544021280"> <A href="/db/content/accprib/src/нп 1с прочие расходы расходы на рекламуфакт_buh30.htm?_=1544021280">в программе 1С:Бухгалтерия 8 (ред. 3.0)</a></p></div><p>&nbsp;</p>


		</v-container>
		
	</v-content>	    
</template>


<!-- "scoped" нужно что бы CSS действовало только на этот компонент -->
<style scoped>

	.v-content {
		background: white;
		color: #6A6A6A;
		font-family: RobReg;
	}

	.header-logo {
	  height: 150px;
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
		  margin-top: 50px;
		  width: 80%;
		  height: auto;
		}

	template {
		background-color: white;
		color: white;
	}

	.my-hr {
		border-top:  solid #DFDFDF 1px;
		width: 100%;
	}

	.ar-name {
		color: #333333;
		font-size: 26px;
	}

	.titl {
		padding-bottom: 10px;
		padding-top: 5px;
	}

	h2, .header, b, h3, h4, h5, h6 {
		color: #333333;
	}

	h2.header {
		font-size: 100%;
		font-weight: normal;
	}

	a { 
			color: #003399;
			text-decoration: none;
	}

	a:hover { 
			color: #003399;
			text-decoration: underline;
	}

	a:visited {
		color: #004EEB;
	}

	#actinfo, .header{
		font-family: RobLig;
	}

	#actinfo p {
		margin-top: 0px;
		margin-bottom: 0px;
	}

	ul li {
		list-style: disc;
	}

	ol, ul {
		padding-left: 50px;
	}

	ol ul, ul ol, ul ul, ol ol {
		padding-left: 25px;
	}

	#sova_new, #sova {
		float: left;
		margin-top: 5px;
		margin-right: 10px;
	}

	.annotation, .dopolnitelno {
		float: right;
		border-left: solid #DFDFDF 1px;
		width: 30%;
		padding-left: 20px;
		margin-left: 20px;
	}

	div.dir {
		margin-left: 20px;
	}

	div.dir p {
	  text-indent: -20px;
	}

	div.dir img {
		vertical-align: bottom;
		margin: 0 3pt 0 0;
	}

	.list li{
		list-style: none;
	}

	li.list {
		list-style: none;
	}

	.sample, .Primer {
		border-left: solid #DFDFDF 1px;
		padding-left: 20px;
	}

	.vnimanie {
		color: #004EEB;
	}

	table {
		border-collapse: collapse;
		border: solid #BFBFBF 1px;
		margin-top: 10px;
		margin-bottom: 10px;
	}

	th {
		border: solid #BFBFBF 1px;
	}

	td {
		border: solid #BFBFBF 1px;
		padding: 10px;
	}

	blockquote p {
		margin-top: 10px;
		margin-bottom: 10px;
	}

	.Primehanie {
		font-size: 90%;
	}

	hr {
		border: none;
		color: #DFDFDF;
		background-color: #DFDFDF;
		height: 1px;
		width: 30%;
		margin-bottom: 10px;
	}

	.recommendation {
		margin-top: 10px;
	}

	h4, h5, h6 {
		font-size: 100%;
	}

	.note, .Vnimanie {
		border: solid 1px red;
		margin: 20px 100px;
		padding: 15px;
		text-align: center;
	}

	.note p {
		margin: 0px;
	}

	#actually {
		font-family: RobLig;
		color: red;
	}

	#actually b {
		color: red;
		font-weight: normal;
	}

	ul, ol {
		margin-bottom: 10px;
	}

	/*.formula {
		border: solid 1px #BFBFBF;
		margin-left: 20px;
		margin-bottom: 10px;
		width: 30%;
		font-style: italic;
	}*/
	
	.formula {
		margin-bottom: 15px;
		margin-left: 20px;
		width: 30%;
		background-color: #DFDFDF;
		font-style: italic;
	}

	/*.formula {
		font-style: italic;
		margin-bottom: 15px;
		margin-left: 20px;
		width: 30%;
		font-style: italic;
	}*/

	.formula p {
		padding: 10px;
		margin: 0px;
	}

	.obnovlenie {
		color: #333333;
		font-size: 140%;
	}




		







	/*h3 {
		background: rgb(175, 175, 175);
	  background: linear-gradient(
	    90deg,
	    rgba(255, 255, 255, 1) 0%,
	    rgba(228, 228, 235, 1) 10%,
	    rgba(213, 213, 225, 1) 50%,
	    rgba(228, 228, 235, 1) 90%,
	    rgba(255, 255, 255, 1) 100%
	  );
	}*/

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









