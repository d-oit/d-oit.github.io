import os
import requests
import xml.etree.ElementTree as ET
from mistralai import Mistral
from dotenv import load_dotenv

# Fetch sitemap from URL
sitemap_url = "https://d-oit.github.io/en/sitemap.xml"
response = requests.get(sitemap_url)
root = ET.fromstring(response.content)

# Extract URLs from sitemap
urls = [url.text for url in root.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]

load_dotenv()

# Set up Mistral API
api_key = os.environ["MISTRAL_API_KEY"]
client = Mistral(api_key=api_key)

# Generate and save Playwright tests
for url in urls:
    prompt = f"Generate a production ready code to run it with Playwright test for all known use cases in JavaScript for the webpage at {url} .Only show me the code without any explanation, only the code. Thank you."
    response = client.chat.complete(model="mistral-large-latest", messages=[{"role": "user", "content": prompt}])
    test_code = response.choices[0].message.content
    
    test_code = test_code.replace("```javascript", "").replace("```", "")
    print("url: " + url)

    # Extract the last part of the URL as the filename
    urlName = url.replace("https://", "").replace('/', '_')
    # Create a sanitized filename from the URL
    filename = f"test_{urlName}.spec.js"
    
    with open(filename, 'w') as file:
        file.write(test_code)

print(f"Generated {len(urls)} test files.")