
var txt = `<div id="box4" style="position:absolute; z-index:800; top: 80px; left: 351px; display: none;"> 

8

  <table border="0" cellpadding="5" cellspacing="1" bgcolor="#660000"> 

9

    <tr> 

10

      <td bgcolor="#fef78E" class="hi2"> 

11

        <a class=hi2 href='/metod/faq2/main.jsp'>Начинающим разработчикам</a><br> 

12

        <a class=hi2 href='http://edu.1c.ru/dist/edu/'>Видеоуроки</a><br> 

13

        <a class=hi2 href='/metod/Methodical_ITS.htm'>ИТС</a><br> 

14

        <a class=hi2 href='/metod/Methodical_Courses.htm'>Учебные курсы</a><br> 

15

        <a class=hi2 href='/metod/books/'>Книги, буклеты, статьи, экзаменационные вопросы</a><br> 

16

        <a class=hi2 href='/metod/Methodical_Questions.htm'>Вопросы - ответы</a><br>  

17

        <a class=hi2 href='/lawmonitor/'>Мониторинг изменений законодательства</a><br>        

18

        <a class=hi2 href='/ipp/'>Интернет-поддержка пользователей</a><br> 

19

        <a class=hi2 href='/metod/Partners.htm'>Раздел для разработчиков</a><br> 

20

        <a class=hi2 href='/edu/'>Учебные версии</a><br> 

21

        <a class=hi2 href='/metod/Methodical_DemoConf.htm'>Демонстрационные конфигурации</a><br> 

22

        <a class=hi2 href='/metod/Methodical_DemoRoliki.htm'>Деморолики и презентации</a><br> 

23

        

24

        <a class=hi2 href='http://kb.1c.ru/'>База знаний по технологическим вопросам</a><br>

25

        <a class=hi2 href='/metod/fileworkshop.htm'>Программа работы с файлами</a><br>

26

        <a class=hi2 href='http://money.v8.1c.ru/forum/'>Форум по управлению личными финансами "1С:Деньги 8"</a>`;





var re = new RegExp(/(<script.*>[\S\s]*?<\/script>)|(<style.*>[\S\s]*?<\/style>)|(<[\/a-zA-Z][\S\s]*?>)|(<!(.+))|(&(.*?);)/, "gim")
var cleanTxt = txt.replace(re, "");


document.write(cleanTxt);