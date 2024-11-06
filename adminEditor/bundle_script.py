import requests
import csscompressor
from jsmin import jsmin

# List of CDN URLs for CSS and JS files
css_urls = [
    "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.3/css/bootstrap.css",
    "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.css",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.7/codemirror.css",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.7/addon/dialog/dialog.css"
]

js_urls = [
    "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.3/js/bootstrap.bundle.js",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.7/codemirror.js",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.7/mode/markdown/markdown.js",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.7/addon/search/search.js",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.7/addon/search/searchcursor.js",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.7/addon/search/jump-to-line.js",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.7/addon/dialog/dialog.js",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.7/addon/scroll/annotatescrollbar.js"
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
bundle_files(css_urls, 'static/css/bundle.css')
bundle_files(css_urls, 'static/css/bundle.min.css', minify=True)
bundle_files(js_urls, 'static/js/bundle.js')
bundle_files(js_urls, 'static/js/bundle.min.js', minify=True)

print("Bundling and minification complete!")
