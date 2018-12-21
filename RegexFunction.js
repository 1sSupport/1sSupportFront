
var HTMLString = `<div id="box4" style="position:absolute; z-index:800; top: 80px; left: 351px; display: none;"> 
  <table border="0" cellpadding="5" cellspacing="1" bgcolor="#660000"> 
    <tr> 
      <td bgcolor="#fef78E" class="hi2"> 
        <a class=hi2 href='/metod/faq2/main.jsp'>Начинающим разработчикам</a><br> 
        <a class=hi2 href='http://edu.1c.ru/dist/edu/'>Видеоуроки</a><br> 
        <a class=hi2 href='/metod/Methodical_ITS.htm'>ИТС</a><br> 
        <a class=hi2 href='/metod/Methodical_Courses.htm'>Учебные курсы</a><br> 
        <a class=hi2 href='/metod/books/'>Книги, буклеты, статьи, экзаменационные вопросы</a><br> 
        <a class=hi2 href='/metod/Methodical_Questions.htm'>Вопросы - ответы</a><br> 	
        <a class=hi2 href='/lawmonitor/'>Мониторинг изменений законодательства</a><br> 				
        <a class=hi2 href='/ipp/'>Интернет-поддержка пользователей</a><br> 
        <a class=hi2 href='/metod/Partners.htm'>Раздел для разработчиков</a><br> 
        <a class=hi2 href='/edu/'>Учебные версии</a><br> 
        <a class=hi2 href='/metod/Methodical_DemoConf.htm'>Демонстрационные конфигурации</a><br> 
        <a class=hi2 href='/metod/Methodical_DemoRoliki.htm'>Деморолики и презентации</a><br> 
        
        <a class=hi2 href='http://kb.1c.ru/'>База знаний по технологическим вопросам</a><br>
        <a class=hi2 href='/metod/fileworkshop.htm'>Программа работы с файлами</a><br>
        <a class=hi2 href='http://money.v8.1c.ru/forum/'>Форум по управлению личными финансами "1С:Деньги 8"</a>
      </td>
    </tr> 
  </table> 
</div>
<div> 4<5 или 3>4 ? <\div>`;


function removeHTMLTag(str){
       
       	 var rgxp = new RegExp(/(<script.*>[\S\s]*?<\/script>)|(<style.*>[\S\s]*?<\/style>)|(<[\/a-zA-Z][\S\s]*?>)|(<!(.+))|(&(.*?);)/, "gim");
        return str.replace(rgxp, "");
       }


document.write(removeHTMLTag(HTMLString));

//document.write() может быть заменен на console.log(), но у меня данный метод использоваться не захотел
