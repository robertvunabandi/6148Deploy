import requests
import json

app_id = '52c86221'
app_key = '5b10a7864c852347235ef808c96a2413'

language = 'en'
word_id = 'building'

url = 'https://od-api.oxforddictionaries.com:443/api/v1/entries/' + language + '/' + word_id.lower()

r = requests.get(url, headers = {'app_id': app_id, 'app_key': app_key})

print("code {}\n".format(r.status_code))
print("text \n" + r.text)
print("json \n" + json.dumps(r.json()))
