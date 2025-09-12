package main

import (
	"bytes"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/tls"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/base64"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"image"
	"io"
	"io/ioutil"
	"log"
	"math/big"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	_ "markdown-editor/docs"

	"github.com/disintegration/imaging"
	"github.com/gosimple/slug"
	"github.com/joho/godotenv"
	httpSwagger "github.com/swaggo/http-swagger" // swagger UI handler
	_ "github.com/swaggo/swag"                   // swagger embed files
	"go.uber.org/zap"
)

// FluxRequest represents the request structure for the FLUX API
type FluxRequest struct {
	Prompt      string `json:"prompt"`
	Proportion  string `json:"proportion,omitempty"`
	Language    string `json:"language,omitempty"`
	Format      string `json:"format,omitempty"`
	Seed        int64  `json:"seed,omitempty"`
	StorageDays int    `json:"storage_days,omitempty"`
}

// FluxResponse represents the response structure from the FLUX API
type FluxResponse struct {
	ImageData    string      `json:"image_data"`
	ImageURL     string      `json:"image_url,omitempty"`
	MimeType     string      `json:"mime_type"`
	Seed         json.Number `json:"seed"`
	StartedAt    time.Time   `json:"started_at"`
	CompletedAt  time.Time   `json:"completed_at"`
	ErrorMessage string      `json:"error,omitempty"`
}

// FluxClient handles API communication and implements ImageGenerator interface
type FluxClient struct {
	apiKey     string
	baseURL    string
	httpClient HTTPClient
	logger     *Logger
}

// NewFluxClient creates a new instance of FluxClient
func NewFluxClient(apiKey string, logger *Logger) *FluxClient {
	return &FluxClient{
		apiKey:     apiKey,
		baseURL:    "https://api.imagepig.com/flux",
		httpClient: NewHTTPClient(30 * time.Second),
		logger:     logger,
	}
}

// GenerateLandscapeImage generates a landscape image using the FLUX API
func (c *FluxClient) GenerateLandscapeImage(prompt string, outputFile string) error {
	c.logger.Info("GenerateLandscapeImage: Preparing request")

	// Prepare the request
	request := FluxRequest{
		Prompt:     prompt,
		Proportion: "landscape", // 1216×832 px
		Format:     "JPEG",
	}

	// Convert request to JSON
	requestBody, err := json.Marshal(request)
	if err != nil {
		c.logger.Error("GenerateLandscapeImage: Error marshaling request", zap.Error(err))
		return NewAPIError("ImagePig", c.baseURL, "Error marshaling request", 0, err)
	}

	// Create HTTP request
	req, err := http.NewRequest("POST", c.baseURL, bytes.NewBuffer(requestBody))
	if err != nil {
		c.logger.Error("GenerateLandscapeImage: Error creating request", zap.Error(err))
		return NewAPIError("ImagePig", c.baseURL, "Error creating request", 0, err)
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Api-Key", c.apiKey)

	// Send request
	c.logger.Info("GenerateLandscapeImage: Sending request to FLUX API")
	resp, err := c.httpClient.Do(req)
	if err != nil {
		c.logger.Error("GenerateLandscapeImage: Error sending request", zap.Error(err))
		return NewAPIError("ImagePig", c.baseURL, "Error sending request", 0, err)
	}
	defer resp.Body.Close()

	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.logger.Error("GenerateLandscapeImage: Error reading response", zap.Error(err))
		return NewAPIError("ImagePig", c.baseURL, "Error reading response", 0, err)
	}

	// Check for successful status code
	if resp.StatusCode != http.StatusOK {
		c.logger.Error("GenerateLandscapeImage: API request failed",
			zap.Int("status_code", resp.StatusCode),
			zap.String("response", string(body)),
		)
		return NewAPIError("ImagePig", c.baseURL, fmt.Sprintf("API request failed with status %d", resp.StatusCode), resp.StatusCode, nil)
	}

	// Parse response
	var fluxResponse FluxResponse
	if err := json.Unmarshal(body, &fluxResponse); err != nil {
		c.logger.Error("GenerateLandscapeImage: Error parsing response", zap.Error(err))
		return NewAPIError("ImagePig", c.baseURL, "Error parsing response", 0, err)
	}

	// Check for API error
	if fluxResponse.ErrorMessage != "" {
		c.logger.Error("GenerateLandscapeImage: API error", zap.String("error_message", fluxResponse.ErrorMessage))
		return NewAPIError("ImagePig", c.baseURL, fluxResponse.ErrorMessage, 0, nil)
	}

	// Decode base64 image
	imageData, err := base64.StdEncoding.DecodeString(fluxResponse.ImageData)
	if err != nil {
		c.logger.Error("GenerateLandscapeImage: Error decoding image data", zap.Error(err))
		return NewAPIError("ImagePig", c.baseURL, "Error decoding image data", 0, err)
	}

	// Save image to file
	if err := os.WriteFile(outputFile, imageData, 0644); err != nil {
		c.logger.Error("GenerateLandscapeImage: Error saving image",
			zap.String("output_file", outputFile),
			zap.Error(err),
		)
		return NewFileSystemError("WriteFile", outputFile, "Error saving image", err)
	}

	c.logger.Info("GenerateLandscapeImage: Image successfully saved", zap.String("output_file", outputFile))
	return nil
}

// AppConfig implements ConfigProvider interface
type AppConfig struct {
	config *Config
	logger *Logger
}

// NewAppConfig creates a new instance of AppConfig
func NewAppConfig(config *Config, logger *Logger) *AppConfig {
	return &AppConfig{
		config: config,
		logger: logger,
	}
}

// GetConfig returns the current configuration
func (p *AppConfig) GetConfig() Config {
	return *p.config
}

// LoadConfig is a no-op implementation since configuration is loaded via Viper
func (p *AppConfig) LoadConfig() error {
	// Configuration is already loaded via Viper, so this is a no-op
	p.logger.Info("LoadConfig: Configuration already loaded via Viper")
	return nil
}

// OSFileSystem implements FileSystem interface using os package
type OSFileSystem struct {
	logger *Logger
}

// NewOSFileSystem creates a new instance of OSFileSystem
func NewOSFileSystem(logger *Logger) *OSFileSystem {
	return &OSFileSystem{
		logger: logger,
	}
}

// ReadFile reads a file
func (fs *OSFileSystem) ReadFile(filename string) ([]byte, error) {
	data, err := ioutil.ReadFile(filename)
	if err != nil {
		fs.logger.Error("ReadFile: Error reading file",
			zap.String("filename", filename),
			zap.Error(err),
		)
		return nil, NewFileSystemError("ReadFile", filename, "Error reading file", err)
	}
	return data, nil
}

// WriteFile writes data to a file
func (fs *OSFileSystem) WriteFile(filename string, data []byte, perm os.FileMode) error {
	err := ioutil.WriteFile(filename, data, perm)
	if err != nil {
		fs.logger.Error("WriteFile: Error writing file",
			zap.String("filename", filename),
			zap.Error(err),
		)
		return NewFileSystemError("WriteFile", filename, "Error writing file", err)
	}
	return nil
}

// ReadDir reads a directory
func (fs *OSFileSystem) ReadDir(dirname string) ([]os.FileInfo, error) {
	files, err := ioutil.ReadDir(dirname)
	if err != nil {
		fs.logger.Error("ReadDir: Error reading directory",
			zap.String("dirname", dirname),
			zap.Error(err),
		)
		return nil, NewFileSystemError("ReadDir", dirname, "Error reading directory", err)
	}
	return files, nil
}

// MkdirAll creates all directories in the path
func (fs *OSFileSystem) MkdirAll(path string, perm os.FileMode) error {
	err := os.MkdirAll(path, perm)
	if err != nil {
		fs.logger.Error("MkdirAll: Error creating directory",
			zap.String("path", path),
			zap.Error(err),
		)
		return NewFileSystemError("MkdirAll", path, "Error creating directory", err)
	}
	return nil
}

// Remove removes a file or directory
func (fs *OSFileSystem) Remove(name string) error {
	err := os.Remove(name)
	if err != nil {
		fs.logger.Error("Remove: Error removing file",
			zap.String("name", name),
			zap.Error(err),
		)
		return NewFileSystemError("Remove", name, "Error removing file", err)
	}
	return nil
}

// Stat returns file info
func (fs *OSFileSystem) Stat(name string) (os.FileInfo, error) {
	info, err := os.Stat(name)
	if err != nil {
		fs.logger.Error("Stat: Error getting file info",
			zap.String("name", name),
			zap.Error(err),
		)
		return nil, NewFileSystemError("Stat", name, "Error getting file info", err)
	}
	return info, nil
}

// Create creates a file
func (fs *OSFileSystem) Create(name string) (*os.File, error) {
	file, err := os.Create(name)
	if err != nil {
		fs.logger.Error("Create: Error creating file",
			zap.String("name", name),
			zap.Error(err),
		)
		return nil, NewFileSystemError("Create", name, "Error creating file", err)
	}
	return file, nil
}

// Walk walks the file tree
func (fs *OSFileSystem) Walk(root string, walkFn filepath.WalkFunc) error {
	err := filepath.Walk(root, walkFn)
	if err != nil {
		fs.logger.Error("Walk: Error walking file tree",
			zap.String("root", root),
			zap.Error(err),
		)
		return NewFileSystemError("Walk", root, "Error walking file tree", err)
	}
	return nil
}

// HTTPClientImpl implements HTTPClient interface using http.Client
type HTTPClientImpl struct {
	client *http.Client
	logger *Logger
}

// NewHTTPClient creates a new instance of HTTPClientImpl
func NewHTTPClient(timeout time.Duration) *HTTPClientImpl {
	return &HTTPClientImpl{
		client: &http.Client{Timeout: timeout},
	}
}

// Do performs an HTTP request
func (c *HTTPClientImpl) Do(req *http.Request) (*http.Response, error) {
	resp, err := c.client.Do(req)
	if err != nil {
		return nil, NewAPIError("HTTPClient", req.URL.String(), "Error performing HTTP request", 0, err)
	}
	return resp, nil
}

// Application holds the dependencies for the application
type Application struct {
	configProvider ConfigProvider
	fileSystem     FileSystem
	httpClient     HTTPClient
	imageGenerator ImageGenerator
	imageProcessor ImageProcessingService
	logger         *Logger
	config         *Config
}

// NewApplication creates a new instance of Application with all dependencies
func NewApplication(logger *Logger) (*Application, error) {
	// Load configuration using Viper
	config, err := LoadConfig(logger.Logger)
	if err != nil {
		logger.Fatal("Failed to load configuration", zap.Error(err))
		return nil, err
	}

	// Create concrete implementations
	configProvider := NewAppConfig(config, logger)
	fileSystem := NewOSFileSystem(logger)
	httpClient := NewHTTPClient(30 * time.Second)

	// Create FluxClient with the HTTPClient interface
	apiKey := config.Secrets.ImagePigAPIKey
	if apiKey == "" {
		logger.Warn("IMAGEPIG_API_KEY not found in configuration")
	}

	imageGenerator := NewFluxClient(apiKey, logger)
	imageProcessor := NewImageProcessingServiceImpl(configProvider, fileSystem, logger)

	return &Application{
		configProvider: configProvider,
		fileSystem:     fileSystem,
		httpClient:     httpClient,
		imageGenerator: imageGenerator,
		imageProcessor: imageProcessor,
		logger:         logger,
		config:         config,
	}, nil
}

func main() {
	// Initialize structured logger
	logger, err := NewLogger()
	if err != nil {
		log.Fatalf("Failed to initialize logger: %v", err)
	}
	defer logger.Sync()

	// Initialize application with dependency injection
	app, err := NewApplication(logger)
	if err != nil {
		logger.Fatal("Failed to initialize application", zap.Error(err))
	}

	// Set up middleware chain
	mux := http.NewServeMux()

	// Serve static files from the "static" directory
	fs := http.FileServer(http.Dir("static"))
	mux.Handle("/", fs)
	logger.Info("main: Serving static files from /static")

	// API endpoints with error handling
	mux.HandleFunc("/api/config", WithErrorHandling(app.handleConfig))
	mux.HandleFunc("/api/save", WithErrorHandling(app.handleSave))
	mux.HandleFunc("/api/load", WithErrorHandling(app.handleLoad))
	mux.HandleFunc("/api/list", WithErrorHandling(app.handleList))
	mux.HandleFunc("/api/media-list", WithErrorHandling(app.handleMediaList))
	mux.HandleFunc("/api/process-media", WithErrorHandling(app.handleProcessMedia))
	mux.HandleFunc("/api/create-post", WithErrorHandling(app.handleCreatePost))
	mux.HandleFunc("/api/tags", WithErrorHandling(app.handleGetTags))
	mux.HandleFunc("/api/categories", WithErrorHandling(app.handleGetCategories))
	mux.HandleFunc("/api/delete-media", WithErrorHandling(app.handleDeleteMedia))
	mux.HandleFunc("/api/upload-media", WithErrorHandling(app.handleUploadMediaFolder))

	// Updated Swagger handler
	mux.Handle("/swagger/", httpSwagger.Handler(
		httpSwagger.URL("/docs/swagger.json"), // The url pointing to API definition
		httpSwagger.DeepLinking(true),
		httpSwagger.DocExpansion("none"),
		httpSwagger.DomID("swagger-ui"),
	))
	logger.Info("main: Swagger UI configured")

	// Determine the address to listen on
	config := app.configProvider.GetConfig()
	httpAddr := fmt.Sprintf(":%d", config.Server.Port)
	httpsAddr := fmt.Sprintf(":%d", config.Server.HTTPSPort)

	// Check if certificates exist, if not, generate them for development
	env := os.Getenv("APP_ENV")
	if env == "" {
		env = "development"
	}
	if (config.Server.CertFile == "" || config.Server.KeyFile == "") && env == "development" {
		logger.Info("Certificates not found and in development mode. Generating self-signed certificates.")
		config.Server.CertFile = "cert.pem"
		config.Server.KeyFile = "key.pem"
		if err := generateSelfSignedCert(config.Server.CertFile, config.Server.KeyFile, logger); err != nil {
			logger.Fatal("Failed to generate self-signed certificates", zap.Error(err))
		}
		logger.Info("Self-signed certificates generated successfully for development.")
	} else if config.Server.CertFile == "" || config.Server.KeyFile == "" {
		logger.Warn("HTTPS server not started: certFile or keyFile not configured. Set SERVER_CERTFILE and SERVER_KEYFILE environment variables or in config file.")
	}

	// Show URL on start if configured
	if config.Server.ShowURLOnStart {
		logger.Info("Server starting",
			zap.String("url", fmt.Sprintf("http://localhost%s", httpAddr)),
			zap.String("swagger_url", fmt.Sprintf("http://localhost%s/swagger/index.html", httpAddr)),
		)
		if config.Server.CertFile != "" && config.Server.KeyFile != "" {
			logger.Info("HTTPS server starting",
				zap.String("url", fmt.Sprintf("https://localhost%s", httpsAddr)),
			)
		}
	} else {
		logger.Info("Server starting", zap.Int("port", config.Server.Port))
		if config.Server.CertFile != "" && config.Server.KeyFile != "" {
			logger.Info("HTTPS server starting", zap.Int("port", config.Server.HTTPSPort))
		}
	}

	// Create the handler chain
	handlerChain := RequestIDMiddleware(
		LoggingMiddleware(logger)(
			ErrorHandlerMiddleware(logger)(
				SecurityHeadersMiddleware(logger)(
					mux,
				),
			),
		),
	)

	// DEBUG: Add logging to verify server startup logic
	logger.Info("DEBUG: Server startup logic check",
		zap.Bool("redirectHTTPToHTTPS", config.Server.RedirectHTTPToHTTPS),
		zap.String("certFile", config.Server.CertFile),
		zap.String("keyFile", config.Server.KeyFile),
		zap.String("env", env),
	)

	// Start HTTP server for redirect if enabled
	if config.Server.RedirectHTTPToHTTPS && config.Server.CertFile != "" && config.Server.KeyFile != "" {
		go func() {
			logger.Info("Starting HTTP to HTTPS redirect server", zap.String("address", httpAddr))
			redirectServer := &http.Server{
				Addr: httpAddr,
				Handler: http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
					http.Redirect(w, r, fmt.Sprintf("https://%s%s", r.Host, r.RequestURI), http.StatusMovedPermanently)
				}),
			}
			if err := redirectServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
				logger.Fatal("HTTP redirect server failed to start", zap.Error(err))
			}
		}()
	}

	// Start HTTPS server if certificates are available
	if config.Server.CertFile != "" && config.Server.KeyFile != "" {
		go func() {
			logger.Info("Starting HTTPS server", zap.String("address", httpsAddr))
			httpsServer := &http.Server{
				Addr:    httpsAddr,
				Handler: handlerChain,
				TLSConfig: &tls.Config{
					MinVersion: tls.VersionTLS12,
				},
			}
			if err := httpsServer.ListenAndServeTLS(config.Server.CertFile, config.Server.KeyFile); err != nil && err != http.ErrServerClosed {
				logger.Fatal("HTTPS server failed to start", zap.Error(err))
			}
		}()
		
		// In development mode, also start HTTP server alongside HTTPS
		if env == "development" {
			go func() {
				logger.Info("Starting HTTP server in development mode", zap.String("address", httpAddr))
				httpServer := &http.Server{
					Addr:    httpAddr,
					Handler: handlerChain,
				}
				if err := httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
					logger.Fatal("HTTP server failed to start", zap.Error(err))
				}
			}()
		}
	} else {
		logger.Warn("HTTPS server not started: certFile or keyFile not configured. Consider generating self-signed certificates for development.")
		// If HTTPS is not configured, start HTTP server on the main port
		go func() {
			logger.Info("Starting HTTP server", zap.String("address", httpAddr))
			if err := http.ListenAndServe(httpAddr, handlerChain); err != nil && err != http.ErrServerClosed {
				logger.Fatal("HTTP server failed to start", zap.Error(err))
			}
		}()
	}

	// Block main thread indefinitely
	select {}
}

func (app *Application) handleConfig(w http.ResponseWriter, r *http.Request) error {
	logger := GetLoggerFromContext(r.Context())
	logger.Info("handleConfig: Handling config request")

	w.Header().Set("Content-Type", "application/json")
	return json.NewEncoder(w).Encode(app.configProvider.GetConfig())
}

func (app *Application) handleSave(w http.ResponseWriter, r *http.Request) error {
	logger := GetLoggerFromContext(r.Context())

	if r.Method != http.MethodPost {
		logger.Warn("handleSave: Method not allowed", zap.String("method", r.Method))
		return NewValidationError("method", "Method not allowed", nil)
	}

	filename := r.URL.Query().Get("file")
	if filename == "" {
		logger.Warn("handleSave: Filename is required")
		return NewValidationError("filename", "Filename is required", nil)
	}

	content, err := ioutil.ReadAll(r.Body)
	if err != nil {
		logger.Error("handleSave: Error reading request body", zap.Error(err))
		return NewValidationError("request_body", "Error reading request body", err)
	}

	fullPath := getFullPath(filename, app.configProvider.GetConfig())
	err = app.fileSystem.WriteFile(fullPath, content, 0644)
	if err != nil {
		return err
	}

	logger.Info("handleSave: Successfully saved file", zap.String("path", fullPath))
	w.WriteHeader(http.StatusOK)
	return nil
}

func (app *Application) handleLoad(w http.ResponseWriter, r *http.Request) error {
	logger := GetLoggerFromContext(r.Context())

	filename := r.URL.Query().Get("file")
	if filename == "" {
		logger.Warn("handleLoad: Filename is required")
		return NewValidationError("filename", "Filename is required", nil)
	}

	fullPath := getFullPath(filename, app.configProvider.GetConfig())
	content, err := app.fileSystem.ReadFile(fullPath)
	if err != nil {
		return err
	}

	logger.Info("handleLoad: Successfully loaded file", zap.String("path", fullPath))
	w.Header().Set("Content-Type", "text/plain")
	_, err = w.Write(content)
	return err
}

func (app *Application) handleList(w http.ResponseWriter, r *http.Request) error {
	logger := GetLoggerFromContext(r.Context())
	logger.Info("handleList: Handling list request")

	files := make(map[string][]string)
	config := app.configProvider.GetConfig()

	germanFiles, err := listFiles(config.Server.GermanFolder, app.fileSystem)
	if err != nil {
		return err
	}
	files["de"] = germanFiles

	englishFiles, err := listFiles(config.Server.EnglishFolder, app.fileSystem)
	if err != nil {
		return err
	}
	files["en"] = englishFiles

	w.Header().Set("Content-Type", "application/json")
	lang := r.URL.Query().Get("lang")
	switch lang {
	case "de":
		logger.Info("handleList: Responding with German files")
		return json.NewEncoder(w).Encode(germanFiles)
	case "en":
		logger.Info("handleList: Responding with English files")
		return json.NewEncoder(w).Encode(englishFiles)
	default:
		logger.Info("handleList: Responding with all files")
		return json.NewEncoder(w).Encode(files)
	}
}

func (app *Application) handleMediaList(w http.ResponseWriter, r *http.Request) error {
	logger := GetLoggerFromContext(r.Context())
	logger.Info("handleMediaList: Handling media list request")

	config := app.configProvider.GetConfig()
	files, err := app.fileSystem.ReadDir(config.Server.MediaFolder)
	if err != nil {
		return err
	}

	var mediaFiles []string
	for _, file := range files {
		if !file.IsDir() {
			mediaFiles = append(mediaFiles, file.Name())
		}
	}

	logger.Info("handleMediaList: Found media files", zap.Int("count", len(mediaFiles)))
	w.Header().Set("Content-Type", "application/json")
	return json.NewEncoder(w).Encode(mediaFiles)
}

func (app *Application) handleProcessMedia(w http.ResponseWriter, r *http.Request) error {
	logger := GetLoggerFromContext(r.Context())

	if r.Method != http.MethodPost {
		logger.Warn("handleProcessMedia: Method not allowed", zap.String("method", r.Method))
		return NewValidationError("method", "Method not allowed", nil)
	}

	var request struct {
		File    string `json:"file"`
		NewName string `json:"newName"`
	}
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		logger.Error("handleProcessMedia: Invalid request body", zap.Error(err))
		return NewValidationError("request_body", "Invalid request body", err)
	}

	logger.Info("handleProcessMedia: Processing media file",
		zap.String("file", request.File),
		zap.String("new_name", request.NewName),
	)

	mediaRequest := MediaProcessRequest{
		File:    request.File,
		NewName: request.NewName,
	}

	newFileName, err := app.imageProcessor.ProcessMediaFile(mediaRequest)
	if err != nil {
		return err
	}

	response := struct {
		Filename string `json:"filename"`
	}{
		Filename: newFileName,
	}

	logger.Info("handleProcessMedia: Successfully processed media file", zap.String("filename", newFileName))
	w.Header().Set("Content-Type", "application/json")
	return json.NewEncoder(w).Encode(response)
}

// validatePostRequest validates the incoming post request data
func (app *Application) validatePostRequest(r *http.Request) (*NewPostRequest, []byte, error) {
	logger := GetLoggerFromContext(r.Context())

	if r.Method != http.MethodPost {
		logger.Warn("validatePostRequest: Method not allowed", zap.String("method", r.Method))
		return nil, nil, NewValidationError("method", "Method not allowed", nil)
	}

	logger.Info("validatePostRequest: Received request to create a new post")

	// Read the raw request body first for debugging
	bodyBytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		logger.Error("validatePostRequest: Error reading request body", zap.Error(err))
		return nil, nil, NewValidationError("request_body", "Error reading request body", err)
	}
	r.Body = io.NopCloser(bytes.NewBuffer(bodyBytes)) // Restore the body for later use

	// Log raw request for debugging
	logger.Debug("validatePostRequest: Raw request body", zap.String("body", string(bodyBytes)))

	var request NewPostRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		logger.Error("validatePostRequest: Invalid request body",
			zap.Error(err),
			zap.String("raw_body", string(bodyBytes)),
		)
		return nil, nil, NewValidationError("request_body", fmt.Sprintf("Invalid request body: %v", err), err)
	}

	logger.Debug("validatePostRequest: Decoded request", zap.Any("request", request))

	// Validate required fields with more specific logging
	if request.Title == "" {
		logger.Warn("validatePostRequest: Title is missing")
		return nil, nil, NewValidationError("title", "Title is required", nil)
	}
	if request.Date == "" {
		logger.Warn("validatePostRequest: Date is missing")
		return nil, nil, NewValidationError("date", "Date is required", nil)
	}
	logger.Info("validatePostRequest: Validation passed",
		zap.String("title", request.Title),
		zap.String("date", request.Date),
	)

	return &request, bodyBytes, nil
}

// processThumbnail handles thumbnail generation and processing
func (app *Application) processThumbnail(request *NewPostRequest) error {
	logger := app.logger

	// Handle Thumbnail Creation with more detailed logging
	logger.Info("processThumbnail: Starting thumbnail handling",
		zap.String("local_file", request.Thumbnail.LocalFile),
		zap.String("url", request.Thumbnail.URL),
	)

	config := app.configProvider.GetConfig()
	if request.Thumbnail.LocalFile == "" && request.Thumbnail.URL == "" {
		newFileName := request.Slug + ".jpg"
		destFile := filepath.Join(config.Server.AssetFolder, newFileName)
		logger.Info("processThumbnail: Thumbnail destination file",
			zap.String("dest_file", destFile),
			zap.String("asset_folder", config.Server.AssetFolder),
		)

		// Check if AssetFolder exists
		if _, err := app.fileSystem.Stat(config.Server.AssetFolder); os.IsNotExist(err) {
			logger.Info("processThumbnail: AssetFolder does not exist", zap.String("path", config.Server.AssetFolder))
			if err := app.fileSystem.MkdirAll(config.Server.AssetFolder, 0755); err != nil {
				return err
			}
			logger.Info("processThumbnail: Created AssetFolder", zap.String("path", config.Server.AssetFolder))
		}

		// Check if thumbnail file exists
		if _, err := app.fileSystem.Stat(destFile); err == nil {
			logger.Info("processThumbnail: Thumbnail file already exists", zap.String("path", destFile))
		} else {
			logger.Info("processThumbnail: Creating thumbnail using ImagePig", zap.String("title", request.Title))
			err := app.createImageWithImagePig(request.Title, destFile)
			if err != nil {
				return err
			}
			logger.Info("processThumbnail: Successfully created thumbnail", zap.String("path", destFile))
		}
		request.Thumbnail.URL = "/img/blog/" + newFileName
		logger.Info("processThumbnail: Set Thumbnail URL", zap.String("url", request.Thumbnail.URL))
	}

	// Process Local Thumbnail File
	if request.Thumbnail.LocalFile != "" && request.Thumbnail.URL == "" {
		logger.Info("processThumbnail: Processing local thumbnail file", zap.String("file", request.Thumbnail.LocalFile))

		reqMediaFile := MediaProcessRequest{
			File:    request.Thumbnail.LocalFile,
			NewName: request.Slug,
		}

		newFileName, err := app.imageProcessor.ProcessMediaFile(reqMediaFile)
		if err != nil {
			return err
		}

		logger.Info("processThumbnail: Processed media file",
			zap.String("from", request.Thumbnail.LocalFile),
			zap.String("to", newFileName),
		)
		request.Thumbnail.URL = "/img/blog/" + newFileName
	}

	return nil
}

// generatePostContent generates the post content from the request data
func (app *Application) generatePostContent(request *NewPostRequest) string {
	logger := app.logger
	logger.Info("generatePostContent: Generating markdown content", zap.String("title", request.Title))

	content := generateMarkdownContent(*request)

	logger.Info("generatePostContent: Generated markdown content", zap.Int("length", len(content)))
	return content
}

// savePostToFile saves the post content to the file system
func (app *Application) savePostToFile(request *NewPostRequest, content string) (string, string, error) {
	logger := app.logger

	// Create filename from title
	filename := createSlug(request.Title) + ".md"
	logger.Info("savePostToFile: Generated filename",
		zap.String("filename", filename),
		zap.String("title", request.Title),
	)

	// Determine the target folder based on language
	var targetFolder string
	config := app.configProvider.GetConfig()
	switch request.Language {
	case "de":
		targetFolder = config.Server.GermanFolder
	case "en":
		targetFolder = config.Server.EnglishFolder
	default:
		logger.Warn("savePostToFile: Invalid language specified", zap.String("language", request.Language))
		return "", "", NewValidationError("language", "Invalid language", nil)
	}
	logger.Info("savePostToFile: Target folder set", zap.String("folder", targetFolder))

	// Ensure target folder exists
	if _, err := app.fileSystem.Stat(targetFolder); os.IsNotExist(err) {
		logger.Info("savePostToFile: Target folder does not exist", zap.String("path", targetFolder))
		if err := app.fileSystem.MkdirAll(targetFolder, 0755); err != nil {
			return "", "", err
		}
		logger.Info("savePostToFile: Created target folder", zap.String("path", targetFolder))
	}

	// Save the file with detailed error logging
	fullPath := filepath.Join(targetFolder, filename)
	logger.Info("savePostToFile: Attempting to save file", zap.String("path", fullPath))
	if err := app.fileSystem.WriteFile(fullPath, []byte(content), 0644); err != nil {
		return "", "", err
	}
	logger.Info("savePostToFile: Successfully saved post",
		zap.String("path", fullPath),
		zap.Int("content_length", len(content)),
	)

	return filename, fullPath, nil
}

// updatePostMetadata updates any metadata related to the post
func (app *Application) updatePostMetadata(request *NewPostRequest) error {
	logger := app.logger

	// Update tags and categories in config with detailed logging
	logger.Info("updatePostMetadata: Updating tags and categories",
		zap.Int("tags_count", len(request.Tags)),
		zap.Int("categories_count", len(request.Categories)),
	)
	if err := app.updateTagsAndCategories(request.Tags, request.Categories); err != nil {
		return err
	}
	logger.Info("updatePostMetadata: Successfully updated tags and categories",
		zap.Int("tags_count", len(request.Tags)),
		zap.Int("categories_count", len(request.Categories)),
	)

	return nil
}

func (app *Application) handleCreatePost(w http.ResponseWriter, r *http.Request) error {
	logger := GetLoggerFromContext(r.Context())

	// Validate the request
	request, _, err := app.validatePostRequest(r)
	if err != nil {
		return err
	}

	// Generate slug if not provided
	if request.Slug == "" {
		request.Slug = slug.Make(request.Title)
		logger.Info("handleCreatePost: Generated slug",
			zap.String("slug", request.Slug),
			zap.String("title", request.Title),
		)
	}

	// Process thumbnail
	if err := app.processThumbnail(request); err != nil {
		return err
	}

	// Generate post content
	content := app.generatePostContent(request)

	// Save post to file
	filename, fullPath, err := app.savePostToFile(request, content)
	if err != nil {
		return err
	}

	// Update post metadata
	if err := app.updatePostMetadata(request); err != nil {
		return err
	}

	// Prepare and send response with proper error handling
	w.Header().Set("Content-Type", "application/json")
	response := map[string]string{
		"filename": filename,
		"path":     fullPath,
	}
	logger.Debug("handleCreatePost: Preparing response", zap.Any("response", response))

	if err := json.NewEncoder(w).Encode(response); err != nil {
		return err
	}
	logger.Info("handleCreatePost: Successfully completed post creation", zap.String("filename", filename))
	return nil
}

func (app *Application) handleGetTags(w http.ResponseWriter, r *http.Request) error {
	logger := GetLoggerFromContext(r.Context())
	logger.Info("handleGetTags: Handling get tags request")

	tags, err := app.getAllTags()
	if err != nil {
		return err
	}

	logger.Info("handleGetTags: Retrieved tags", zap.Int("count", len(tags)))
	w.Header().Set("Content-Type", "application/json")
	return json.NewEncoder(w).Encode(tags)
}

func (app *Application) handleGetCategories(w http.ResponseWriter, r *http.Request) error {
	logger := GetLoggerFromContext(r.Context())
	logger.Info("handleGetCategories: Handling get categories request")

	categories, err := app.getAllCategories()
	if err != nil {
		return err
	}

	logger.Info("handleGetCategories: Retrieved categories", zap.Int("count", len(categories)))
	w.Header().Set("Content-Type", "application/json")
	return json.NewEncoder(w).Encode(categories)
}

func createSlug(title string) string {
	slug := strings.ToLower(title)
	slug = strings.ReplaceAll(slug, " ", "-")
	slug = regexp.MustCompile(`[^a-z0-9-]`).ReplaceAllString(slug, "")
	return slug
}

func generateMarkdownContent(post NewPostRequest) string {
	var sb strings.Builder

	sb.WriteString("---\n")
	sb.WriteString(fmt.Sprintf("title: '%s'\n", post.Title))
	if post.Slug == "" {
		post.Slug = slug.Make(post.Title)
	}
	sb.WriteString(fmt.Sprintf("slug: %s\n", post.Slug))
	if post.Description != "" {
		sb.WriteString(fmt.Sprintf("description: '%s'\n", post.Description))
	}

	// Convert date string to time.Time
	date, err := time.Parse("2006-01-02T15:04", post.Date)
	if err != nil {
		date = time.Now()
	}
	// Convert date to UTC
	utcDate := date.UTC()
	sb.WriteString(fmt.Sprintf("date: %s\n", utcDate.Format(time.RFC3339)))

	if len(post.Tags) > 0 {
		tags, _ := json.Marshal(post.Tags)
		sb.WriteString(fmt.Sprintf("tags: %s\n", strings.ReplaceAll(string(tags), "\"", "")))
	}

	if len(post.Categories) > 0 {
		categories, _ := json.Marshal(post.Categories)
		sb.WriteString(fmt.Sprintf("categories: %s\n", strings.ReplaceAll(string(categories), "\"", "")))
	}

	if post.Thumbnail.URL != "" {
		sb.WriteString("thumbnail:\n")
		sb.WriteString(fmt.Sprintf("  url: %s\n", post.Thumbnail.URL))
		if post.Thumbnail.Author != "" {
			sb.WriteString(fmt.Sprintf("  author: %s\n", post.Thumbnail.Author))
		}
		if post.Thumbnail.AuthorURL != "" {
			sb.WriteString(fmt.Sprintf("  authorUrl: %s\n", post.Thumbnail.AuthorURL))
		}
		if post.Thumbnail.Origin != "" {
			sb.WriteString(fmt.Sprintf("  origin: %s\n", post.Thumbnail.Origin))
		}
	}

	sb.WriteString("draft: true\n")

	sb.WriteString("---\n")
	return sb.String()
}

// getAllTags reads and returns all tags from the tags data file
func (app *Application) getAllTags() ([]Tag, error) {
	logger := app.logger
	logger.Info("getAllTags: Reading tags from data/tags.json")

	file, err := app.fileSystem.ReadFile("data/tags.json")
	if err != nil {
		if os.IsNotExist(err) {
			logger.Info("getAllTags: tags.json does not exist, returning empty slice")
			return []Tag{}, nil
		}
		return nil, err
	}

	var tagsData TagsData
	err = json.Unmarshal(file, &tagsData)
	if err != nil {
		return nil, err
	}

	logger.Info("getAllTags: Retrieved tags", zap.Int("count", len(tagsData.Tags)))
	return tagsData.Tags, nil
}

// getAllCategories reads and returns all categories from the categories data file
func (app *Application) getAllCategories() ([]Category, error) {
	logger := app.logger
	logger.Info("getAllCategories: Reading categories from data/categories.json")

	file, err := app.fileSystem.ReadFile("data/categories.json")
	if err != nil {
		if os.IsNotExist(err) {
			logger.Info("getAllCategories: categories.json does not exist, returning empty slice")
			return []Category{}, nil
		}
		return nil, err
	}

	var categoriesData CategoriesData
	err = json.Unmarshal(file, &categoriesData)
	if err != nil {
		return nil, err
	}

	logger.Info("getAllCategories: Retrieved categories", zap.Int("count", len(categoriesData.Categories)))
	return categoriesData.Categories, nil
}

// updateTagsAndCategories updates the tags and categories data files with new entries
func (app *Application) updateTagsAndCategories(newTags []string, newCategories []string) error {
	logger := app.logger
	logger.Info("updateTagsAndCategories: Updating tags and categories")

	// Update tags
	if err := app.updateTags(newTags); err != nil {
		return err
	}

	// Update categories
	if err := app.updateCategories(newCategories); err != nil {
		return err
	}

	logger.Info("updateTagsAndCategories: Successfully updated tags and categories")
	return nil
}

// updateTags updates the tags data file with new tags
func (app *Application) updateTags(newTags []string) error {
	logger := app.logger
	logger.Info("updateTags: Updating tags")

	existingTags, err := app.getAllTags()
	if err != nil {
		return err
	}

	// Create a map for existing tags for easy lookup
	tagMap := make(map[string]*Tag)
	for i := range existingTags {
		tagMap[existingTags[i].Name] = &existingTags[i]
	}

	// Update counts for existing tags and add new ones
	for _, newTag := range newTags {
		if tag, exists := tagMap[newTag]; exists {
			tag.Count++
			logger.Info("updateTags: Incremented count for existing tag",
				zap.String("tag", newTag),
				zap.Int("count", tag.Count),
			)
		} else {
			existingTags = append(existingTags, Tag{
				Name:  newTag,
				Count: 1,
			})
			logger.Info("updateTags: Added new tag", zap.String("tag", newTag))
		}
	}

	// Create data directory if it doesn't exist
	if err := app.fileSystem.MkdirAll("data", 0755); err != nil {
		return err
	}

	// Save updated tags to file
	tagsData := TagsData{Tags: existingTags}
	jsonData, err := json.MarshalIndent(tagsData, "", "  ")
	if err != nil {
		return err
	}

	err = app.fileSystem.WriteFile("data/tags.json", jsonData, 0644)
	if err != nil {
		return err
	}

	logger.Info("updateTags: Successfully updated tags.json")
	return nil
}

// updateCategories updates the categories data file with new categories
func (app *Application) updateCategories(newCategories []string) error {
	logger := app.logger
	logger.Info("updateCategories: Updating categories")

	existingCategories, err := app.getAllCategories()
	if err != nil {
		return err
	}

	// Create a map for existing categories for easy lookup
	categoryMap := make(map[string]*Category)
	for i := range existingCategories {
		categoryMap[existingCategories[i].Name] = &existingCategories[i]
	}

	// Update counts for existing categories and add new ones
	for _, newCategory := range newCategories {
		if category, exists := categoryMap[newCategory]; exists {
			category.Count++
			logger.Info("updateCategories: Incremented count for existing category",
				zap.String("category", newCategory),
				zap.Int("count", category.Count),
			)
		} else {
			existingCategories = append(existingCategories, Category{
				Name:  newCategory,
				Count: 1,
			})
			logger.Info("updateCategories: Added new category", zap.String("category", newCategory))
		}
	}

	// Create data directory if it doesn't exist
	if err := app.fileSystem.MkdirAll("data", 0755); err != nil {
		return err
	}

	// Save updated categories to file
	categoriesData := CategoriesData{Categories: existingCategories}
	jsonData, err := json.MarshalIndent(categoriesData, "", "  ")
	if err != nil {
		return err
	}

	err = app.fileSystem.WriteFile("data/categories.json", jsonData, 0644)
	if err != nil {
		return err
	}

	logger.Info("updateCategories: Successfully updated categories.json")
	return nil
}

// ImageProcessingServiceImpl implements ImageProcessingService interface
type ImageProcessingServiceImpl struct {
	configProvider ConfigProvider
	fileSystem     FileSystem
	logger         *Logger
}

// NewImageProcessingServiceImpl creates a new instance of ImageProcessingServiceImpl
func NewImageProcessingServiceImpl(configProvider ConfigProvider, fileSystem FileSystem, logger *Logger) *ImageProcessingServiceImpl {
	return &ImageProcessingServiceImpl{
		configProvider: configProvider,
		fileSystem:     fileSystem,
		logger:         logger,
	}
}

// ProcessMediaFile processes the media file and returns the new filename
func (s *ImageProcessingServiceImpl) ProcessMediaFile(request MediaProcessRequest) (string, error) {
	logger := s.logger
	logger.Info("ProcessMediaFile: Processing file",
		zap.String("file", request.File),
		zap.String("new_name", request.NewName),
	)

	config := s.configProvider.GetConfig()
	sourceFile := filepath.Join(config.Server.MediaFolder, request.File)
	ext := filepath.Ext(request.File)
	newFileName := request.NewName + ext
	destFile := filepath.Join(config.Server.AssetFolder, newFileName)

	logger.Info("ProcessMediaFile: File paths",
		zap.String("source", sourceFile),
		zap.String("destination", destFile),
	)

	// Open the source image
	src, err := imaging.Open(sourceFile)
	if err != nil {
		return "", NewFileSystemError("Open", sourceFile, "Error opening source image", err)
	}
	logger.Info("ProcessMediaFile: Source image opened successfully")

	// Get the dimensions of the source image
	srcWidth := src.Bounds().Dx()
	srcHeight := src.Bounds().Dy()
	logger.Info("ProcessMediaFile: Source image dimensions",
		zap.Int("width", srcWidth),
		zap.Int("height", srcHeight),
	)

	// Calculate the new height to maintain the aspect ratio
	newHeight := (config.Server.ImageResize.MaxWidth * srcHeight) / srcWidth
	logger.Info("ProcessMediaFile: Calculated new height", zap.Int("height", newHeight))

	// Resize the image
	var resized image.Image
	if config.Server.ImageResize.Method == "fit" {
		resized = imaging.Fit(src, config.Server.ImageResize.MaxWidth, newHeight, imaging.Lanczos)
		logger.Info("ProcessMediaFile: Image resized using 'fit' method")
	} else {
		resized = imaging.Fill(src, config.Server.ImageResize.MaxWidth, newHeight, imaging.Center, imaging.Lanczos)
		logger.Info("ProcessMediaFile: Image resized using 'fill' method")
	}

	// Save the resized image
	err = imaging.Save(resized, destFile)
	if err != nil {
		return "", NewFileSystemError("Save", destFile, "Error saving resized image", err)
	}
	logger.Info("ProcessMediaFile: Resized image saved", zap.String("path", destFile))

	// Create and save thumbnail
	var thumbnail image.Image
	if config.Server.ThumbnailResize.Method == "fit" {
		thumbnail = imaging.Fit(src, config.Server.ThumbnailResize.MaxWidth, newHeight, imaging.Lanczos)
		logger.Info("ProcessMediaFile: Thumbnail resized using 'fit' method")
	} else {
		thumbnail = imaging.Fill(src, config.Server.ThumbnailResize.MaxWidth, newHeight, imaging.Center, imaging.Lanczos)
		logger.Info("ProcessMediaFile: Thumbnail resized using 'fill' method")
	}

	thumbnailFile := filepath.Join(config.Server.AssetFolder, "thumb_"+newFileName)
	err = imaging.Save(thumbnail, thumbnailFile)
	if err != nil {
		return "", NewFileSystemError("Save", thumbnailFile, "Error saving thumbnail", err)
	}
	logger.Info("ProcessMediaFile: Thumbnail saved", zap.String("path", thumbnailFile))

	return newFileName, nil
}

// processMediaFile processes the media file and returns the new filename
// This function is kept for backward compatibility but now delegates to the ImageProcessingService
func (app *Application) processMediaFile(request struct {
	File    string `json:"file"`
	NewName string `json:"newName"`
}) (string, error) {
	mediaRequest := MediaProcessRequest{
		File:    request.File,
		NewName: request.NewName,
	}
	return app.imageProcessor.ProcessMediaFile(mediaRequest)
}

func (app *Application) handleUploadMediaFolder(w http.ResponseWriter, r *http.Request) error {
	logger := GetLoggerFromContext(r.Context())

	if r.Method != http.MethodPost {
		logger.Warn("handleUploadMediaFolder: Method not allowed", zap.String("method", r.Method))
		return NewValidationError("method", "Method not allowed", nil)
	}

	// Parse the multipart form data with a 32MB limit
	err := r.ParseMultipartForm(32 << 20)
	if err != nil {
		logger.Error("handleUploadMediaFolder: Error parsing form data", zap.Error(err))
		return NewValidationError("form_data", "Error parsing form data", err)
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		logger.Error("handleUploadMediaFolder: Error retrieving file", zap.Error(err))
		return NewValidationError("file", "Error retrieving file", err)
	}
	defer file.Close()

	// Generate a unique filename
	ext := filepath.Ext(header.Filename)
	filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)
	config := app.configProvider.GetConfig()
	fullPath := filepath.Join(config.Server.MediaFolder, filename)
	logger.Info("handleUploadMediaFolder: Saving uploaded file", zap.String("path", fullPath))

	// Create a new file in the media folder
	dst, err := app.fileSystem.Create(fullPath)
	if err != nil {
		return err
	}
	defer dst.Close()

	// Copy the uploaded file to the destination
	_, err = io.Copy(dst, file)
	if err != nil {
		return err
	}

	// Return the filename in the response
	response := struct {
		Filename string `json:"filename"`
	}{
		Filename: filename,
	}

	logger.Info("handleUploadMediaFolder: Successfully uploaded file", zap.String("filename", filename))
	w.Header().Set("Content-Type", "application/json")
	return json.NewEncoder(w).Encode(response)
}

func (app *Application) handleDeleteMedia(w http.ResponseWriter, r *http.Request) error {
	logger := GetLoggerFromContext(r.Context())

	if r.Method != http.MethodDelete {
		logger.Warn("handleDeleteMedia: Method not allowed", zap.String("method", r.Method))
		return NewValidationError("method", "Method not allowed", nil)
	}

	filename := r.URL.Query().Get("file")
	if filename == "" {
		logger.Warn("handleDeleteMedia: Filename is required")
		return NewValidationError("filename", "Filename is required", nil)
	}

	// Ensure the filename is safe
	if strings.Contains(filename, "..") {
		logger.Warn("handleDeleteMedia: Invalid filename attempted", zap.String("filename", filename))
		return NewValidationError("filename", "Invalid filename", nil)
	}

	// Create the full path for the file
	config := app.configProvider.GetConfig()
	fullPath := filepath.Join(config.Server.MediaFolder, filename)

	// Check if file exists
	if _, err := app.fileSystem.Stat(fullPath); os.IsNotExist(err) {
		logger.Warn("handleDeleteMedia: File not found", zap.String("path", fullPath))
		return NewFileSystemError("Stat", fullPath, "File not found", err)
	}

	// Delete the file
	err := app.fileSystem.Remove(fullPath)
	if err != nil {
		return err
	}
	logger.Info("handleDeleteMedia: Successfully deleted file", zap.String("path", fullPath))

	// Also delete thumbnail if it exists
	thumbPath := filepath.Join(config.Server.MediaFolder, "thumb_"+filename)
	err = app.fileSystem.Remove(thumbPath)
	if err != nil {
		logger.Info("handleDeleteMedia: Thumbnail not found or error deleting thumbnail",
			zap.String("path", thumbPath),
			zap.Error(err),
		)
	} else {
		logger.Info("handleDeleteMedia: Successfully deleted thumbnail", zap.String("path", thumbPath))
	}

	w.WriteHeader(http.StatusOK)
	return json.NewEncoder(w).Encode(map[string]string{"status": "success"})
}

func (app *Application) createImageWithImagePig(prompt string, outputFile string) error {
	logger := app.logger
	logger.Info("createImageWithImagePig: Getting API key from configuration")

	// Get API key from configuration
	apiKey := app.config.Secrets.ImagePigAPIKey
	if apiKey == "" {
		// Fallback to environment variable for backward compatibility
		logger.Warn("createImageWithImagePig: API key not found in configuration, trying environment variable")

		// Load environment variables from .env file for backward compatibility
		if err := godotenv.Load(); err != nil {
			logger.Error("createImageWithImagePig: Error loading .env file", zap.Error(err))
			return NewFileSystemError("Load", ".env", "Error loading .env file", err)
		}

		// Get API key from environment
		apiKey = os.Getenv("IMAGEPIG_API_KEY")
		if apiKey == "" {
			logger.Warn("createImageWithImagePig: IMAGEPIG_API_KEY not found in environment")
			return NewValidationError("api_key", "IMAGEPIG_API_KEY not found in environment", nil)
		}
		logger.Info("createImageWithImagePig: IMAGEPIG_API_KEY loaded from environment")
	} else {
		logger.Info("createImageWithImagePig: API key loaded from configuration")
	}

	// Create client
	client := NewFluxClient(apiKey, logger)
	logger.Info("createImageWithImagePig: FluxClient created")

	// Generate landscape image
	logger.Info("createImageWithImagePig: Generating landscape image", zap.String("prompt", prompt))
	if err := client.GenerateLandscapeImage(prompt, outputFile); err != nil {
		return err
	}
	logger.Info("createImageWithImagePig: Image generated and saved", zap.String("path", outputFile))

	return nil
}

// Helper functions are moved to utils.go
// Types are moved to types.go

// generateSelfSignedCert generates a self-signed certificate and key for development
func generateSelfSignedCert(certFile, keyFile string, logger *Logger) error {
	logger.Info("generateSelfSignedCert: Generating self-signed certificate", zap.String("certFile", certFile), zap.String("keyFile", keyFile))

	priv, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		return fmt.Errorf("failed to generate private key: %w", err)
	}

	notBefore := time.Now()
	notAfter := notBefore.Add(365 * 24 * time.Hour) // 1 year

	serialNumberLimit := new(big.Int).Lsh(big.NewInt(1), 128)
	serialNumber, err := rand.Int(rand.Reader, serialNumberLimit)
	if err != nil {
		return fmt.Errorf("failed to generate serial number: %w", err)
	}

	template := x509.Certificate{
		SerialNumber: serialNumber,
		Subject: pkix.Name{
			Organization: []string{"AdminEditor Dev"},
			CommonName:   "localhost",
		},
		NotBefore:             notBefore,
		NotAfter:              notAfter,
		KeyUsage:              x509.KeyUsageKeyEncipherment | x509.KeyUsageDigitalSignature,
		ExtKeyUsage:           []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth},
		BasicConstraintsValid: true,
		DNSNames:              []string{"localhost"},
	}

	derBytes, err := x509.CreateCertificate(rand.Reader, &template, &template, &priv.PublicKey, priv)
	if err != nil {
		return fmt.Errorf("failed to create certificate: %w", err)
	}

	certOut, err := os.Create(certFile)
	if err != nil {
		return fmt.Errorf("failed to open %s for writing: %w", certFile, err)
	}
	if err := pem.Encode(certOut, &pem.Block{Type: "CERTIFICATE", Bytes: derBytes}); err != nil {
		return fmt.Errorf("failed to write data to %s: %w", certFile, err)
	}
	if err := certOut.Close(); err != nil {
		return fmt.Errorf("error closing %s: %w", certFile, err)
	}

	keyOut, err := os.OpenFile(keyFile, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0600)
	if err != nil {
		return fmt.Errorf("failed to open %s for writing: %w", keyFile, err)
	}
	privBytes, err := x509.MarshalPKCS8PrivateKey(priv)
	if err != nil {
		return fmt.Errorf("unable to marshal private key: %w", err)
	}
	if err := pem.Encode(keyOut, &pem.Block{Type: "PRIVATE KEY", Bytes: privBytes}); err != nil {
		return fmt.Errorf("failed to write data to %s: %w", keyFile, err)
	}
	if err := keyOut.Close(); err != nil {
		return fmt.Errorf("error closing %s: %w", keyFile, err)
	}

	logger.Info("generateSelfSignedCert: Successfully generated self-signed certificate and key")
	return nil
}
