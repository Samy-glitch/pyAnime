import eel 
from bs4 import BeautifulSoup
import requests
import re
import json


with open('config.json', 'r') as f:
    config_data = json.load(f)

main_url = config_data['config']['url']

eel.init('web')

#main_url = 'https://gogoanime.run/'
#main_url = 'https://ww8.gogoanimes.org/'
#main_url = 'https://anitaku.io/'
#full_url =  'sousou-no-frieren-dub-episode-1'




def showErr(errCode, type):
    eel.showErr(errCode, type)


def loadAnimeList(srurl):
    response = requests.get(srurl)

    if response.status_code == 200:
        listType = "r"
        soup = BeautifulSoup(response.text, 'html.parser')
        all_list = soup.find('div', {"class": "excstf"})
        articles = all_list.find_all('article')
        for article in articles:
            img = article.find('img')
            img_src = img['src']
            a_tag = article.find('a')
            url = a_tag['href']
            id = url.replace(main_url, '')
            title_div = article.find('div', {"class": "tt"})
            title = title_div.find('h2').text
            episode = article.find('span', {"class": "epx"}).text
            type = article.find('div', {"class": "typez"}).text
            eel.animeList(listType, title, episode, id, img_src, type, url)
    else:
        showErr(response.status_code, "l")

def loadSearchList(keyword):
    reqUrl = main_url + "?s=" + str(keyword)
    response = requests.get(reqUrl)
    if response.status_code == 200:
        listType = "s"
        soup = BeautifulSoup(response.text, 'html.parser')
        all_list = soup.find('div', {"class": "listupd"})
        articles = all_list.find_all('article')
        for article in articles:
            img = article.find('img')
            img_src = img['src']
            title_div = article.find('div', {"class": "tt"})
            title = title_div.find('h2').text
            a_tag = article.find('a')
            url = a_tag['href']
            id = url.replace(main_url, '')
            type = article.find('div', {"class": "typez"}).text
            eel.animeList2(listType, title, keyword, id, img_src, type, url)
            
        if not articles:
            eel.animeList2("f")
    else:
        showErr(response.status_code, "s")


@eel.expose
def loadAnime(srLink):
    link = srLink
    response = requests.get(main_url +  link)
    

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        title = soup.find('h1', {"class": "entry-title"}).text
        iframe = soup.find('iframe')
        language = "sub"
        episode_number0 = soup.find('meta', {"itemprop": "episodeNumber"})
        episode_number = episode_number0['content']
        lang_code = 404
        eel.anime(title, str(iframe), language, episode_number, srLink, lang_code)
    else:
        showErr(response.status_code, "i")


def loadAnimeDes(link):
    response0 = requests.get(main_url + link)
    dub_episode = 0
    if response0.status_code == 200:
        soup0 = BeautifulSoup(response0.text, 'html.parser')
        url_div = soup0.find('div', {"class": "ts-breadcrumb"}).find_all('a')
        url = url_div[1]['href']
        response = requests.get(url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            img_tag = soup.find('div', {"class": "thumb"}).find('img')
            img_url = img_tag['src']
            p_title = soup.find('div', {"class": "infox"}).find('h1').text
            all_episode0 = soup.find('div', {"class": "eplister"}).find_all('li')
            all_episode1 = all_episode0[0]
            all_episode = all_episode1.find('div', {"class": "epl-num"}).text
            p_tags = soup.find('div', {"class": "genxed"})
            a_tags = p_tags.find_all('a')
            a_tag = str(a_tags).replace('[', '')
            p_gerne = a_tag.replace(']', '')
            p_des = soup.find('div', {"class": "entry-content"}).text
            info_div0 =  soup.find('div', {"class": "info-content"}).find('div', {"class": "spe"}).find_all('span')
            info_div = info_div0[4].text
            #ar_episode = int(all_episode)
            ar_episode = 0
            eel.animeDes(img_url, p_title, p_des, all_episode, info_div, p_gerne, ar_episode, link, dub_episode)
        else:
            showErr(response.status_code, "d2")
    else:
        showErr(response0.status_code, "d1")


@eel.expose
def changeLng(url):
    loadAnime(url)

""" @eel.expose
def openEpisode(num):
    new_url_raw = full_url.split('-episode')[0] + '-episode-'
    new_url = new_url_raw + str(num)
    loadAnime(new_url) """


@eel.expose
def EopenAnime(url):
    loadAnimeDes(url)
    loadAnime(url)

@eel.expose
def EopenHome():
    loadAnimeList(main_url)

@eel.expose
def EopenSearch(value):
    loadSearchList(value)

eel.start('index.html')

#https://aniwave.to/watch/merchant-meets-the-wise-wolf.ojov8/ep-12