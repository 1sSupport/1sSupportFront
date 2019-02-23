const tress = require('tress');
const request = require('request');
const ic = require('iconv-lite');
const JSSoup = require('jssoup').default;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// Взять из кукисов
const PHPSESSID = '2hdg9f04g7bntvn4aacfu2fmc7'
const ROOT_URL = 'https://its.1c.ru';
const P = '7a31499e';
const U = '54389-40';
let log = {};

let status_img = "norma";

const startIndex = 0; // Откудава стартовать будем?
const logsDir = "new_logs"; // Папка для логов

console.log("start = ",startIndex)
console.log("logDir = ",logsDir)


const j = request.jar();
// записываем в куки PHPSESSID
const cookie = request.cookie(`PHPSESSID=${PHPSESSID}`);
//const cookie = cookies;
j.setCookie(cookie, ROOT_URL);

const LINKS = new Set();
var superindex = startIndex;
var supercounter = 0;


const main = async () => {

    require('fs').writeFileSync(`./${logsDir}/img.log`, '');

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

    let level2uniquefirstlink = new Set();

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
        superindex = index + startIndex;
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
                }
            }
            catch(error) {
                console.log('\x1b[31m-- Эй ёпта! Чел, ERROR! %s\x1b[0m', error)
                continue
            }
        }
        const soup2 = new JSSoup(level1response.body);
        status = level1response.status;
        console.log(`[${startIndex+index+1}]`);
        parseImg(soup2, curURL)

        // Заглушка для левых ссылок. Нужно посмотреть что там на самом деле будет.
        if(curURL.indexOf('https://its.1c.ru') === -1) {
            status_img = "Это не https://its.1c.ru"
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
            listLevel2 = await postpost(lislis, 0, log);
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
            status_img = "картинка в корне (1 уровень разделов)"
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
                status_img = "КОПИЯ (2 уровень статей)"
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

                // Заглушка для левых ссылок. Нужно посмотреть что там на самом деле будет.
                if(url.indexOf('https://its.1c.ru') === -1) {
                    status_img = "Это не https://its.1c.ru"
                }
                level2responses.push(level2response.body)
                level2codes.push(sta)

                cohesion[index] = {};
                cohesion[index].title = ic.decode(Buffer('' + level2titles[index], 'binary'), "win1251") ;
                cohesion[index].link = ic.decode(Buffer('' + level2links[index], 'binary'), "win1251");
                cohesion[index].content = ic.decode(Buffer('' + antiscript(level2response.body), 'binary'), "win1251");
                cohesion[index].versions = [];
                cohesion[index].status = level2response.status;
            }
            catch(error) {
                console.log('\x1b[31m-- Эй ёпта! Чел, ERROR! %s\x1b[0m', error)
                continue
            }

            // третий уровень для мужыков
            const soup3 = new JSSoup(level2response.body);
            const liList3 = soup3.findAll('li')
            console.log(`[${startIndex+parIndex+1}]`);
            parseImg(soup3, url)
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

                    // Заглушка для левых ссылок. Нужно посмотреть что там на самом деле будет.
                    if(url.indexOf('https://its.1c.ru') === -1) {
                        status_img = "Это не https://its.1c.ru"
                        continue
                    }
                    level3responses.push(level3response.body)
                    level3codes.push(sta)

                    cohesion[index].versions.push({
                        title: ic.decode(Buffer('' + level3titles[ind], 'binary'), "win1251"),
                        link: ic.decode(Buffer('' + level3links[ind], 'binary'), "win1251"),
                        content: antiscript(level3response.body),
                        status: level3response.status,
                    })
                }
                catch(error) {
                    console.log('\x1b[31m--- Эй ёпта! Чел, ERROR! %s\x1b[0m', error)
                }
                console.log(`[${startIndex+parIndex+1}]`);
                parseImg(new JSSoup(level3response.body), url)
            }
        }

        let repeatingLinks_ = {}
        if(level2links[0] && level2uniquefirstlink.has(level2links[0])) {
            repeatingLinks_ = repeatingLinks[level2links[0]]
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




/*
            if (cohesion.length > 0) results.contents = "СМОТРИ ДОЧЕРНИЕ ФАЙЛЫ!"
            else {
                results.contents = "ПУСТО"
            }
            require('fs').writeFileSync(`./dumps/data${startIndex+index}.json`, JSON.stringify(results, null, 4));

            let i = 0;
            for(; i < level2links.length/300 - 1; i++) {
                let removed = cohesion.splice(0, 300);
                require('fs').appendFileSync(`./dumps/data${startIndex+index}_${i}.json`, JSON.stringify(removed, null, 4));
            }
            if (cohesion.length > 0) require('fs').appendFileSync(`./dumps/data${startIndex+index}_${i}.json`, JSON.stringify(cohesion, null, 4));
             */

    }
}

    main();



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
                        "url": ic.decode(Buffer('' + url, 'binary'), "win1251"),
                        "Конечный url (для 302)": ic.decode(Buffer('' + curURL, 'binary'), "win1251"),
                        "Title": ic.decode(Buffer('' + l1title, 'binary'), "win1251"),
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
                        "url": ic.decode(Buffer('' + url, 'binary'), "win1251"),
                        "Конечный url (для 302)": ic.decode(Buffer('' + curURL, 'binary'), "win1251"),
                        "Title": ic.decode(Buffer('' + l1title, 'binary'), "win1251"),
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
    return bd;
}

var antinrt = function(body) {
    let re = /(\r)|(\n)|(\t)/g;
    let newstr = body.replace(re, '');
    return newstr;
}
function createDirs(start, path){
    let arr = ic.decode(Buffer(path, 'binary'), "win1251").split("/")
    let st = start;
    let stOld = start;
    arr.forEach((dir) => {
        if (dir !== '..' && dir !== '' && !require('fs').existsSync(st+dir)) {
            require('fs').mkdirSync(st+dir);
        }
        if (dir === '..') {
            st = stOld;
        }else {
            stOld = st;
            st = st+dir+'/'
        }
    })
}

function createImgDirs(start, path){
    let arr = ic.decode(Buffer(path, 'binary'), "win1251").split("/")
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
var setllimg = new Set();
var indexold = startIndex;
var parseImg = async (soup, link) => {
    if(indexold !== superindex) {
        indexold = superindex;
        setllimg.clear();
    }
    let img_src2 = []
    let img_src1 = []
    let img_src2_ = soup.findAll('IMG')
    let img_src1_ = soup.findAll('img')
    if(img_src2_[0]) img_src2 = img_src2_.map(img => img.attrs.src)
    if(img_src1_[0]) img_src1 = img_src1_.map(img => img.attrs.src)
    let img_src = [...img_src1, ...img_src2]
    let lli = link + "/"
    if(lli.lastIndexOf("/") === lli.length - 1) lli = lli.slice(0, lli.length - 1)
    let indQ = lli.lastIndexOf("?")
    if(~indQ) lli = lli.slice(0, indQ)
    let indSl = lli.lastIndexOf("/")
    if(~indSl) lli = lli.slice(0, indSl+1)

    let path = lli.slice(ROOT_URL.length+1)
    
    if (!require('fs').existsSync(`./img/${superindex}`)) {
        require('fs').mkdirSync(`./img/${superindex}`);
    }
    //createDirs("./img/", path)
    for (const [index, src] of img_src.entries()) {
        //if(~src.indexOf("mc.yandex")) continue;
        //if(~src.indexOf("http")) continue;
        //if(~src.indexOf(";")) continue;
        //if(~path.indexOf("http")) continue;
        //path = ic.decode(Buffer('' + path, 'binary'), "win1251");
        let {imgPath, imgName} = createImgDirs("./img/"+path, src)
        let llimg = lli+src
        console.log(llimg)
        try {
            level1responseimg = await new Promise( (resolve, reject) => {
                 request.post(
                {
                    url: llimg,
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
                    console.log(`./img/${path}${imgName}`)
                        if(~imgName.indexOf("."))
                            console.error(imgName.lastIndexOf('.'))
                        if(!setllimg.has(llimg)) {
                            setllimg.add(llimg);
                            console.log("!!!!!!!!!!")/*
                            if (!(~((imgName.slice(-4)).indexOf(".")))) {
                                console.log("!!!!!!!!!!")
                                console.log("!!!!!!!!!!")
                                console.log("!!!!!!!!!!")
                                console.log("!!!!!!!!!!")
                                console.log("!!!!!!!!!!")
                                console.warn(`./img/${superindex}/${supercounter++}${imgName.slice(-4)}`)
                                console.warn(imgName)
                                console.log("!!!!!!!!!!")
                                console.log("!!!!!!!!!!")
                                console.log("!!!!!!!!!!")
                                console.log("!!!!!!!!!!")
                                console.log("!!!!!!!!!!")
                                return;
                            }*/
                            if(response.statusCode === 200 && ~((imgName.slice(-4)).indexOf(".")))
                                request(llimg).pipe(require('fs').createWriteStream(`./img/${superindex}/${supercounter++}${imgName.slice(-4)}`))
                        }
                            //request(llimg).pipe(require('fs').createWriteStream(`./img/${ic.decode(Buffer('' + path, 'binary'), "win1251")}${imgPath}${imgName}`))
                    //выводим в консоль инфу со статусом
                    const title = ic.decode(Buffer(body, 'binary'), "win1251");
                    resolve({
                        response,
                        body: title,
                        status: response.statusCode,
                    })
                });
            });
        }
        catch(error) {
            console.log('\x1b[31m-- ОШБИКА КАРТИНКИ! %s\x1b[0m', error)
        }

    }
}
// ну так уж и быть с др