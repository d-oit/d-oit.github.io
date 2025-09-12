---
description: Bundle frontend assets using Python script with optimization options
agent: development
---

# Bundle Assets Command

Execute Python bundling script to optimize and bundle frontend assets including CSS, JavaScript, and media files with configurable compression and minification options.

**Usage:**
/bundle-assets [--optimize] [--minify] [--compress] [--output DIR] [--source DIR]

**Options:**
- `--optimize`: Enable advanced optimization techniques (default: false)
- `--minify`: Minify CSS and JavaScript files (default: false)
- `--compress`: Compress assets using gzip/brotli (default: false)
- `--output`: Output directory for bundled assets (default: static/bundled)
- `--source`: Source directory for assets to bundle (default: static)

**Examples:**
- `/bundle-assets` - Bundle assets with default settings
- `/bundle-assets --minify` - Bundle and minify CSS/JS files
- `/bundle-assets --optimize --compress` - Full optimization with compression
- `/bundle-assets --source assets --output dist` - Custom source and output directories
- `/bundle-assets --minify --compress --output static/optimized` - Minify, compress, and custom output

**Implementation:**
!python bundle_script.py --optimize=$OPTIMIZE --minify=$MINIFY --compress=$COMPRESS --output=$OUTPUT --source=$SOURCE

**Files:**
@bundle_script.py
@static/css/
@static/js/
@static/media-data/
@assets/scss/
@assets/js/

**Notes:**
- This command processes frontend assets for production deployment
- Optimization options can significantly reduce bundle size
- Ensure bundle_script.py is properly configured for your asset structure
- Run this command after making changes to static assets
- Output directory will be created if it doesn't exist