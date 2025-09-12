import requests
import csscompressor
from rjsmin import jsmin
import os

# Define vendor directories
vendor_css_dir = 'static/vendor/css'
vendor_js_dir = 'static/vendor/js'

# Ensure vendor directories exist
os.makedirs(vendor_css_dir, exist_ok=True)
os.makedirs(vendor_js_dir, exist_ok=True)

# List of CDN URLs for CSS and JS files for index.html
cdn_index_css_urls = [
    "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.3/css/bootstrap.css",
    "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.css",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.7/codemirror.css",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.7/addon/dialog/dialog.css"
]

cdn_index_js_urls = [
    "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.3/js/bootstrap.bundle.js",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.7/codemirror.js",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.7/mode/markdown/markdown.js",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.7/addon/search/search.js",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.7/addon/search/searchcursor.js",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.7/addon/search/jump-to-line.js",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.7/addon/dialog/dialog.js",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.7/addon/scroll/annotatescrollbar.js"
]

# List of CDN URLs for CSS and JS files for manage-media.html
cdn_manage_media_css_urls = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
    "https://uicdn.toast.com/tui-color-picker/latest/tui-color-picker.css",
    "https://uicdn.toast.com/tui-image-editor/latest/tui-image-editor.css"
]

cdn_manage_media_js_urls = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.js",
    "https://uicdn.toast.com/tui-color-picker/latest/tui-color-picker.js",
    "https://uicdn.toast.com/tui.code-snippet/latest/tui-code-snippet.min.js",
    "https://uicdn.toast.com/tui-image-editor/latest/tui-image-editor.js"
]


# Function to download a file from a URL and save it locally
def download_file(url, local_path):
    print(f"Downloading {url} to {local_path}")
    response = requests.get(url)
    if response.status_code == 200:
        with open(local_path, 'w', encoding='utf-8') as f:
            f.write(response.text)
        print(f"Successfully downloaded {url}")
        return True
    else:
        print(f"Failed to download {url}. Status code: {response.status_code}")
        return False

# Function to bundle files (now takes local paths)
def bundle_files(file_paths, output_file, minify=False):
    content = ''
    for path in file_paths:
        try:
            with open(path, 'r', encoding='utf-8') as f:
                content += f.read() + '\n'
        except FileNotFoundError:
            print(f"Warning: File not found: {path}, skipping...")
    
    if minify:
        if output_file.endswith('.css'):
            content = csscompressor.compress(content)
        elif output_file.endswith('.js'):
            content = jsmin(content)
    
    with open(output_file, 'w', encoding='utf-8') as bundle:
        bundle.write(content)

# Download all CDN assets to local vendor directories
all_cdn_css_urls = cdn_index_css_urls + cdn_manage_media_css_urls
all_cdn_js_urls = cdn_index_js_urls + cdn_manage_media_js_urls

local_css_paths = []
for url in all_cdn_css_urls:
    filename = os.path.basename(url).split('?')[0]
    local_path = os.path.join(vendor_css_dir, filename)
    if download_file(url, local_path):
        local_css_paths.append(local_path)

local_js_paths = []
for url in all_cdn_js_urls:
    filename = os.path.basename(url).split('?')[0]
    local_path = os.path.join(vendor_js_dir, filename)
    if download_file(url, local_path):
        local_js_paths.append(local_path)

# Bundle and minify CSS and JS files from local paths
bundle_files(local_css_paths, 'static/css/bundle.css')
bundle_files(local_css_paths, 'static/css/bundle.min.css', minify=True)
bundle_files(local_js_paths, 'static/js/bundle.js')
bundle_files(local_js_paths, 'static/js/bundle.min.js', minify=True)

print("Vendoring, Bundling and minification complete!")
