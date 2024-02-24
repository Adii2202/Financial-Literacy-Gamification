import json
import requests
import time
import sys

def upload_video(video_url, access_token,ig_user_id, caption):
    post_url="https://graph.facebook.com/v19.0/{}/media".format(ig_user_id)
    payload={
        'media_type':'REELS',
        'video_url':video_url,
        'caption':caption,
        'access_token':access_token
    }
    r=requests.post(post_url,data=payload)
    print(r.text)
    results=json.loads(r.text)
    return(results)

def status_code(ig_container_id,access_token):
    graph_url='https://graph.facebook.com/v19.0/'
    url=graph_url+ig_container_id
    param={}
    param['access_token']=access_token
    param['fields']='status_code'
    response=requests.get(url, params=param)
    response=response.json()
    return(response['status_code'])

def publish_video(results,access_token):
    if 'id' in results:
        creation_id=results['id']
        second_url='https://graph.facebook.com/v19.0/{}/media_publish'.format(ig_user_id)
        second_payload={
            'creation_id':creation_id,
            'access_token':access_token
        }
        r=requests.post(second_url,data=second_payload)
        print(r.text)
        print('video published')

    else:
        print('video nahi ho paaya')

ig_user_id="17841464523148006"
access_token='EAANSdVUHItgBO1LUF9bRNcx7kuR70MGEJcztIgE7DPIHZB9mYXMAdPhfWZA7gcRjz8HZCGsPu5jQQrFmzu2BbxA6DDyy58f9vDe8j9at8HojSt3aXEcUhLIMNaQRfz6AOCMIDW7IKkpe81UrqPlPgNbUsafg4PzlJ6dcCwUMQWOOUNJheLkTZCvaWRZCPldN7'
# video_url="https://media.publit.io/file/sample-5s-X.mp4"
video_url=sys.argv[1]
caption=sys.argv[2]

results=upload_video(video_url, access_token, ig_user_id, caption)
print('wait man')
time.sleep(10)

ig_container_id= results['id']
s = status_code(ig_container_id, access_token)

if s=='FINISHED':
    print('uploaded successfully')
    publish_video(results,access_token)
else:
    time.sleep(60)
    publish_video(results,access_token)