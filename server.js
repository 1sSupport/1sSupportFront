const tress = require('tress');
const request = require('request');
const ic = require('iconv-lite');

// Взять из кукисов
const PHPSESSID = '115uu334kk8b4lvqsub0r2qgf0'
const ROOT_URL = 'https://its.1c.ru';
const P = '7a31499e';
const U = '54389-40';

// массив типа с полученными данными, еба
let results = [];
//Внимание русские символы пробелы и всяка чушь в формате unicode пожалуйста сюда..
//Эта юрлка полетит на обработку парсером
let urls = [
    '/db/content/accnds/src/%D0%BD%D0%B4%D1%81%201%D1%81%202012%20%D0%B8%D1%81%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BF%D0%BE%D0%BA%D1%83%D0%BF%D0%BA%D0%B8%20%D1%81%D0%BB%D0%BF%D0%B5%D1%80%D0%B8%D0%BE%D0%B4%20%D0%B2%D1%8B%D1%87%D0%B5%D1%82%D0%B0%D0%BD%D0%B5%D1%82.htm?_=1542292886',
    '/db/content/pubvnedrset/src/copyright.html?_=1539695781',
    '/db/content/ka22doc/src/%D0%B2%D0%B2%D0%B5%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5.htm?_=1542292893',
    '/db/ka22doc#content:310:hdoc',
    '/db/content/marketingdoc/src/%D0%B2%D0%B2%D0%B5%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5.htm?_=1539857480',
    '/db/accnds#content:1299:hdoc',
    '/db/marketingdoc/content/4/hdoc?bus&1542293333=&event[name]=mode',
    '/db/accnds#content:1050:hdoc',
    '/db/declprib/content/15388/hdoc/',
]

// записываем в куки PHPSESSID
const j = request.jar();
const cookie = request.cookie(`PHPSESSID=${PHPSESSID}`);
j.setCookie(cookie, ROOT_URL);

// `tress` последовательно вызывает обработчик для каждой ссылки в очереди
let q = tress(function(url, callback){
    // вот наш волшебный request, который умеет в куки и гзип сжатие. 
    // Хз пока как он себя поведет если будет парсить страницу без зжатия gqip. Не проверял.
    request.post(
    {
        url: url, 
        jar: j,
        gzip: true,
        encoding: 'binary',
        headers: {
            "Content-Type": "text/html; charset=Windows-1251",
            "Content-Encoding": "gzip",
            'transfer-encoding': 'chunked',
          }
          
    } , (err, response, body) => {
                    //console.log(body)
                    //console.log(response.statusCode)
                    if (err){
                        // Ошибки надо по нормальному обработать. Пока это так.
                        results.push('!!!! ' + err);
                        throw err;
                    } 
                    // Декодируем в утф
                    let title = ic.decode(Buffer(body, 'binary'), "win1251");
                    // Хуярим в результаты. строку из статус кода и результата
                    results.push(response.statusCode + ': ' + title);
                    // вызываем callback в конце. О да, колбек. люблю его
                    callback();
    });
});

// эта функция выполнится, когда в очереди закончатся ссылки
// есть идея делать несколько очередей, чтоб не переполнять стек. И записывать кусками. пока в теории все.
// записывает в json, никто не мешает сделать что хочется
q.drain = function(){
    require('fs').writeFileSync('./data.json', JSON.stringify(results, null, 4));
}

// а вот и очередь. Можно например таймаут юзать. 
urls.forEach( (url) => {
    q.push(ROOT_URL+url);
});
