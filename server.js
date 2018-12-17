const tress = require('tress');
const request = require('request');
const ic = require('iconv-lite');
const JSSoup = require('jssoup').default;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// Взять из кукисов
const PHPSESSID = 'hknaujkuman3o95k96rudsttd2'
const ROOT_URL = 'https://its.1c.ru';
const P = '7a31499e';
const U = '54389-40';
let log = {};

const startIndex = 0; // Откудава стартовать будем?
const logsDir = "logs"; // Папка для логов

console.log("start = ",startIndex)
console.log("logDir = ",logsDir)


const j = request.jar();
// записываем в куки PHPSESSID
const cookie = request.cookie(`PHPSESSID=${PHPSESSID}`);
//const cookie = cookies;
j.setCookie(cookie, ROOT_URL);

const main = async () => {

    require('fs').writeFileSync(`./${logsDir}/302success.log`, '');
    require('fs').writeFileSync(`./${logsDir}/301success.log`, '');
    require('fs').writeFileSync(`./${logsDir}/302fail.log`, '');
    require('fs').writeFileSync(`./${logsDir}/301fail.log`, '');
    require('fs').writeFileSync(`./${logsDir}/404.log`, '');
    require('fs').writeFileSync(`./${logsDir}/401.log`, '');
    require('fs').writeFileSync(`./${logsDir}/otherCode.log`, '');
    require('fs').writeFileSync(`./${logsDir}/ERROR.log`, '');
    require('fs').writeFileSync(`./${logsDir}/emptyContent.log`, '');
    require('fs').writeFileSync(`./${logsDir}/titleError.log`, '');
    require('fs').writeFileSync(`./${logsDir}/repeated.log`, '');
    require('fs').writeFileSync(`./${logsDir}/otherDomain.log`, '');
    require('fs').writeFileSync(`./${logsDir}/video.log`, '');

    const mainResponse = await new Promise(resolve => {
        request.post(
            {
                url: 'https://its.1c.ru/section/all',
                jar: j,
                encoding: 'binary',
            }, (err, response, body) => {
                //let title = ic.decode(Buffer(body, 'binary'), "win1251");
                console.log('mainResponse is ok.')
                resolve({
                    response,
                    body: body,
                })
            })
      });

    const soup = new JSSoup(mainResponse.body);
    liList = soup.findAll('li').filter(obj => {
        if (obj.attrs && obj.attrs.id)
              return obj.attrs.id.indexOf('section_all_url') !== -1
        else {
            return false
        }
    })
    console.log('# liList.length =', liList.length)

    // сюда будем класть ссылки на разделы
    let level1links = []
    // сюда будем класть названия разделов
    let level1titles = []
    
        // убрать
    // уникальная херня. чтоб разделы не повторялись.
    //let islevel1linkrepeateds = []
    //let islevel1titlesrepeateds = []

    let level2uniquefirstlink = new Set();

    /*
    * <link> : {
    *   linkFirstMention: <firstlink>
    *   data: <number>
    * }
    */
    let repeatingLinks = {}

    for (const [index, li] of liList.entries()) {
        let level1link = ""
        let a = li.find('a')
        if (a.attrs && a.attrs.href) {
            if  (a.attrs.href.indexOf('http') != 0) {
                if (a.attrs.href.indexOf('download') !== -1) continue
                level1link = ROOT_URL + a.attrs.href
            }
            else if (a.attrs.href.indexOf('http') === 0) {
                if (
                    a.attrs.href.indexOf('download') !== -1 ||
                    a.attrs.href.indexOf('1c') === -1 &&
                    a.attrs.href.indexOf('v8') === -1
                    ){
                        continue
                    }
                if (a.attrs.href === 'https://its.1c.ru/db/pubunfreal')
                    break
                level1link = a.attrs.href
            }
        }
        var substrings = level1link.split('amp;');
        level1link = ''
        for (var i = 0; i < substrings.length; i++) {
            level1link += substrings[i];
        }
        level1titles.push(a.contents[0]._text)
        level1links.push(level1link)
    }
    console.log('# level1links.length =', level1links.length)
    console.log('# level1titles.length =', level1titles.length)

    
    level1links.splice(0, startIndex);
    level1titles.splice(0, startIndex);

    for (const [index, url] of level1links.entries()) {
        let level2uniquelinks = new Set();
        let isrepeatedlevel2link = {};
        const l1title = level1titles[index];
        let curURL = url;
        let status;
        let status300;
        let is302orFirstOne = true;
        while (is302orFirstOne) {
            try {
                level1response = await new Promise((resolve, reject) => {
                    request.post(
                    {
                        url: curURL,
                        jar: j,
                        gzip: true,
                        encoding: 'binary',
                        headers: {
                            "Content-Type": "text/html; charset=Windows-1251",
                            "Content-Encoding": "gzip",
                            'transfer-encoding': 'chunked',
                          }
                    } , (err, response, body) => {
                        if (err){
                            reject(err)
                            return
                        }
                        //выводим в консоль инфу со статусом
                        console.log(
                            response.statusCode === 200
                            ? '\x1b[32m%s\x1b[0m'
                            : (response.statusCode === 301 || response.statusCode === 302)
                            ? '\x1b[34m%s\x1b[0m'
                            : '\x1b[33m%s\x1b[0m',
                            `- Index ${startIndex+index+1}/${startIndex+level1links.length} fetched ${curURL} with ${response.statusCode}`
                            )
                        //const title = ic.decode(Buffer(body, 'binary'), "win1251");
                        let redirect
                        if (
                            (response.statusCode === 302 || response.statusCode === 301) &&
                            response.headers &&
                            (response.headers["content-location"] || response.headers["location"])
                            ){
                            redirect = (response.statusCode === 302 && response.headers["content-location"])
                            ? response.headers["content-location"]
                            : response.headers["location"]
                        }

                        resolve({
                            response,
                            body: body,
                            status: response.statusCode,
                            redirect: redirect,
                        })
                    });
                });
                // вызывать пост с новым url
                if ((level1response.status === 302 ||
                    level1response.status === 301) &&
                    level1response.redirect) {
                        status300 = (!status300 && level1response.status === 302)
                        ? '302'
                        : '301'
                    curURL = level1response.redirect;
                    is302orFirstOne = true;
                }
                else {
                    is302orFirstOne = false;
                                                                        // в лог 301 302
                                                                        if (status300) {
                                                                            log = {
                                                                                "Cтатус": level1response.status,
                                                                                "Первый url": ic.decode(Buffer('' + url, 'binary'), "win1251"),
                                                                                "Конечный url": ic.decode(Buffer('' + curURL, 'binary'), "win1251"),
                                                                                "Title": ic.decode(Buffer('' + level1titles[index], 'binary'), "win1251"),
                                                                                "File": 'data'+(startIndex+index),
                                                                                "Уровень": "1. разделы"
                                                                            }
                                                                            if (level1response.status === 200) 
                                                                                require('fs').appendFileSync(`./${logsDir}/${status300}success.log`, JSON.stringify(log, null, 4));
                                                                            else
                                                                                require('fs').appendFileSync(`./${logsDir}/${status300}fail.log`, JSON.stringify(log, null, 4));
                                                                        }
                                                                        else if (level1response.status === 404 || level1response.status === 401) {
                                                                            log = {
                                                                                "Cтатус": level1response.status,
                                                                                "Первый url": ic.decode(Buffer('' + url, 'binary'), "win1251"),
                                                                                "Конечный url (если 302 были)": ic.decode(Buffer('' + curURL, 'binary'), "win1251"),
                                                                                "Title": ic.decode(Buffer('' + level1titles[index], 'binary'), "win1251"),
                                                                                "File": 'data'+(startIndex+index),
                                                                                "Уровень": "1. разделы"
                                                                            }
                                                                            require('fs').appendFileSync(`./${logsDir}/${sta}.log`, JSON.stringify(log, null, 4));
                                                                        }
                                                                        else if (level1response.status !== 200) {
                                                                            log = {
                                                                                "Cтатус": level1response.status,
                                                                                "Первый url": ic.decode(Buffer('' + url, 'binary'), "win1251"),
                                                                                "Конечный url (если 302 были)": ic.decode(Buffer('' + curURL, 'binary'), "win1251"),
                                                                                "Title": ic.decode(Buffer('' + level1titles[index], 'binary'), "win1251"),
                                                                                "File": 'data'+(startIndex+index),
                                                                                "Уровень": "1. разделы"
                                                                            }
                                                                            require('fs').appendFileSync(`./${logsDir}/otherCode.log`, JSON.stringify(log, null, 4));
                                                                        }
                                                                        // в лог
                }
            }
            catch(error) {
                                                                                            // в лог ERROR
                                                                                            log = {
                                                                                                "Ошибка": error,
                                                                                                "Первый url": ic.decode(Buffer('' + url, 'binary'), "win1251"),
                                                                                                "Конечный url (если 302 были)": ic.decode(Buffer('' + curURL, 'binary'), "win1251"),
                                                                                                "Title": ic.decode(Buffer('' + level1titles[index], 'binary'), "win1251"),
                                                                                                "File": 'data'+(startIndex+index),
                                                                                                "Уровень": "1. разделы"
                                                                                            }
                                                                                            require('fs').appendFileSync(`./${logsDir}/ERROR.log`, JSON.stringify(log, null, 4));
                                                                                            // в лог
                console.log('\x1b[31m-- Эй ёпта! Чел, ERROR! %s\x1b[0m', error)
                continue
            }
        }
        //убрать
        //console.log( ic.decode(Buffer('' + level1titles[index], 'binary'), "win1251"));
        //console.log(curURL);
        //console.log(ic.decode(Buffer('' + url, 'binary'), "win1251"));
        const soup2 = new JSSoup(level1response.body);
        status = level1response.status;

        let isOtherUrl = false;
        // Заглушка для левых ссылок. Нужно посмотреть что там на самом деле будет.
        if(curURL.indexOf('https://its.1c.ru') === -1) {
            isOtherUrl = true;  
            status = "Э бля, это не https://its.1c.ru"
                                                                                           // в лог otherDomain
                                                                                           log = {
                                                                                               "url": ic.decode(Buffer('' + url, 'binary'), "win1251"),
                                                                                               "Конечный url (для 302)": ic.decode(Buffer('' + curURL, 'binary'), "win1251"),
                                                                                               "Title": ic.decode(Buffer('' + level1titles[index], 'binary'), "win1251"),
                                                                                               "File": 'data'+(startIndex+index),
                                                                                               "Уровень": "1. разделы"
                                                                                           }
                                                                                           require('fs').appendFileSync(`./${logsDir}/otherDomain.log`, JSON.stringify(log, null, 4));
                                                                                       
                                                                                        // в лог
        }   
        const dom2 = new JSDOM(level1response.body);

        const listLevel2_0 = soup2.findAll('li').reduce((accumulator, li) => {
            if (li.attrs && li.attrs.class) {
                if (li.attrs.class.search(/(icon0)|(icon1)|(icon2)|(icon3)|(icon4)|(icon5)/i) !== -1 && li.find('a')) {
                    accumulator.push(li.find('a'));
                }
            }
            return accumulator
        }, [])

        Array.from(dom2.window.document.querySelectorAll("li.icon0, li.icon1, li.icon2, li.icon3, li.icon4, li.icon5")).forEach(element => {element.remove()})
        const listLevel2_1 = soup2.findAll('a').filter(obj => {
            if (obj.attrs && obj.attrs.class) {
                return obj.attrs.class.search(/(icon0)|(icon1)|(icon2)|(icon3)|(icon4)|(icon5)/i) !== -1
            }
            else {
                return false
            }
        })
        const listLevel2_2 = soup2.findAll('A').filter(obj => {
            if (obj.attrs && obj.attrs.class) {
                return obj.attrs.class.search(/(icon0)|(icon1)|(icon2)|(icon3)|(icon4)|(icon5)/i) !== -1
            }
            else {
                return false
            }
        })
        // тут мы удаляем элементы а с иконами, чтобы они не продублировались в поиске по doc, потому что такое возможно
        Array.from(dom2.window.document.querySelectorAll("a.icon0, a.icon1, a.icon2, a.icon3, a.icon4, a.icon5, A.icon0, A.icon1, A.icon2, A.icon3, A.icon4, A.icon5")).forEach(element => {element.remove()})
        // по сути это обычный DOM селектор как для CSS
        let listLevel2_3temp = dom2.window.document.querySelectorAll("li.doc > a");
        //  имитируем структуру как у остальных массивов
        let listLevel2_3  = Array.from(listLevel2_3temp).map(element => {
          return {
            contents: [{_text: element.innerHTML}],
            attrs: {
              href: element.attributes.href.value
            }
          }
        })
        let iframe = dom2.window.document.getElementsByTagName("IFRAME")[0];
        if (iframe) {
          let localDom = new JSDOM(iframe.contentDocument);
          let specialIframeLinks = Array.from(localDom.window.document.querySelectorAll("p > a:not(.share)"))
          .map(element => {
            return {
              contents: [{_text: element.innerHTML}],
              attrs: {
                href: element.attributes.href.value
              }
            }
          })
        }
        let listLevel2_4 = []
        if(curURL === 'https://its.1c.ru/clip8') {
                                                                           // в лог video
                                                                       log = {
                                                                           "url": ic.decode(Buffer('' + url, 'binary'), "win1251"),
                                                                           "Конечный url (для 302)": ic.decode(Buffer('' + curURL, 'binary'), "win1251"),
                                                                           "Title": ic.decode(Buffer('' + level1titles[index], 'binary'), "win1251"),
                                                                           "File": 'data'+(startIndex+index),
                                                                           "Уровень": "1. разделы"
                                                                       }
                                                                       require('fs').appendFileSync(`./${logsDir}/video.log`, JSON.stringify(log, null, 4));
                                                                    
                                                                    // в лог
            listLevel2_4 = soup2.findAll('a').filter(obj => {
                if (obj.attrs && obj.attrs.class) {
                    return obj.attrs.class.indexOf('popup') !== -1
                }
                else {
                    return false
                }
            })
        }

        let listLevel2 = [...listLevel2_0, ...listLevel2_1, ...listLevel2_2, ...listLevel2_3, ...listLevel2_4]


        // НЕ УДАЛЯТЬ!
        if (listLevel2.length === 0) {
            const lis = soup2.findAll('div').reduce((accumulator, div) => {
                if (div.attrs && div.attrs.id && div.attrs.id.indexOf('w_content')!== -1) {
                    accumulator.push(div);
                }
                return accumulator
            }, [])
            let lislis = []
            lis.forEach((li) => {
                let qq = li.findAll('li').reduce((accumulator, div) => {
                    if (div.attrs && div.attrs.class && div.find('a') && ic.decode(Buffer('' + div.find('a').contents[0]._text, 'binary'), "win1251") === "Содержание") {
                        accumulator = [...accumulator, ...div.findAll('li')]
                    }
                    return accumulator
                }, [])
                lislis = [...lislis, ...qq]
            })
            listLevel2 = await postpost(lislis, 0);
            listLevel2 = listLevel2.map(li => {
                return li.find('a')
            });
        }
        
        const pagesCounter = listLevel2.length
        console.log('# listLevel2.length =', pagesCounter)
        const cohesion = []
        const level2links = []
        const level2titles = []
        const level2codes = []
        let pageWithoutContents = ''

        if (pagesCounter === 0) {
            console.log("Документ записался в корень. Все ок.")
            pageWithoutContents = ic.decode(Buffer('' + level1response.body, 'binary'), "win1251");
        }
        // убрать
        //listLevel2.length = 0;
        for (const [ind, a] of listLevel2.entries()) {
            if (a.attrs && a.attrs.href) {
                if (a.contents[0]) {
                    level2titles.push(a.contents[0]._text)
                    // так надо?
                } else {
                    level2titles.push(undefined)
                }
                if  (a.attrs.href.indexOf('http') !== 0) {
                    if (a.attrs.href.indexOf('download') !== -1) continue
                    level2links.push(ROOT_URL + a.attrs.href);
                }
                else {
                    if (a.attrs.href.indexOf('download') !== -1) continue
                    level2links.push(a.attrs.href);
                }
            }
        }

        const level2responses = []
        let level2response

        const parIndex = index;

        if(level2links[0] && !level2uniquefirstlink.has(level2links[0]))
        for (const [index, url] of level2links.entries()) {
            if(!level2uniquelinks.has(url.split('?')[0])) {
                level2uniquelinks.add(url.split('?')[0]);
                isrepeatedlevel2link[url.split('?')[0]] = {
                    index: index,
                    firstData: 'data'+parIndex,
                    title: ic.decode(Buffer('' + level2titles[index], 'binary'), "win1251"),
                    url: ic.decode(Buffer('' + url, 'binary'), "win1251"),
                }
            } else {
                console.log("!!!!!!!!!!!! КОПИЯ !!!!!!!!!!!!!!")
                cohesion[index] = {};
                cohesion[index].title = ic.decode(Buffer('' + level2titles[index], 'binary'), "win1251") ;
                cohesion[index].link = ic.decode(Buffer('' + level2links[index], 'binary'), "win1251");
                cohesion[index].repeated = isrepeatedlevel2link[url.split('?')[0]] || "repeated";
                continue;
            }
            try {
                level2response = await new Promise((resolve, reject) => {
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
                        if (err){
                            reject(err)
                            return
                        }
                        //выводим в консоль инфу со статусом
                        console.log(response.statusCode === 200 ? '\x1b[32m%s\x1b[0m' : '\x1b[33m%s\x1b[0m',
                                    `-- Content ${index+1}/${level2links.length} fetched ${url} with ${response.statusCode}`)
                        resolve({
                            response,
                            body: body,
                            status: response.statusCode,
                        })
                    });
                });
                let sta = level2response.status
                                                                                    // в лог 301 302
                                                                                    if (sta === 302 || sta === 301) {
                                                                                        log = {
                                                                                            "Cтатус": sta,
                                                                                            "Первый url": ic.decode(Buffer('' + url, 'binary'), "win1251"),
                                                                                            "Конечный url": "301 302 тут не обрабатывается",
                                                                                            "Title": ic.decode(Buffer('' + level2titles[index], 'binary'), "win1251"),
                                                                                            "File": 'data'+(startIndex+parIndex),
                                                                                            "Уровень": "2. статьи"
                                                                                        }
                                                                                        require('fs').appendFileSync(`./${logsDir}/${sta}fail.log`, JSON.stringify(log, null, 4));
                                                                                    }
                                                                                    else if (sta === 404 || sta === 401) {
                                                                                        log = {
                                                                                            "Cтатус": sta,
                                                                                            "url": ic.decode(Buffer('' + url, 'binary'), "win1251"),
                                                                                            "Title": ic.decode(Buffer('' + level2titles[index], 'binary'), "win1251"),
                                                                                            "File": 'data'+(startIndex+parIndex),
                                                                                            "Уровень": "2. статьи"
                                                                                        }
                                                                                        require('fs').appendFileSync(`./${logsDir}/${sta}.log`, JSON.stringify(log, null, 4));
                                                                                    }
                                                                                    else if (sta !== 200) {
                                                                                        log = {
                                                                                            "Cтатус": sta,
                                                                                            "Первый url": ic.decode(Buffer('' + url, 'binary'), "win1251"),
                                                                                            "Title": ic.decode(Buffer('' + level2titles[index], 'binary'), "win1251"),
                                                                                            "File": 'data'+(startIndex+parIndex),
                                                                                            "Уровень": "2. статьи"
                                                                                        }
                                                                                        require('fs').appendFileSync(`./${logsDir}/otherCode.log`, JSON.stringify(log, null, 4));
                                                                                    }
                                                                                    // в лог
                
                // Заглушка для левых ссылок. Нужно посмотреть что там на самом деле будет.
                if(url.indexOf('https://its.1c.ru') === -1) {
                    sta = "Э бля, это не https://its.1c.ru"
                                                                                       // в лог otherDomain
                                                                                       log = {
                                                                                           "url": ic.decode(Buffer('' + url, 'binary'), "win1251"),
                                                                                           "Title": ic.decode(Buffer('' + level2titles[index], 'binary'), "win1251"),
                                                                                           "File": 'data'+(startIndex+parIndex),
                                                                                           "Уровень": "2. статьи"
                                                                                       }
                                                                                       require('fs').appendFileSync(`./${logsDir}/otherDomain.log`, JSON.stringify(log, null, 4));
                                                                                   
                                                                                    // в лог
                }
                level2responses.push(level2response.body)
                level2codes.push(sta)

                cohesion[index] = {};
                cohesion[index].title = ic.decode(Buffer('' + level2titles[index], 'binary'), "win1251") ;
                cohesion[index].link = ic.decode(Buffer('' + level2links[index], 'binary'), "win1251");
                cohesion[index].content = ic.decode(Buffer('' + antiscript(level2response.body), 'binary'), "win1251");
                cohesion[index].versions = [];
                cohesion[index].status = level2response.status;
                                                                                                // в лог emptyContent
                                                                                                if (cohesion[index].content == "") {
                                                                                                    log = {
                                                                                                       "Ошибка": "Статья пустая ёпта",
                                                                                                       "url": ic.decode(Buffer('' + url, 'binary'), "win1251"),
                                                                                                       "Title": ic.decode(Buffer('' + level2titles[index], 'binary'), "win1251"),
                                                                                                       "File": 'data'+(startIndex+parIndex),
                                                                                                       "Уровень": "2. Статьи"
                                                                                                   }
                                                                                                   require('fs').appendFileSync(`./${logsDir}/emptyContent.log`, JSON.stringify(log, null, 4));
                                                                                                }
                                                                                                // в лог
                                                                                                // в лог titleError
                                                                                                if (level2titles[index] === null || level2titles[index] === undefined || level2titles[index] == '' || level2titles[index] === "undefined") {
                                                                                                    log = {
                                                                                                       "url": ic.decode(Buffer('' + url, 'binary'), "win1251"),
                                                                                                       "Title": ic.decode(Buffer('' + level2titles[index], 'binary'), "win1251"),
                                                                                                       "File": 'data'+(startIndex+parIndex),
                                                                                                       "Уровень": "2. Статьи"
                                                                                                   }
                                                                                                   require('fs').appendFileSync(`./${logsDir}/titleError.log`, JSON.stringify(log, null, 4));
                                                                                                }
                                                                                                // в лог
                                                                                                 
            }
            catch(error) {
                                                                                            // в лог ERROR
                                                                                            log = {
                                                                                                "Ошибка": error,
                                                                                                "Первый url": ic.decode(Buffer('' + url, 'binary'), "win1251"),
                                                                                                "Title": ic.decode(Buffer('' + level2titles[index], 'binary'), "win1251"),
                                                                                                "File": 'data'+(startIndex+parIndex),
                                                                                                "Уровень": "2. статьи"
                                                                                            }
                                                                                            require('fs').appendFileSync(`./${logsDir}/ERROR.log`, JSON.stringify(log, null, 4));
                                                                                            // в лог
                console.log('\x1b[31m-- Эй ёпта! Чел, ERROR! %s\x1b[0m', error)
                continue
            }

            // третий уровень для мужыков
            const soup3 = new JSSoup(level2response.body);
            const liList3 = soup3.findAll('li')
            const level3titles = []
            const level3links = []
            const level3codes = []
            const level3responses = []

            for (const [ind, li] of liList3.entries()) {
                let level3link = ""
                let a = li.find('A')
                if(!a) {
                    a = li.find('a')
                }
                if (a && a.attrs && a.attrs.href &&
                    (ROOT_URL + a.attrs.href)
                        .indexOf(level2links[index]
                        .split('.htm')[0] + '_') !== -1
                    ) {
                    if (a.attrs.href.indexOf('download') !== -1) continue
                    if  (a.attrs.href.indexOf('http') === -1) {
                        level3link = ROOT_URL + a.attrs.href
                    }
                    else {
                        level3link = a.attrs.href
                    }
                    level3titles.push(a.contents[0]._text)
                    level3links.push(level3link)
                }
            }

            for (const [ind, url] of level3links.entries()) {
                try {
                    level3response = await new Promise((resolve, reject) => {
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
                            if (err){
                                reject(err)
                                return
                            }
                            //выводим в консоль инфу со статусом
                            console.log(response.statusCode === 200 ? '\x1b[32m%s\x1b[0m' : '\x1b[33m%s\x1b[0m',
                                        `--- Content ${ind+1}/${level3links.length} fetched ${url} with ${response.statusCode}`)
                            const title = ic.decode(Buffer(body, 'binary'), "win1251");
                            resolve({
                                response,
                                body: title,
                                status: response.statusCode,
                            })
                        });
                    });
                    let sta = level3response.status
                                                                                                    // в лог 301 302
                                                                                                    if (sta === 302 || sta === 301) {
                                                                                                        log = {
                                                                                                            "Cтатус": sta,
                                                                                                            "Первый url": ic.decode(Buffer('' + url, 'binary'), "win1251"),
                                                                                                            "Конечный url": "301 302 тут не обрабатывается",
                                                                                                            "Title": ic.decode(Buffer('' + level3titles[ind], 'binary'), "win1251"),
                                                                                                            "File": 'data'+(startIndex+parIndex),
                                                                                                            "Уровень": "3. версии"
                                                                                                        }
                                                                                                        require('fs').appendFileSync(`./${logsDir}/${sta}fail.log`, JSON.stringify(log, null, 4));
                                                                                                    } 
                                                                                                    else if (sta === 404 || sta === 401) {
                                                                                                        log = {
                                                                                                            "Cтатус": sta,
                                                                                                            "url": ic.decode(Buffer('' + url, 'binary'), "win1251"),
                                                                                                            "Title": ic.decode(Buffer('' + level3titles[ind], 'binary'), "win1251"),
                                                                                                            "File": 'data'+(startIndex+parIndex),
                                                                                                            "Уровень": "3. версии"
                                                                                                        }
                                                                                                        require('fs').appendFileSync(`./${logsDir}/${sta}.log`, JSON.stringify(log, null, 4));
                                                                                                    }
                                                                                                    else if (sta !== 200) {
                                                                                                        log = {
                                                                                                            "Cтатус": sta,
                                                                                                            "Первый url": ic.decode(Buffer('' + url, 'binary'), "win1251"),
                                                                                                            "Title": ic.decode(Buffer('' + level3titles[ind], 'binary'), "win1251"),
                                                                                                            "File": 'data'+(startIndex+parIndex),
                                                                                                            "Уровень": "3. версии"
                                                                                                        }
                                                                                                        require('fs').appendFileSync(`./${logsDir}/otherCode.log`, JSON.stringify(log, null, 4));
                                                                                                    }
                                                                                                    // в лог
                    
                    // Заглушка для левых ссылок. Нужно посмотреть что там на самом деле будет.
                    if(url.indexOf('https://its.1c.ru') === -1) {
                        sta = "Э бля, это не https://its.1c.ru"
                                                                                                    // в лог otherDomain
                                                                                                        log = {
                                                                                                           "url": ic.decode(Buffer('' + url, 'binary'), "win1251"),
                                                                                                           "Title": ic.decode(Buffer('' + level3titles[ind], 'binary'), "win1251"),
                                                                                                           "File": 'data'+(startIndex+parIndex),
                                                                                                           "Уровень": "3. версии"
                                                                                                       }
                                                                                                       require('fs').appendFileSync(`./${logsDir}/otherDomain.log`, JSON.stringify(log, null, 4));
                                                                                                    
                                                                                                    // в лог
                    }
                    level3responses.push(level3response.body)
                    level3codes.push(sta)

                    cohesion[index].versions.push({
                        title: ic.decode(Buffer('' + level3titles[ind], 'binary'), "win1251"),
                        link: ic.decode(Buffer('' + level3links[ind], 'binary'), "win1251"),
                        content: antiscript(level3response.body),
                        status: level3response.status,
                    })
                    
                                                                                                // в лог titleError
                                                                                                if (level3titles[ind] === null || level3titles[ind] === undefined || level3titles[ind] == '' || level3titles[ind] === "undefined") {
                                                                                                    log = {
                                                                                                       "url": ic.decode(Buffer('' + url, 'binary'), "win1251"),
                                                                                                       "Title": ic.decode(Buffer('' + level3titles[ind], 'binary'), "win1251"),
                                                                                                       "File": 'data'+(startIndex+parIndex),
                                                                                                       "Уровень": "3. версии"
                                                                                                   }
                                                                                                   require('fs').appendFileSync(`./${logsDir}/titleError.log`, JSON.stringify(log, null, 4));
                                                                                                }
                                                                                                // в лог
                }
                catch(error) {
                                                                                                    // в лог ERROR
                                                                                                    log = {
                                                                                                        "Ошибка": error,
                                                                                                        "Первый url": ic.decode(Buffer('' + url, 'binary'), "win1251"),
                                                                                                        "Title": ic.decode(Buffer('' + level3titles[ind], 'binary'), "win1251"),
                                                                                                        "File": 'data'+(startIndex+parIndex),
                                                                                                        "Уровень": "3. версии"
                                                                                                    }
                                                                                                    require('fs').appendFileSync(`./${logsDir}/ERROR.log`, JSON.stringify(log, null, 4));
                                                                                                    // в лог
                    console.log('\x1b[31m--- Эй ёпта! Чел, ERROR! %s\x1b[0m', error)
                    continue
                }
            }
        }

        let repeatingLinks_ = {}
        let isrepeatingRazd = false;
        if(level2links[0] && level2uniquefirstlink.has(level2links[0])) {
            isrepeatingRazd = true
            repeatingLinks_ = repeatingLinks[level2links[0]]
                                                                            // в лог repeated
                                                                               log = {
                                                                                  "url": ic.decode(Buffer('' + url, 'binary'), "win1251"),
                                                                                  "Конечный url (для 302)": ic.decode(Buffer('' + curURL, 'binary'), "win1251"),
                                                                                  "Title": ic.decode(Buffer('' + l1title, 'binary'), "win1251"),
                                                                                  "File": 'data'+(startIndex+index),
                                                                                  'Первая ссылка на этот раздел': repeatingLinks_,
                                                                                  "Уровень": "1. разделы"
                                                                              }
                                                                              require('fs').appendFileSync(`./${logsDir}/repeated.log`, JSON.stringify(log, null, 4));
                                                                            // в лог
        }

        const results = {
            'title': ic.decode(Buffer('' + l1title, 'binary'), "win1251"),
            'link': ic.decode(Buffer('' + url, 'binary'), "win1251"),
            'status': status,
            'pageWithoutContents': antiscript(pageWithoutContents),
            'repeated': level2uniquefirstlink.has(level2links[0]),
            'repeatingLinks': repeatingLinks_,
           // 'contents': cohesion - не удалять
        }
                                                                                    // в лог titleError
                                                                                    if (l1title === null || l1title === undefined || l1title == '' || l1title === "undefined") {
                                                                                        log = {
                                                                                           "url": ic.decode(Buffer('' + url, 'binary'), "win1251"),
                                                                                           "Конечный url (для 302)": ic.decode(Buffer('' + curURL, 'binary'), "win1251"),
                                                                                           "Title": ic.decode(Buffer('' + l1title, 'binary'), "win1251"),
                                                                                           "File": 'data'+(startIndex+index),
                                                                                           "Уровень": "1. разделы"
                                                                                       }
                                                                                       require('fs').appendFileSync(`./${logsDir}/titleError.log`, JSON.stringify(log, null, 4));
                                                                                    }
                                                                                    // в лог

        // добавляем уникальную хуйню. has не трогать!
        if(level2links[0] && !level2uniquefirstlink.has(level2links[0])) {
            level2uniquefirstlink.add(level2links[0]);
            let lnk = level2links[0];
            repeatingLinks[lnk] = {
                linkFirstMention: ic.decode(Buffer('' + url, 'binary'), "win1251"),
                titleFirstMention: ic.decode(Buffer('' + l1title, 'binary'), "win1251"),
                data: `./dumps/data${index}.json`
            }
        }

        // пока не удалять
        /*if (level2links.length < 500)
            require('fs').writeFileSync(`./dumps/data${index}.json`, JSON.stringify(results, null, 4));
        else {*/
            if (cohesion.length > 0) results.contents = "СМОТРИ ДОЧЕРНИЕ ФАЙЛЫ!"
            else {
                results.contents = "ПУСТО"
                                                                                                 // в лог emptyContent
                                                                                                 log = {
                                                                                                     "Ошибка": "У раздела нет ссылок (статей)? видимо нет",
                                                                                                     "url": ic.decode(Buffer('' + url, 'binary'), "win1251"),
                                                                                                     "Конечный url (для 302)": ic.decode(Buffer('' + curURL, 'binary'), "win1251"),
                                                                                                     "Title": ic.decode(Buffer('' + level1titles[index], 'binary'), "win1251"),
                                                                                                     "File": 'data'+(startIndex+index),
                                                                                                     "Уровень": "1. разделы"
                                                                                                 }
                                                                                                 let hdoc_ = ic.decode(Buffer('' + curURL, 'binary'), "win1251")
                                                                                                 let hdoc = (hdoc_.slice(-5) === '/hdoc' || hdoc_.slice(-6) === '/hdoc/')
                                                                                                 if (!isrepeatingRazd && !isOtherUrl && !hdoc) require('fs').appendFileSync(`./${logsDir}/emptyContent.log`, JSON.stringify(log, null, 4));
                                                                                                 // в лог
            }
            require('fs').writeFileSync(`./dumps/data${startIndex+index}.json`, JSON.stringify(results, null, 4));

            let i = 0;
            for(; i < level2links.length/300 - 1; i++) {
                let removed = cohesion.splice(0, 300);
                require('fs').appendFileSync(`./dumps/data${startIndex+index}_${i}.json`, JSON.stringify(removed, null, 4));
            }
            if (cohesion.length > 0) require('fs').appendFileSync(`./dumps/data${startIndex+index}_${i}.json`, JSON.stringify(cohesion, null, 4));
            
            /* ВОЗМОЖНО, НО НЕ СЕГОДНЯ 
            require('fs').writeFileSync(`./dumps/data${index}.json`, 
            `{
                'title': ${ic.decode(Buffer('' + l1title, 'binary'), "win1251")},
                'link': ${ic.decode(Buffer('' + url, 'binary'), "win1251")},
                'status': ${status},
                'pageWithoutContents': ${JSON.stringify(pageWithoutContents, null, 4)},
                'repeated': ${level2uniquefirstlink.has(level2links[0])},
                'repeatingLinks': ${JSON.stringify(repeatingLinks_, null, 4)},
                'contents': [`);
            for(let i = 0; i < 2; i++) {
                let removed = cohesion.splice(0, 1500);
                require('fs').appendFileSync(`./dumps/data${index}.json`, JSON.stringify(removed, null, 4));
            }
            require('fs').appendFileSync(`./dumps/data${index}.json`, JSON.stringify(cohesion, null, 4));
            require('fs').appendFileSync(`./dumps/data${index}.json`, 
            `]}`); */
        //}
    }
}

    main();


    // всё

    // далее шлак, который может пригодится
/*
    // `tress` последовательно вызывает обработчик для каждой ссылки в очереди
    var q = tress(function(url, callback){
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
            if (err){
                console.log('\x1b[31mЭй ёпта! Чел, ERROR! %s\x1b[0m', e)
                return
            }



            // Декодируем в утф
            let title = ic.decode(Buffer(body, 'binary'), "win1251");
            // Хуярим в результаты. строку из статус кода и результата
            results.push(response.statusCode + ': ' + title);
            // вызываем callback в конце. О да, колбек. люблю его

            callback();
        });
    });

    q.drain = function(){
        //require('fs').writeFileSync('./data.json', JSON.stringify(results, null, 4));
    }

    level1links.forEach( (url) => {
        q.push(url);
    });
}


*/
/*



const data = {
    'openid.auth.check':	'true',
    'openid.auth.pwd':	P,
    'openid.auth.short':	'false',
    'openid.auth.user':	U,
    'openid.claimed_id':	'http://specs.openid.net/auth/2.0/identifier_select',
    'openid.identity':	'http://specs.openid.net/auth/2.0/identifier_select',
    'openid.mode':	'checkid_immediate',
    'openid.ns':	'http://specs.openid.net/auth/2.0',
    'openid.realm':	'https://its.1c.ru/login/?action=afterlogin&provider=fresh',
    'openid.return_to':	'https://its.1c.ru/login/?action=afterlogin&provider=fresh&backurl=%2Fsection%2Fall'
};






const cookies =
    'BITRIX_SM_LOGIN=partweb;'+
    'PHPSESSID='+PHPSESSID+';'+
    'SUBSCRIBE_PERIOD=31.12.2018;'+
    'USER_TYPE=:1:2:20:21:25:203:801:;'+
    'PARTWEB_LOGIN='+U+';';
*/





/*
lislis.forEach((lll) => {
    console.log(ic.decode(Buffer('' + lll.find('a').contents[0]._text, 'binary'), "win1251"))
})
*/



let postpost = async function (lis, count) {
        if (count > 10) {
            return []
        }
        console.log('\x1b[34mcount = %s\x1b[0m', count)

        let returnList = []

        let level1links = []
        let level1list = []
        for (const [index, li] of lis.entries()) {
            console.log(ic.decode(Buffer('' + li.find('a').contents[0]._text, 'binary'), "win1251"))
            try {
                if(li.attrs && li.attrs.class && li.attrs.class.indexOf('icon0') !== -1) {
                    returnList.push(li)
                }
                else if (li.attrs && li.attrs.class && li.attrs.class.indexOf('folder') !== -1) {
                    let level1link = ""
                    let a = li.find('a')    
                    if (a.attrs && a.attrs.href) {
                        if  (a.attrs.href.indexOf('http') === -1) {
                            level1link = ROOT_URL + a.attrs.href
                        }
                        else {
                            level1link = a.attrs.href
                        }
                    }
                    level1links.push(level1link)
                    level1list.push(a.contents[0]._text)
                }
            }
            catch(error) {
                continue
            }
        }

        let level1response;
        for (const [index, url] of level1links.entries()) {
            try {
                level1response = await new Promise((res, rej) => {
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
                        if (err){
                            reject(err)
                            return
                        }
                        if(response.statusCode === 200)
                        res({
                                response,
                                body: body,
                                status: response.statusCode,
                            })
                        else {
                            rej(err)
                        }
                    });
                });
            }
            catch(error) {
                continue
            }

            let lisliss = []
            let qq = new JSSoup(level1response.body).findAll('li').reduce((accumulator, div) => {
                if (div.attrs && div.attrs.class 
                    && div.find('a') 
                    && div.find('a').contents[0]._text === level1list[index]) {
                    accumulator = [...accumulator, ...div.findAll('li')]
                }
                return accumulator
            }, [])
            let qqq = new JSSoup(level1response.body).findAll('li').filter(li => {
                if(li.attrs && li.attrs.class) return li.attrs.class.indexOf('icon0') !== -1
                else return false
            })
            lisliss = [...lisliss, ...qq, ...qqq]
            listlist = await postpost(lisliss, count+1);
            if(listlist && listlist[0]) returnList = [...returnList, ...listlist]
        }
        return  returnList;
}



var antiscript = function(body) {
    let bd = antinrt(body);
    //let first = bd.search(/<[^\/]*script[^>]*>/i);
    let first = bd.search(/<script[^>]*>/i);
    let second = bd.search(/<\/script>/i);
    while(first !== -1) {
        substr = bd.slice(first, second+9)
        bd = bd.replace(substr, '')
        first = bd.search(/<script[^>]*>/i);
        second = bd.search(/<\/script>/i);
    } 
    return bd;
} 

var antinrt = function(body) {
    let re = /(\r)|(\n)|(\t)/g;
    let newstr = body.replace(re, '');
    newstr = newstr.replace('<IMG', '<img').replace(/<!--\[if lt IE ?\]><!\[endif\]-->/,'');
    return newstr;
} 



// ну так уж и быть с др