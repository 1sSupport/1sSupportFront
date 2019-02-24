const tress = require('tress');
const request = require('request');
const ic = require('iconv-lite');
const JSSoup = require('jssoup').default;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// Взять из кукисов
const PHPSESSID = '0af33kpkvf6rk1hhec5fu08rp6'
const ROOT_URL = 'https://its.1c.ru';
const P = '801db464';
const U = '49289-40';
let log = {};

let startIndex = 0; // Откудава стартовать будем? с нуля до 500 примерно
const logsDir = "logs"; // Папка для логов

console.log("logDir = ",logsDir)

var superindex = startIndex;
var supercounter = 0;
var startIndexRecursion = 0;

const j = request.jar();
// записываем в куки PHPSESSID
const cookie = request.cookie(`PHPSESSID=${PHPSESSID}`);
//const cookie = cookies;
j.setCookie(cookie, ROOT_URL);

const LINKS = new Set();

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
    require('fs').writeFileSync(`./${logsDir}/recursion.log`, '');
    require('fs').writeFileSync(`./${logsDir}/recursionError.log`, '');
    require('fs').writeFileSync(`./${logsDir}/test.log`, '');
    require('fs').writeFileSync(`./${logsDir}/video.log`, '');

    const mainResponse = await new Promise(resolve => {
        request.post(
            {
                url: 'https://its.1c.ru/section/all',
                jar: j,
                encoding: 'binary',
            }, (err, response, body) => {
                //let title = ic.decode(Buffer.from(body, 'binary'), "win1251");
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

    if(liList)
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

    if(level1links)
        for (const [index, url] of level1links.entries()) {
            require('fs').writeFileSync(`./startindex.txt`, +index + startIndex);
            superindex = +index + startIndex;
            startIndexRecursion = 0;
            supercounter = 0;
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
                                //const title = ic.decode(Buffer.from(body, 'binary'), "win1251");
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
                                "Первый url": ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                                "Конечный url": ic.decode(Buffer.from('' + curURL, 'binary'), "win1251"),
                                "Title": ic.decode(Buffer.from('' + level1titles[index], 'binary'), "win1251"),
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
                                "Первый url": ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                                "Конечный url (если 302 были)": ic.decode(Buffer.from('' + curURL, 'binary'), "win1251"),
                                "Title": ic.decode(Buffer.from('' + level1titles[index], 'binary'), "win1251"),
                                "File": 'data'+(startIndex+index),
                                "Уровень": "1. разделы"
                            }
                            require('fs').appendFileSync(`./${logsDir}/${sta}.log`, JSON.stringify(log, null, 4));
                        }
                        else if (level1response.status !== 200) {
                            log = {
                                "Cтатус": level1response.status,
                                "Первый url": ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                                "Конечный url (если 302 были)": ic.decode(Buffer.from('' + curURL, 'binary'), "win1251"),
                                "Title": ic.decode(Buffer.from('' + level1titles[index], 'binary'), "win1251"),
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
                        "Первый url": ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                        "Конечный url (если 302 были)": ic.decode(Buffer.from('' + curURL, 'binary'), "win1251"),
                        "Title": ic.decode(Buffer.from('' + level1titles[index], 'binary'), "win1251"),
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
            //console.log( ic.decode(Buffer.from('' + level1titles[index], 'binary'), "win1251"));
            //console.log(curURL);
            //console.log(ic.decode(Buffer.from('' + url, 'binary'), "win1251"));
            const soup2 = new JSSoup(level1response.body);
            status = level1response.status;

            // Заглушка для левых ссылок. Нужно посмотреть что там на самом деле будет.
            if(curURL.indexOf('https://its.1c.ru') === -1) {
                status = 800
                // в лог otherDomain
                log = {
                    "url": ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                    "Конечный url (для 302)": ic.decode(Buffer.from('' + curURL, 'binary'), "win1251"),
                    "Title": ic.decode(Buffer.from('' + level1titles[index], 'binary'), "win1251"),
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
                    "url": ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                    "Конечный url (для 302)": ic.decode(Buffer.from('' + curURL, 'binary'), "win1251"),
                    "Title": ic.decode(Buffer.from('' + level1titles[index], 'binary'), "win1251"),
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


            if (listLevel2.length === 0 && curURL.indexOf('https://its.1c.ru') !== -1) {

                // в лог recursion
                log = {
                    "url": ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                    "Конечный url (для 302)": ic.decode(Buffer.from('' + curURL, 'binary'), "win1251"),
                    "Title": ic.decode(Buffer.from('' + l1title, 'binary'), "win1251"),
                    "File": 'data'+(startIndex+index),
                    "Уровень": "1. разделы"
                }
                require('fs').appendFileSync(`./${logsDir}/recursion.log`, JSON.stringify(log, null, 4));

                const lis = soup2.findAll('div').reduce((accumulator, div) => {
                    if (div.attrs && div.attrs.id && div.attrs.id.indexOf('w_content')!== -1) {
                        accumulator.push(div);
                    }
                    return accumulator
                }, [])
                let lislis = []
                lis.forEach((li) => {
                    let qq = li.findAll('li').reduce((accumulator, div) => {
                        if (div.attrs && div.attrs.class && div.find('a') && ic.decode(Buffer.from('' + div.find('a').contents[0]._text, 'binary'), "win1251") === "Содержание") {
                            accumulator = [...accumulator, ...div.findAll('li')]
                        }
                        return accumulator
                    }, [])
                    lislis = [...lislis, ...qq]
                })
                listLevel2 = await postpost(lislis, 0, log);

                console.log('\x1b[31m-- %s\x1b[0m', listLevel2.length)
                console.log('\x1b[31m-- Array? %s\x1b[0m', listLevel2 instanceof Array)
                LINKS.clear();
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
                pageWithoutContents = ic.decode(Buffer.from('' + level1response.body, 'binary'), "win1251");
            }
            // убрать
            //listLevel2.length = 0;
            if(listLevel2)
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
            let repeatingLinks_ = {}
            let isrepeatingRazd = false;

            const sets = [];

            if(level2links[0] && !level2uniquefirstlink.has(level2links[0])) {
                let size = 500; //размер подмассива
                const amountOfLinks=level2links.length;
                let sublevel2links = []; //массив в который будет выведен результат.
                for (let i = 0; i <Math.ceil(level2links.length/size); i++){
                    sublevel2links[i] = level2links.slice((i*size), (i*size) + size);
                }
                for(const [i, level2links] of sublevel2links.entries()) {
                    console.log(process.memoryUsage());
                    if(i<startIndexRecursion)continue; // 34106
                    require('fs').writeFileSync(`./startIndexRecursion.txt`, +i*size);
                    sets.push(new Set())
                    for (const [index, url] of level2links.entries()) {

                        const stop = sets.some(set => {
                            return set.has(url)
                        });

                        if(stop) {
                            console.log("COPY (((((");
                            continue;
                        }

                        sets[i].add(url);

                        if(!level2uniquelinks.has(url.split('?')[0])) {
                            level2uniquelinks.add(url.split('?')[0]);
                            isrepeatedlevel2link[url.split('?')[0]] = {
                                index: index,
                                firstData: 'data'+parIndex,
                                title: ic.decode(Buffer.from('' + level2titles[index+i*size], 'binary'), "win1251"),
                                url: ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                            }
                        } else {
                            console.log("!!!!!!!!!!!! КОПИЯ !!!!!!!!!!!!!!")
                            cohesion[index] = {};
                            cohesion[index].title = ic.decode(Buffer.from('' + antidate(level2titles[index+i*size]), 'binary'), "win1251") ;
                            cohesion[index].link = ic.decode(Buffer.from('' + level2links[index], 'binary'), "win1251");
                            cohesion[index].repeated = isrepeatedlevel2link[url.split('?')[0]] || "repeated";
                            cohesion[index].content ='';
                            cohesion[index].versions = [];
                            cohesion[index].status = 200;
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
                                            `-- Content ${index+i*size+1}/${amountOfLinks} fetched ${url} with ${response.statusCode}`)
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
                                    "Первый url": ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                                    "Конечный url": "301 302 тут не обрабатывается",
                                    "Title": ic.decode(Buffer.from('' + level2titles[index+i*size], 'binary'), "win1251"),
                                    "File": 'data'+(startIndex+parIndex),
                                    "Уровень": "2. статьи"
                                }
                                require('fs').appendFileSync(`./${logsDir}/${sta}fail.log`, JSON.stringify(log, null, 4));
                            }
                            else if (sta === 404 || sta === 401) {
                                log = {
                                    "Cтатус": sta,
                                    "url": ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                                    "Title": ic.decode(Buffer.from('' + level2titles[index+i*size], 'binary'), "win1251"),
                                    "File": 'data'+(startIndex+parIndex),
                                    "Уровень": "2. статьи"
                                }
                                require('fs').appendFileSync(`./${logsDir}/${sta}.log`, JSON.stringify(log, null, 4));
                            }
                            else if (sta !== 200) {
                                log = {
                                    "Cтатус": sta,
                                    "Первый url": ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                                    "Title": ic.decode(Buffer.from('' + level2titles[index+i*size], 'binary'), "win1251"),
                                    "File": 'data'+(startIndex+parIndex),
                                    "Уровень": "2. статьи"
                                }
                                require('fs').appendFileSync(`./${logsDir}/otherCode.log`, JSON.stringify(log, null, 4));
                            }
                            // в лог

                            // Заглушка для левых ссылок. Нужно посмотреть что там на самом деле будет.
                            if(url.indexOf('https://its.1c.ru') === -1) {
                                sta = 800
                                // в лог otherDomain
                                log = {
                                    "url": ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                                    "Title": ic.decode(Buffer.from('' + level2titles[index+i*size], 'binary'), "win1251"),
                                    "File": 'data'+(startIndex+parIndex),
                                    "Уровень": "2. статьи"
                                }
                                require('fs').appendFileSync(`./${logsDir}/otherDomain.log`, JSON.stringify(log, null, 4));

                                // в лог
                            }
                            level2responses.push(level2response.body)
                            level2codes.push(sta)

                            cohesion[index] = {};
                            cohesion[index].title = ic.decode(Buffer.from('' + antidate(level2titles[index+i*size]), 'binary'), "win1251") ;
                            cohesion[index].link = ic.decode(Buffer.from('' + level2links[index], 'binary'), "win1251");
                            cohesion[index].content = ic.decode(Buffer.from('' + antiImg(antiscript(level2response.body),level2links[index]), 'binary'), "win1251");
                            cohesion[index].versions = [];

                            cohesion[index].repeated = {
                                index: 0,
                                firstData: '',
                                title: '',
                                url: '',
                            }
                            cohesion[index].status = level2response.status;
                            // в лог emptyContent
                            if (cohesion[index].content == "") {
                                log = {
                                    "Ошибка": "Статья пустая ёпта",
                                    "url": ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                                    "Title": ic.decode(Buffer.from('' + level2titles[index+i*size], 'binary'), "win1251"),
                                    "File": 'data'+(startIndex+parIndex),
                                    "Уровень": "2. Статьи"
                                }
                                require('fs').appendFileSync(`./${logsDir}/emptyContent.log`, JSON.stringify(log, null, 4));
                            }
                            // в лог
                            // в лог titleError
                            if (level2titles[index+i*size] === null || level2titles[index+i*size] === undefined || level2titles[index+i*size] == '' || level2titles[index+i*size] === "undefined") {
                                log = {
                                    "url": ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                                    "Title": ic.decode(Buffer.from('' + level2titles[index+i*size], 'binary'), "win1251"),
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
                                "Первый url": ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                                "Title": ic.decode(Buffer.from('' + level2titles[index+i*size], 'binary'), "win1251"),
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

                        if(liList3)
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

                        if(level3links.length === 0)
                            cohesion[index].versions.push(
                                {
                                    title: ic.decode(Buffer.from('' + antidate(level2titles[index+i*size]), 'binary'), "win1251"),
                                    link: ic.decode(Buffer.from('' + level2links[index], 'binary'), "win1251"),
                                    content: ic.decode(Buffer.from('' + antiImg(antiscript(level2response.body),level2links[index]), 'binary'), "win1251"),
                                    status: level2response.status,
                                }
                            )

                        if(level3links)
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
                                                const title = ic.decode(Buffer.from(body, 'binary'), "win1251");
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
                                            "Первый url": ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                                            "Конечный url": "301 302 тут не обрабатывается",
                                            "Title": ic.decode(Buffer.from('' + level3titles[ind], 'binary'), "win1251"),
                                            "File": 'data'+(startIndex+parIndex),
                                            "Уровень": "3. версии"
                                        }
                                        require('fs').appendFileSync(`./${logsDir}/${sta}fail.log`, JSON.stringify(log, null, 4));
                                    }
                                    else if (sta === 404 || sta === 401) {
                                        log = {
                                            "Cтатус": sta,
                                            "url": ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                                            "Title": ic.decode(Buffer.from('' + level3titles[ind], 'binary'), "win1251"),
                                            "File": 'data'+(startIndex+parIndex),
                                            "Уровень": "3. версии"
                                        }
                                        require('fs').appendFileSync(`./${logsDir}/${sta}.log`, JSON.stringify(log, null, 4));
                                    }
                                    else if (sta !== 200) {
                                        log = {
                                            "Cтатус": sta,
                                            "Первый url": ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                                            "Title": ic.decode(Buffer.from('' + level3titles[ind], 'binary'), "win1251"),
                                            "File": 'data'+(startIndex+parIndex),
                                            "Уровень": "3. версии"
                                        }
                                        require('fs').appendFileSync(`./${logsDir}/otherCode.log`, JSON.stringify(log, null, 4));
                                    }
                                    // в лог

                                    // Заглушка для левых ссылок. Нужно посмотреть что там на самом деле будет.
                                    if(url.indexOf('https://its.1c.ru') === -1) {
                                        sta = 800
                                        // в лог otherDomain
                                        log = {
                                            "url": ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                                            "Title": ic.decode(Buffer.from('' + level3titles[ind], 'binary'), "win1251"),
                                            "File": 'data'+(startIndex+parIndex),
                                            "Уровень": "3. версии"
                                        }
                                        require('fs').appendFileSync(`./${logsDir}/otherDomain.log`, JSON.stringify(log, null, 4));

                                        // в лог
                                    }
                                    level3responses.push(level3response.body)
                                    level3codes.push(sta)

                                    cohesion[index].versions.push({
                                        title: ic.decode(Buffer.from('' + antidate(level3titles[ind]), 'binary'), "win1251"),
                                        link: ic.decode(Buffer.from('' + level3links[ind], 'binary'), "win1251"),
                                        content: ic.decode(Buffer.from('' + antiImg(antiscript(level3response.body),level3links[ind]), 'binary'), "win1251"),
                                        status: level3response.status,
                                    })

                                    // в лог titleError
                                    if (level3titles[ind] === null || level3titles[ind] === undefined || level3titles[ind] == '' || level3titles[ind] === "undefined") {
                                        log = {
                                            "url": ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                                            "Title": ic.decode(Buffer.from('' + level3titles[ind], 'binary'), "win1251"),
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
                                        "Первый url": ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                                        "Title": ic.decode(Buffer.from('' + level3titles[ind], 'binary'), "win1251"),
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
                    // for
                    if(repeatingLinks_.linkFirstMention === undefined)
                        repeatingLinks_ = {
                            linkFirstMention: '',
                            titleFirstMention: '',
                            data: ``
                        }
                    const results = {
                        'title': ic.decode(Buffer.from('' + antidate(l1title), 'binary'), "win1251"),
                        'link': ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                        'status': status,
                        'pageWithoutContents': antiImg(antiscript(pageWithoutContents),url),
                        'repeated': level2uniquefirstlink.has(level2links[0]),
                        'repeatingLinks': repeatingLinks_,
                        'folder': 'data'+(startIndex+parIndex),
                        // 'contents': cohesion - не удалять
                    }
                    /*     // в лог titleError
                        if (l1title === null || l1title === undefined || l1title == '' || l1title === "undefined") {
                            log = {
                               "url": ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                               "Конечный url (для 302)": ic.decode(Buffer.from('' + curURL, 'binary'), "win1251"),
                               "Title": ic.decode(Buffer.from('' + l1title, 'binary'), "win1251"),
                               "File": 'data'+(startIndex+index+i*size),
                               "Уровень": "1. разделы"
                           }
                           require('fs').appendFileSync(`./${logsDir}/titleError.log`, JSON.stringify(log, null, 4));
                        }
                        // в лог */

                    // добавляем уникальную хуйню. has не трогать!
                    if(level2links[0] && !level2uniquefirstlink.has(level2links[0])) {
                        level2uniquefirstlink.add(level2links[0]);
                        let lnk = level2links[0];
                        repeatingLinks[lnk] = {
                            linkFirstMention: ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                            titleFirstMention: ic.decode(Buffer.from('' + l1title, 'binary'), "win1251"),
                            data: `./dumps/data${index+i*size}.json`
                        }
                    }
                    if (cohesion.length > 0) results.contents = true
                    else {
                        results.contents = false
                        /*                // в лог emptyContent
                                       log = {
                                           "Ошибка": "У раздела нет ссылок (статей)? видимо нет",
                                           "url": ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                                           "Конечный url (для 302)": ic.decode(Buffer.from('' + curURL, 'binary'), "win1251"),
                                           "Title": ic.decode(Buffer.from('' + level1titles[index+i*size], 'binary'), "win1251"),
                                           "File": 'data'+(startIndex+index+i*size),
                                           "Уровень": "1. разделы"
                                       }
                                       if (!isrepeatingRazd) require('fs').appendFileSync(`./${logsDir}/emptyContent.log`, JSON.stringify(log, null, 4));
                                       // в лог */
                    }


                    if (!require('fs').existsSync('./dumps/data'+(startIndex+parIndex))) {
                        require('fs').mkdirSync('./dumps/data'+(startIndex+parIndex));
                    }

                    require('fs').writeFileSync(`./dumps/data${+startIndex+parIndex}.json`, JSON.stringify(results, null, 4));

                    cohesion.forEach((coh,ii) => {
                        console.log(ii);
                        require('fs').writeFileSync(`./dumps/data${+startIndex+parIndex}/data${+startIndex+parIndex}_${ii+i*size}.json`, JSON.stringify(coh, null, 4));
                    })
                }
            }
            else {
                if(level2links[0] && level2uniquefirstlink.has(level2links[0])) {
                    isrepeatingRazd = true
                    repeatingLinks_ = repeatingLinks[level2links[0]]
                    // в лог repeated
                    log = {
                        "url": ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                        "Конечный url (для 302)": ic.decode(Buffer.from('' + curURL, 'binary'), "win1251"),
                        "Title": ic.decode(Buffer.from('' + l1title, 'binary'), "win1251"),
                        "File": 'data'+(startIndex+index),
                        'Первая ссылка на этот раздел': repeatingLinks_,
                        "Уровень": "1. разделы"
                    }
                    require('fs').appendFileSync(`./${logsDir}/repeated.log`, JSON.stringify(log, null, 4));
                    // в лог
                }
                if(repeatingLinks_.linkFirstMention === undefined)
                    repeatingLinks_ = {
                        linkFirstMention: '',
                        titleFirstMention: '',
                        data: ``
                    }
                const results = {
                    'title': ic.decode(Buffer.from('' + antidate(l1title), 'binary'), "win1251"),
                    'link': ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                    'status': status,
                    'pageWithoutContents': antiImg(antiscript(pageWithoutContents),url),
                    'repeated': level2uniquefirstlink.has(level2links[0]),
                    'repeatingLinks': repeatingLinks_,
                    'folder': 'data'+(startIndex+parIndex),
                    // 'contents': cohesion - не удалять
                }
                /*     // в лог titleError
                    if (l1title === null || l1title === undefined || l1title == '' || l1title === "undefined") {
                        log = {
                           "url": ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                           "Конечный url (для 302)": ic.decode(Buffer.from('' + curURL, 'binary'), "win1251"),
                           "Title": ic.decode(Buffer.from('' + l1title, 'binary'), "win1251"),
                           "File": 'data'+(startIndex+index+i*size),
                           "Уровень": "1. разделы"
                       }
                       require('fs').appendFileSync(`./${logsDir}/titleError.log`, JSON.stringify(log, null, 4));
                    }
                    // в лог */

                // добавляем уникальную хуйню. has не трогать!
                if(level2links[0] && !level2uniquefirstlink.has(level2links[0])) {
                    level2uniquefirstlink.add(level2links[0]);
                    let lnk = level2links[0];
                    repeatingLinks[lnk] = {
                        linkFirstMention: ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                        titleFirstMention: ic.decode(Buffer.from('' + l1title, 'binary'), "win1251"),
                        data: `./dumps/data${index}.json`
                    }
                }
                if (cohesion.length > 0) results.contents = true
                else {
                    results.contents = false
                    /*                // в лог emptyContent
                                   log = {
                                       "Ошибка": "У раздела нет ссылок (статей)? видимо нет",
                                       "url": ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                                       "Конечный url (для 302)": ic.decode(Buffer.from('' + curURL, 'binary'), "win1251"),
                                       "Title": ic.decode(Buffer.from('' + level1titles[index+i*size], 'binary'), "win1251"),
                                       "File": 'data'+(startIndex+index+i*size),
                                       "Уровень": "1. разделы"
                                   }
                                   if (!isrepeatingRazd) require('fs').appendFileSync(`./${logsDir}/emptyContent.log`, JSON.stringify(log, null, 4));
                                   // в лог */
                }


                if (!require('fs').existsSync('./dumps/data'+(startIndex+parIndex))) {
                    require('fs').mkdirSync('./dumps/data'+(startIndex+parIndex));
                }

                require('fs').writeFileSync(`./dumps/data${+startIndex+parIndex}.json`, JSON.stringify(results, null, 4));

                cohesion.forEach((coh,i) => {
                    console.log(i);
                    require('fs').writeFileSync(`./dumps/data${+startIndex+parIndex}/data${+startIndex+parIndex}_${i}.json`, JSON.stringify(coh, null, 4));
                })
            }


        }
}

require('fs').readFile('./startindex.txt', 'utf8', function(err, contents) {
    startIndex = +contents
    console.log(startIndex)
    superindex = startIndex
    console.log("start = ",startIndex)

    require('fs').readFile('./supercounter.txt', 'utf8', function(err, contents) {

        supercounter = +contents

        require('fs').readFile('./startIndexRecursion.txt', 'utf8', function(err, contents) {
            startIndexRecursion = +contents;
            main();
        });
    });
});




let postpost = async function (lis, count, log) {
    return await new Promise(async(resolve, reject) => {
        if (count > 320) {
            resolve([])
            return
        }
        console.log('\x1b[34mcount = %s\x1b[0m', count)

        let returnList = []

        let level1links = []

        if(lis)
            for (const [index, li] of lis.entries()) {
                try {
                    if(li.attrs && li.attrs.class && li.attrs.class.indexOf('icon0') !== -1) {
                        returnList.push(li)
                    }
                    else {
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
                    }
                }
                catch(error) {
                    // в лог recursion
                    log = {
                        "url": ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                        "Конечный url (для 302)": ic.decode(Buffer.from('' + curURL, 'binary'), "win1251"),
                        "Title": ic.decode(Buffer.from('' + l1title, 'binary'), "win1251"),
                        "File": 'data'+(startIndex+index),
                        "Уровень": "1. разделы",
                        "Error": error
                    }
                    require('fs').appendFileSync(`./${logsDir}/recursionError.log`, JSON.stringify(log, null, 4));

                    continue
                }
            }

        let level1response;
        if(level1links)
            for (const [index, url] of level1links.entries()) {
                if(url.indexOf('https://its.1c.ru') === -1 || LINKS.has(url)) {
                    console.log('ПОВТОР ИЛИ НЕДОМЕН');
                    continue;
                }
                LINKS.add(url);
                console.log(count + ') ' + index + '/' + level1links.length, url);
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
                    // в лог recursion
                    log = {
                        "url": ic.decode(Buffer.from('' + url, 'binary'), "win1251"),
                        "Конечный url (для 302)": ic.decode(Buffer.from('' + curURL, 'binary'), "win1251"),
                        "Title": ic.decode(Buffer.from('' + l1title, 'binary'), "win1251"),
                        "File": 'data'+(startIndex+index),
                        "Уровень": "1. разделы",
                        "Error": error
                    }
                    require('fs').appendFileSync(`./${logsDir}/recursionError.log`, JSON.stringify(log, null, 4));

                    continue
                }
                let listlist = await postpost(new JSSoup(level1response.body).findAll('li').filter(li => {
                    if (li.attrs && li.attrs.class) {
                        return li.attrs.class.indexOf('folder') !== -1 || li.attrs.class.indexOf('icon0') !== -1
                    }
                    else {
                        return false
                    }
                }), count+1, log)
                if(listlist) returnList = [...returnList, ...listlist]
            }
        resolve(returnList);
    }).then((arr) => {
        return arr
    })
        .catch((err) => {
            return []
        });
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
    let re = /[(\r)(\n)(\t)]+/g;
    let newstr = body;//.replace(re, ' ');
    newstr = newstr.replace('<IMG', '<img');
    return newstr;
}

var antidate = function(title) {
    let re = /^\d\d\.\d\d\.\d\d\d\d( |. )/;
    let newstr = title.replace(re, '');
    return newstr;
}

var antiImg = (body, link) => {

    let lli = link + "/"
    if(lli.lastIndexOf("/") === lli.length - 1) lli = lli.slice(0, lli.length - 1)
    let indQ = lli.lastIndexOf("?")
    if(~indQ) lli = lli.slice(0, indQ)
    let indSl = lli.lastIndexOf("/")
    if(~indSl) lli = lli.slice(0, indSl+1)

    let path = lli.slice(ROOT_URL.length+1)

    if (path.search(/[а-яА-ЯёЁ]/i) === -1) {
        path = ic.decode(Buffer.from('' + path, 'binary'), "win1251")
    }

    // ./img/path/imgwithout..?

    const reres = /<img[^>]*>/gi
    const rere = /src[ ]*=[ ]*\"[^\"]*\"/i
    const rer = /\"[^\"]*\"/

    const t1 = body.match(reres);
    if(t1)
        for (const [index, img] of t1.entries()) {
            console.log(img)
            const src = img.match(rere)[0]
            let imgPath = src.match(rer)[0]
            if(imgPath.indexOf('mc.yandex.ru') !== -1) continue
            if (imgPath.search(/[а-яА-ЯёЁ]/i) === -1) {
                imgPath = ic.decode(Buffer.from('' + imgPath, 'binary'), "win1251")
            }
            imgPath = imgPath.slice(1, -1)
            if (imgPath.indexOf('/') === 0) imgPath.slice(1)
            if (imgPath.indexOf('./') === 0) imgPath.slice(2)
            let q = imgPath.lastIndexOf('?')
            if(~q) imgPath = imgPath.slice(0,q)

            let {imgPathhh, imgName} = createImgDirs("./img/"+path, src)

            const newPath = `src="http://media.4buttons.ru/img/${superindex}/${supercounter++}${imgName.slice(-4)}`
            if(!(supercounter%500)) require('fs').writeFileSync(`./supercounter.txt`, +supercounter);
            const normSrc = newPath;
           // const normSrc = `src="http://media.4buttons.ru/img/${path}${imgPath}"`;

            const newImg = img.replace(rere, normSrc);

            let t = -1;
            body = body.replace(reres, function (match) {
                t++;
                return (t === index) ? newImg : match;
            });
        };
    return body
}


function createImgDirs(start, path){
    let arr = ic.decode(Buffer.from(path, 'binary'), "win1251").split("/")
    let st = start
    let stOld = start;
    let imgName = 'file'
    let imgPath = ''
    arr.forEach((dir, index) => {
        if (index !== arr.length-1 && !require('fs').existsSync(st+dir)) {
            if (dir === '..' && dir !== '') {
                console.log('!!!!!!!!' +st + dir)
                require('fs').mkdirSync(st + dir)
            }
        }
        if (dir === '..') {
            st = stOld;
        }else {
            stOld = st;
            st = st+dir+'/'
        }
    })
    st = start
    stOld = start;
    arr.forEach((dir, index) => {
        if (index !== arr.length-1 && !require('fs').existsSync(st+dir)) {
            imgPath = imgPath+dir+'/';
        }
        else if (index === arr.length-1) {
            imgName = dir.split("?")[0];
        }
        else {
            imgPath = imgPath+dir+'/';
        }
        st = st+dir+'/'
    })
    return {imgPath, imgName};
}

// ну так уж и быть с др