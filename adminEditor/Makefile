.PHONY: all clean deps frontend build-go run

# Define variables
PYTHON = python
PIP = pip
GO = go
APP_NAME = adminEditor
BUILD_DIR = ./bin
BUNDLE_SCRIPT = bundle_script.py
REQUIREMENTS_FILE = requirements.txt

all: deps frontend build-go

clean:
	@echo "Cleaning up build artifacts..."
	$(GO) clean ./...
	rm -rf $(BUILD_DIR)
	rm -rf static/vendor

deps:
	@echo "Installing Python dependencies..."
	$(PIP) install -r $(REQUIREMENTS_FILE)

frontend: deps
	@echo "Bundling and vendoring frontend assets..."
	$(PYTHON) $(BUNDLE_SCRIPT)

build-go:
	@echo "Building Go application..."
	mkdir -p $(BUILD_DIR)
	$(GO) build -o $(BUILD_DIR)/$(APP_NAME) .

run: build-go
	@echo "Running Go application..."
	$(BUILD_DIR)/$(APP_NAME)