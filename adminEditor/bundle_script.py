import requests
import csscompressor
from jsmin import jsmin

# List of CDN URLs for CSS and JS files
css_urls = [
    'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.3/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.0/codemirror.min.css'
]

js_urls = [
    'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.3/js/bootstrap.bundle.min.js'
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.0/codemirror.min.js'
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.0/mode/markdown/markdown.min.js'
]

# Function to download and bundle files
def bundle_files(urls, output_file, minify=False):
    content = ''
    for url in urls:
        response = requests.get(url)
        if response.status_code == 200:
            content += response.text + '\n'
        else:
            print(f"Failed to download {url}")
    
    if minify:
        if output_file.endswith('.css'):
            content = csscompressor.compress(content)
        elif output_file.endswith('.js'):
            content = jsmin(content)
    
    with open(output_file, 'w') as bundle:
        bundle.write(content)

# Bundle and minify CSS and JS files
bundle_files(css_urls, 'bundle.css')
bundle_files(css_urls, 'bundle.min.css', minify=True)
bundle_files(js_urls, 'bundle.js')
bundle_files(js_urls, 'bundle.min.js', minify=True)

print("Bundling and minification complete!")
