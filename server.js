const tress = require('tress');
const request = require('request');
const ic = require('iconv-lite');
const JSSoup = require('jssoup').default;

// Взять из кукисов
const PHPSESSID = 'aih9pt1jggquphm0ohsbrvdf16'
const ROOT_URL = 'https://its.1c.ru';
const P = '7a31499e';
const U = '54389-40';

const main = async () => {
    // записываем в куки PHPSESSID
    const j = request.jar();
    const cookie = request.cookie(`PHPSESSID=${PHPSESSID}`);
    //const cookie = cookies;
    j.setCookie(cookie, ROOT_URL);
    
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
    const level1links = []
    // сюда будем класть названия разделов
    const level1titles = []
    let ii= 0;
    for (const li of liList) {
        let level1link = ""
        let a = li.find('a')
        if (a.attrs && a.attrs.href) {
            if  (a.attrs.href.indexOf('http') === -1) {
                if (a.attrs.href.indexOf('download') !== -1) continue
                level1link = ROOT_URL + a.attrs.href
            }
            else {
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
        level1titles.push(a.contents[0]._text)
        level1links.push(level1link)
    }
    console.log('# level1links.length =', level1links.length)
    console.log('# level1titles.length =', level1titles.length)

    for (const [index, url] of level1links.entries()) {
        const l1title = level1titles[index];
        try {
            level1response = await new Promise((resolve, reject) => {
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
                                `- Index ${index+1}/${level1links.length} fetched ${url} with ${response.statusCode}`)
                    
                    //const title = ic.decode(Buffer(body, 'binary'), "win1251");
                    resolve({
                        response, 
                        body: body,
                    })
                });
            });
        }
        catch(error) {
            console.log('\x1b[31m-- Эй ёпта! Чел, ERROR! %s\x1b[0m', error)
            continue
        }
        const soup2 = new JSSoup(level1response.body);
        // select нету в jssoup. Пробуем делать так, но я не уверен что это правильно...
        const listLevel2 = soup2.findAll('a').filter(obj => {
            if (obj.attrs && obj.attrs.class) {
                return obj.attrs.class.search(/[(icon1)(icon2)(icon3)(icon4)(icon5)]/i) !== -1
            }
            else {
                return false
            }
        })
        const pagesCounter = listLevel2.length
        console.log('# listLevel2.length =', pagesCounter)
        const cohesion = []
        const level2links = []
        const level2titles = []
        const level2codes = []

        for (const a of listLevel2) {
            if (a.attrs && a.attrs.href) {
                if (a.contents[0]) {
                    level2titles.push(a.contents[0]._text)
                    // так надо?
                } else {
                    level2titles.push(undefined)
                }
                if  (a.attrs.href.indexOf('http') === -1) {
                    if (a.attrs.href.indexOf('download') !== -1) continue
                    level2links.push(ROOT_URL + a.attrs.href);
                }
                else {
                    if (a.attrs.href.indexOf('download') !== -1) continue
                    level2links.push(a.attrs.href);
                }
                //console.log(level2links[level2links.length-1])
                //console.log(level2titles[level2titles.length-1])
            }
        }
        //console.log('level2titles.length =', level2titles.length)
        //console.log('level2links.length =', level2links.length)

        const level2responses = []

        for (const [index, url] of level2links.entries()) {
            try {
                const level2response = await new Promise((resolve, reject) => {
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
                        const title = ic.decode(Buffer(body, 'binary'), "win1251");
                        resolve({
                            response, 
                            body: title,
                            status: response.statusCode,
                        })
                    });
                });
                level2responses.push(level2response.body)
                level2codes.push(level2response.status)

                cohesion[index] = {};
                cohesion[index].title = ic.decode(Buffer('' + level2titles[index], 'binary'), "win1251") ;
                cohesion[index].link = level2links[index];
                cohesion[index].content = level2response.body;
                cohesion[index].status = level2response.status;
            }
            catch(error) {
                console.log('\x1b[31m-- Эй ёпта! Чел, ERROR! %s\x1b[0m', error)
                continue
            }
        }
        
        const results = {
            'title': ic.decode(Buffer('' + l1title, 'binary'), "win1251"),
            'link': url,
            'contents': cohesion
        }
        
        require('fs').writeFileSync(`./dumps/data${index}.json`, JSON.stringify(results, null, 4));
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
