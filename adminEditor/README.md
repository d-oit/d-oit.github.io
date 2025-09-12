# adminEditor

This directory contains the `adminEditor` feature for the d-oit.github.io project. It includes a Go backend for content management and frontend assets for the editor interface.

## Development Setup

To set up the development environment, follow these steps:

### 1. Install Python Dependencies

The frontend assets are bundled and minified using a Python script. Ensure you have Python 3 installed.

Navigate to the `adminEditor` directory and install the required Python packages:

```bash
cd adminEditor
pip install -r requirements.txt
```

### 2. Build and Run the Project

A `Makefile` is provided to orchestrate the build process, which includes vendoring frontend assets, bundling them, and building the Go application.

#### Build All

To build the entire project (install Python dependencies, vendor/bundle frontend assets, and build the Go application):

```bash
cd adminEditor
make all
```

#### Clean Build Artifacts

To clean up generated build artifacts:

```bash
cd adminEditor
make clean
```

#### Run the Application

After building, you can run the Go application:

```bash
cd adminEditor
make run
```

This will start the `adminEditor` backend.

### 3. Frontend Asset Management

Frontend assets (Bootstrap, CodeMirror, TOAST UI, Fabric.js, etc.) are vendored locally into `adminEditor/static/vendor/` directories by the `bundle_script.py` script, which is executed as part of the `make frontend` target. This ensures offline development capabilities and consistent asset versions.

The `bundle_script.py` downloads the necessary CSS and JS files from their respective CDNs and places them into `adminEditor/static/vendor/css` and `adminEditor/static/vendor/js`. It then bundles and minifies these local files into `adminEditor/static/css/bundle.css`, `adminEditor/static/css/bundle.min.css`, `adminEditor/static/js/bundle.js`, and `adminEditor/static/js/bundle.min.js`.

### 4. Go Build

The Go application is built using the `make build-go` target, which compiles the Go source code and places the executable in the `adminEditor/bin/` directory.

## Project Structure

*   `adminEditor/`: Root directory for the adminEditor feature.
    *   `bundle_script.py`: Python script for vendoring and bundling frontend assets.
    *   `requirements.txt`: Pinned Python dependencies.
    *   `Makefile`: Cross-platform build script.
    *   `static/`: Contains static frontend assets, including vendored libraries.
        *   `static/vendor/css/`: Vendored CSS files.
        *   `static/vendor/js/`: Vendored JavaScript files.
    *   `main.go`: Main Go application entry point.
    *   ... (other Go source files)
