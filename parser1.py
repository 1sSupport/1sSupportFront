import requests
from bs4 import BeautifulSoup
from time import sleep
from random import randint
import json
baseUrl = 'https://its.1c.ru'


mainSession = requests.Session()
try:
    response = mainSession.post('https://1cfresh.com/a/openid/e1cib/oid2op?cmd=auth', 
        data = {
            'openid.auth.check':	'true',
            'openid.auth.pwd':	'8e6dab32',
            'openid.auth.short':	'false',
            'openid.auth.user':	'54389-40',
            'openid.claimed_id':	'http://specs.openid.net/auth/2.0/identifier_select',
            'openid.identity':	'http://specs.openid.net/auth/2.0/identifier_select',
            'openid.mode':	'checkid_immediate',
            'openid.ns':	'http://specs.openid.net/auth/2.0',
            'openid.realm':	'https://its.1c.ru/login/?action=afterlogin&provider=fresh',
            'openid.return_to':	'https://its.1c.ru/login/?action=afterlogin&provider=fresh&backurl=%2Fsection%2Fall'
        },
        cookies = {'BITRIX_SM_LOGIN': 'partweb',
                'PHPSESSID': 'nj8a6hvnsupamoc1jkaohbotb6',
                'SUBSCRIBE_PERIOD': '31.12.2018',
                'USER_TYPE': ':1:2:20:21:25:203:801:',
                'PARTWEB_LOGIN': '54389-40',
                # 'JS_CORE': '1536848749',
                # 'JS_MAIN': '1536226942',
                # 'CSS_CORE': '1537956424',
                # 'CSS_MAIN': '1536158849'
                })
except requests.ConnectionError as e:
    print("Connection Error. \n")
    print(str(e))            
    for resp in response.history:
        print(response.status_code, response.url)
        continue

soup = BeautifulSoup(response.text)

def sectionAllUrl(tag):
    if 'id' in tag.attrs:
        if tag['id'] is not None:
            if ('section_all_url' not in tag['id']):
                return False
            else:
                return True
    else:
        return False

def findLevel2Elements(tag):
    if (tag.name == 'a'):
        return True
    else:
        return False

def writeCohesionToJson(l1title, l1link, cohesion, index):
    dummy = {
                'title': l1title,
                'link': l1link,
                'contents': cohesion
            }
    with open('./dumps/dump' + str(index) + '.txt', 'w', encoding='utf-8') as dump:
       json.dump(dummy, dump, ensure_ascii=False)

liList = soup.find_all(sectionAllUrl)
level1links = []
level1titles = []
for li in liList:
    pagesCounter = 0
    fetchedPagesCounter = 0
    level1link = ""
    a = li.find('a')
    if 'href' in a.attrs:
        if('http' not in a['href']):
            level1link = baseUrl + a['href']
        else:
            if ('download' in a['href']) | (('1c' not in a['href']) & ('v8' not in a['href'])):
                continue
            if (a['href'] == 'https://its.1c.ru/db/pubunfreal'):
                break
            level1link = a['href']
    level1title = a.contents[0]
    level1titles.append(level1title)
    level1links.append(level1link)

for index, level1link in enumerate(level1links):
    try:
        response = mainSession.get(level1link)
    except requests.exceptions.RequestException as error:
        print("Connection Error. \n")
        continue
    sleep(randint(3, 5)/10)
    print("Index " + str(index + 1) + "/" + str(len(level1links)) + " fetched " + level1link + " with " + str(response.status_code))

    soup2 = BeautifulSoup(response.text)

    listLevel2 = soup2.select('.icon1,.icon2,.icon3,.icon4,.icon5')

    level2links = []
    level2titles = []
    print(len(listLevel2))
    pagesCounter = len(listLevel2) # how many pages need to be fetched
    fetchedPagesCounter = 0
    for a in listLevel2:
        if 'href' in a.attrs:
            level2titles.append(a.contents[0])
            if('http' not in a['href']):
                level2links.append(baseUrl + a['href'])
            else:
                if('download' in a['href']): # | ('1c' not in a['href']) | ('v8' not in a['href']
                    continue
                level2links.append(a['href'])
    cohesion = {'titles': level2titles, 'links': level2links}

    level2responses = []
    for level2link in cohesion['links']:
        try: 
            level2response = mainSession.get(level2link)
        except requests.exceptions.RequestException as error:
            print("Connection Error. \n")
            continue
        sleep(randint(1, 4)/10)
        fetchedPagesCounter += 1
        print("Content " + str(fetchedPagesCounter) + "/" + str(pagesCounter) + " fetched " + level2link + " with " + str(response.status_code))
        level2responses.append(level2response.text)
        with open("log1.txt", 'w', encoding='utf-8') as log:
            json.dump(level2response.text, log, ensure_ascii=False)
    cohesion['responses'] = level2responses

    try:
        writeCohesionToJson(level1titles[index], level1link, cohesion, index)
    except TypeError as error:
        print(error)
        continue

# SCHEMA
# {
#     'title': string,
#     'link': string,
#     'contents': {
#         'titles': string[],
#         'links': string[],
#         'responses': string[]
#         }
# }