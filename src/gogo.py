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
    print(srurl)
    response = requests.get(srurl)

    if response.status_code == 200:
        listType = "r"
        soup = BeautifulSoup(response.text, 'html.parser')
        ul = soup.find('ul', {"class": "items"})
        lis = ul.find_all('li')
        for li in lis:
            img_div = li.find('div', {"class": "img"})
            img = img_div.find('img')
            img_src = img['src']
            a_tag = img_div.find('a')
            a_href = a_tag['href']
            url = a_href.replace('/watch/', '', 1)
            title = li.find('p', {"class": "name"}).text
            episode = li.find('p', {"class": "episode"}).text
            eel.animeList(listType, title, episode, url, img_src,)
    else:
        showErr(response.status_code, "l")

def loadSearchList(keyword):
    reqUrl = main_url + "/search?keyword=" + str(keyword)
    response = requests.get(reqUrl)
    if response.status_code == 200:
        listType = "s"
        soup = BeautifulSoup(response.text, 'html.parser')
        ul = soup.find('ul', {"class": "items"}).find_all('li')
        for li in ul:
            img_div = li.find('div', {"class": "img"})
            img = img_div.find('img')
            img_src = img['src']
            a_tag = img_div.find('a')
            a_href = a_tag['href']
            url = a_href.replace('/category/', '', 1)
            title = li.find('p', {"class": "name"}).text
            eel.animeList2(listType, title, keyword, url, img_src)
        if not ul:
            eel.animeList2("f")
    else:
        showErr(response.status_code, "s")


@eel.expose
def loadAnime(srLink):
    link = srLink
    response = requests.get(main_url + 'watch/' + link)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        titlediv = soup.find('div', {"class": "title_name"})
        title = titlediv.find('h2').text
        iframe = soup.find('iframe')
        if srLink.find("dub") != -1:
            language = "dub"
        else:
            language = "sub"
        episode_number = re.search(r'episode-(\d+)', srLink, re.IGNORECASE).group(1)
        lagnUrl = link.split('-episode')[0]
        dub_str = lagnUrl.rfind('-dub')
        if dub_str != -1:
            des_link = lagnUrl.replace('-dub', '', 1)
        else:
            des_link = lagnUrl
        test_dub = des_link + '-dub-episode-' + episode_number
        response2 = requests.get(main_url + 'watch/' + test_dub)
        lang_code = response2.status_code
        eel.anime(title, str(iframe), language, episode_number, srLink, lang_code)
    else:
        if "-dub" in link:
            new_link = link.replace("-dub", "")
            loadAnime(new_link)
        else:
            showErr(response.status_code, "i")


def loadAnimeDes(link):
    if '-episode' in link:
        new_link = link.split('-episode')[0]
    else:
        new_link = link
    
    if '-dub' in new_link:
        des_link = new_link.replace('-dub', '')
        dub_link = new_link
    else:
        des_link = new_link
        dub_link = new_link + '-dub'
    response0 = requests.get(main_url + "category/" + dub_link)
    if response0.status_code == 200:
        soup1 = BeautifulSoup(response0.text, 'html.parser')
        d_episode = soup1.find('ul', {"id": "episode_page"}).find_all('li')
        if d_episode:
            d_episode_li = d_episode[-1]
            dub_episode = d_episode_li.find('a').text.split('-', 1)[-1]
        else:
            dub_episode = "0"
    else:
        dub_episode = "0"
    response1 = requests.get(main_url + "category/" + des_link)
    if response1.status_code == 200:
        response_link = des_link
    else:
        response_link = new_link
    response = requests.get(main_url + "category/" + response_link)
    if response.status_code == 200:
        soup2 = BeautifulSoup(response.text, 'html.parser')
        img_tag = soup2.find('div', {"class": "anime_info_body_bg"}).find('img')
        img_url = img_tag['src']
        p_title = soup2.find('div', {"class": "anime_info_body_bg"}).find('h1').text
        p_episode = soup2.find('ul', {"id": "episode_page"}).find_all('li')
        if p_episode:
            p_episode_li = p_episode[-1]
            all_episode = p_episode_li.find('a').text.split('-', 1)[-1]
        else:
            all_episode = "0"
        p_tags = soup2.find_all('p', {"class": "type"})
        p_tag = p_tags[1]
        a_tags2 = p_tags[2]
        a_tags = a_tags2.find_all('a')
        a_tag = str(a_tags).replace('[', '')
        p_gerne = a_tag.replace(']', '')
        p_des = p_tag.text.replace('Plot Summary: ', '', 1)
        p_type = p_tags[0].text
        ar_episode = int(all_episode)
        eel.animeDes(img_url, p_title, p_des, all_episode, p_type, p_gerne, ar_episode, des_link, dub_episode)
    else:
        showErr(response.status_code, "d")


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