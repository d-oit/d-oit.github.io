import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

def search_basketball_games(content):
    prompt = f'Search the following text for basketball games that are listed on the website of today: {content}'
    payload = {'model': 'mistral-small',
               'messages': [{'role': 'user', 'content': prompt}]}
    response = requests.post('https://api.mistral.ai/v1/chat/completions',
                             headers={'Authorization': f'Bearer {os.getenv("MISTRAL_API_KEY")}'},
                             json=payload)
    print(f'Response: {response.text}')
    response.raise_for_status()
    data = response.json()
    return data['choices'][0]['message']['content']

def generate_json(directory):
    file_list = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            with open(file_path, 'r') as f:                
                content = f.read()
            results = search_basketball_games(content)
            file_list.append({'path': file_path, 'results': results})

    with open('files.json', 'w') as f:
        json.dump(file_list, f)

generate_json('../public/en/blog')
