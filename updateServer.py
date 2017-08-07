# author: Varun Rajiv Mantri
# Update -Server: This server communicates with the online API and makes REST calls to fetch JSON content.
# After cheking that the links in the received content are live, it stores the data locall by communicating with Mongo Server
from pymongo import MongoClient
from pprint import pprint
import requests
import httplib2


def main():
    #connecting to the mongoDB server
    client=MongoClient(port=27017)
    h=httplib2.Http()
    #Creating/Acquiring database object

    db=client.newsData
    # dropping the earlier data from db
    print("removing old content.....")
    db.verifiedURL.drop()
    print("Updating new feeds.....")
    
    

    queryList = {
        'Economics':['the-wall-street-journal', 'the-economist', 'financial-times','fortune'],
        'Sports':['the-sport-bible','talksport','bbc-sport','fox-sports','espn-cric-info'],
        'Entertainment':['new-york-magzine','mtv-news','metro','entertainment-weekly'],
        'Technology':['techradar','techcrunch','news-scientist','hacker-news'],
        'General':['national-geographic','times','usa-today','the-times-of-india','the-guardia-uk','bbc-news','focus','al-jazeera-english']
    }
    keys=queryList.keys()
    #verified dictionary holds the verified urls
    verifiedDict={}
    for key in keys:
        temp=queryList[key]
        good_url=[]
        for item in temp:
            data=requests.get("https://newsapi.org/v1/articles?source="+item+"&sortBy=top&apiKey=00000000000000")
            data=data.json()
            if data["status"]!='error':
                for component in data["articles"]:
                    try:
                        resp,content=h.request(component["url"])
                        if resp.status == 200:
                            good_url.append({'title':component["title"],'description':component["description"],'url':component["url"],'urlToImage':component["urlToImage"]})
                    except:
                        print("Invalid responce detected.....source ignored")
        print("Completed source:"+str(key))
        verifiedDict[key]=good_url
    print("inserting records")
    #inserting into database
    keys=verifiedDict.keys()
    for key in keys:
        db.verifiedURL.insert_one({'_id':key,'data':verifiedDict[key]})
    print('update completed.....')
# Calling the main function
main()
