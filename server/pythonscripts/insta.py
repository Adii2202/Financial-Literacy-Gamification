import json
import requests

def publish_image():

    access_token="EAANSdVUHItgBO1un5w3SmaYYh3fkUg2d12cWjR1ZAgvjj7Sw17i8lfIDH6ZAUZCPox6fpSEk6Je1BylnETO5agA5LhOW3riI39OQ1byWTqPKwOLEJVJYZARgA8xyXw8LKQYfmMonX2hZBRq2wbzvAkVJREJjaUZAMjhqVyldty0wJFvqZBRE63z1wgTWXKLAmQR"
    ig_user_id="17841464523148006"
    image_url="https://www.peepso.com/wp-content/uploads/2015/10/code.jpg"

    post_url='https://graph.facebook.com/v19.0/{}/media'.format(ig_user_id)

    payload={
        'image_url':image_url,
        'caption':"Posting",
        'access_token': access_token
    }

    r=requests.post(post_url, data=payload)
    print(r.text)
    print("Media uploaded")

    results=json.loads(r.text)

    if 'id' in results:
        creation_id=results['id']
        second_url='https://graph.facebook.com/v19.0/{}/media_publish'.format(ig_user_id)
        second_payload={
            'creation_id':creation_id,
            'access_token':access_token,
        }
        r=requests.post(second_url, data=second_payload)
        print(r.text)
        print("image published")
    else:
        print("humse naa ho paaye")

publish_image()