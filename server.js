var tress = require('tress');
var request = require('request');

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var URL = 'https://its.1c.ru';
var results = [];
let urls = [
    //'/db/content/accnds/src/ндс%201с%202012%20исправление%20покупки%20слпериод%20вычетанет.htm?_=1542292886',
    '/db/content/marketingdoc/src/%D0%B2%D0%B2%D0%B5%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5.htm?_=1539857480',
    //'/db/accnds#content:1299:hdoc',
    //'/db/marketingdoc/content/4/hdoc?bus&1542293333=&event[name]=mode',
    //'/db/accnds#content:1050:hdoc',
    //'/db/content/accnds/src/ндс 1с 2012 организация учета бухгалтерский учет.htm?_=1542292886',
    //'/db/content/declprib/src/нп%201с%20отчетность%20декларация_3_2018_10.htm?',
    //'/db/declprib/content/15388/hdoc/',
]




urls.forEach( (val) => {
    
    var response = request.post(
        {
            url: URL+val, 
            multipart: [
                {
                  'content-type': 'application/json',
                  'body': {
                    "openid.auth.check":	true,
                    "openid.auth.pwd":	"7a31499e",
                    "openid.auth.short":	false,
                    "openid.auth.user":	"54389-40",
                    "openid.claimed_id":	"http://specs.openid.net/auth/2.0/identifier_select",
                    "openid.identity":	"http: //specs.openid.net/auth/2.0/identifier_select",
                    "openid.mode":	"checkid_immediate",
                    "openid.ns":	"http://specs.openid.net/auth/2.0",
                    "openid.realm":	"https://its.1c.ru/login/?action=afterlogin&provider=fresh",
                    "openid.return_to":	"https://its.1c.ru/login/?action=afterlogin&provider=fresh&backurl=%2Fsection%2Fall"
                    }
                },
              ],
            form: {
                data: {
                    "openid.auth.check":	true,
                    "openid.auth.pwd":	"7a31499e",
                    "openid.auth.short":	false,
                    "openid.auth.user":	"54389-40",
                    "openid.claimed_id":	"http://specs.openid.net/auth/2.0/identifier_select",
                    "openid.identity":	"http: //specs.openid.net/auth/2.0/identifier_select",
                    "openid.mode":	"checkid_immediate",
                    "openid.ns":	"http://specs.openid.net/auth/2.0",
                    "openid.realm":	"https://its.1c.ru/login/?action=afterlogin&provider=fresh",
                    "openid.return_to":	"https://its.1c.ru/login/?action=afterlogin&provider=fresh&backurl=%2Fsection%2Fall"
                },
                headers: {
                    "Content-Type": "application/json",
                    "cache-control": "no-cache",
                    "Postman-Token": "e6cca931-fa59-46c6-b42a-78472283e524"
                },
                cookie: {
                    'CSS_ITS':'1542292880',
                    'JS_ITS':'1542292880',
                    '_ga':'GA1.2.1863243792.1538765691',
                    '_ym_uid':'153876569224832603',
                     '_ym_d':'1538765692',
                     'CSS_CORE':'1542292880',
                     'CSS_MAIN':'1542292882',
                     'JS_MAIN':'1542292881',
                     'BITRIX_SM_LOGIN':'partweb',
                     'JS_CORE':'1542899501',
                     '_gid':'GA1.2.583497583.1543152961',
                     '_ym_isad':'2',
                     '_ym_visorc_38953945':'w',
                     '_ym_visorc_39255945':'w',
                     'SEARCH_GROUP':'law',
                     'SEARCH_NEW':'0',
                     'CLICKED_SEARCH':'9d3801b5d1a94b9addde3cae6a909f65_f6cdf7d5dfbcb432ca9182e70b82ada1',
                     'BUSERR_200':'BUS_ERROR',
                     'ITS_GRP':'0',
                     'PHPSESSID':'jt377dgk8i6q13sma4o3d8d444',
                     'PARTWEB_LOGIN':'54389-40',
                     'SUBSCRIBE_PERIOD':'31.12.2018',
                     'USER_TYPE':'%3A1%3A2%3A20%3A21%3A25%3A203%3A801%3A3000%3A'
                },
                crossDomain: true,
                    }
                } , function(err, response, body) {
                           // console.log(err) // 200
                            console.log(body) // 200
                            console.log(response.statusCode) // 200
                           // console.log(response.url) // 200
                           // console.log(response.history) // 200 
                           // console.log(response.text) // 200 response.text
                          });
});
    




var data = JSON.stringify({
    "openid.auth.check": true,
    "openid.auth.pwd": "7a31499e",
    "openid.auth.short": false,
    "openid.auth.user": "54389-40",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.identity": "http: //specs.openid.net/auth/2.0/identifier_select",
    "openid.mode": "checkid_immediate",
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.realm": "https://its.1c.ru/login/?action=afterlogin&provider=fresh",
    "openid.return_to": "https://its.1c.ru/login/?action=afterlogin&provider=fresh&backurl=%2Fsection%2Fall"
  });
  
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
     // console.log(this.responseText);
     // console.log(this.status);
    }
  });
  
  xhr.open("POST", "https://its.1c.ru/db/content/marketingdoc/src/%D0%B2%D0%B2%D0%B5%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5.htm?_=1539857480");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("cache-control", "no-cache");
  xhr.setRequestHeader("Postman-Token", "6f5ee5c9-1105-41b0-9b0b-1961105545b5");
  
  xhr.send(data);



