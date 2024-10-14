import requests
import csscompressor
from jsmin import jsmin

# List of CDN URLs for CSS and JS files
css_urls = [
    "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.3/css/bootstrap.css",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.css",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.0/codemirror.css"
]

js_urls = [
    "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.3/js/bootstrap.bundle.js",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.0/codemirror.js",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.0/mode/markdown/markdown.js"
]

# Function to download and bundle files
def bundle_files(urls, output_file, minify=False):
    content = ''
    for url in urls:
        response = requests.get(url)
        if response.status_code == 200:
            content += response.text + '\n'
        else:
            print(f"Failed to download {url}"+ '\n')
    
    if minify:
        if output_file.endswith('.css'):
            content = csscompressor.compress(content)
        elif output_file.endswith('.js'):
            content = jsmin(content)
    
    with open(output_file, 'w', encoding='utf-8') as bundle:
        bundle.write(content)

# Bundle and minify CSS and JS files
bundle_files(css_urls, 'static/bundle.css')
bundle_files(css_urls, 'static/bundle.min.css', minify=True)
bundle_files(js_urls, 'static/bundle.js')
bundle_files(js_urls, 'static/bundle.min.js', minify=True)

print("Bundling and minification complete!")
