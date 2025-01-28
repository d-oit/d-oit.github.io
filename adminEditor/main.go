package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"image"
	"io"
	"io/ioutil"
	"log"
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
	ImageData    string    `json:"image_data"`
	ImageURL     string    `json:"image_url,omitempty"`
	MimeType     string    `json:"mime_type"`
	Seed         int64     `json:"seed"`
	StartedAt    time.Time `json:"started_at"`
	CompletedAt  time.Time `json:"completed_at"`
	ErrorMessage string    `json:"error,omitempty"`
}

// FluxClient handles API communication
type FluxClient struct {
	apiKey     string
	baseURL    string
	httpClient *http.Client
}

// NewFluxClient creates a new instance of FluxClient
func NewFluxClient(apiKey string) *FluxClient {
	return &FluxClient{
		apiKey:     apiKey,
		baseURL:    "https://api.imagepig.com/flux",
		httpClient: &http.Client{Timeout: 30 * time.Second},
	}
}

// GenerateLandscapeImage generates a landscape image using the FLUX API
func (c *FluxClient) GenerateLandscapeImage(prompt string, outputFile string) error {
	log.Println("GenerateLandscapeImage: Preparing request")
	// Prepare the request
	request := FluxRequest{
		Prompt:     prompt,
		Proportion: "landscape", // 1216×832 px
		Format:     "JPEG",
	}

	// Convert request to JSON
	requestBody, err := json.Marshal(request)
	if err != nil {
		log.Printf("GenerateLandscapeImage: Error marshaling request: %v", err)
		return fmt.Errorf("error marshaling request: %w", err)
	}

	// Create HTTP request
	req, err := http.NewRequest("POST", c.baseURL, bytes.NewBuffer(requestBody))
	if err != nil {
		log.Printf("GenerateLandscapeImage: Error creating request: %v", err)
		return fmt.Errorf("error creating request: %w", err)
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Api-Key", c.apiKey)

	// Send request
	log.Println("GenerateLandscapeImage: Sending request to FLUX API")
	resp, err := c.httpClient.Do(req)
	if err != nil {
		log.Printf("GenerateLandscapeImage: Error sending request: %v", err)
		return fmt.Errorf("error sending request: %w", err)
	}
	defer resp.Body.Close()

	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("GenerateLandscapeImage: Error reading response: %v", err)
		return fmt.Errorf("error reading response: %w", err)
	}

	// Check for successful status code
	if resp.StatusCode != http.StatusOK {
		log.Printf("GenerateLandscapeImage: API request failed with status %d: %s", resp.StatusCode, string(body))
		return fmt.Errorf("API request failed with status %d: %s", resp.StatusCode, string(body))
	}

	// Parse response
	var fluxResponse FluxResponse
	if err := json.Unmarshal(body, &fluxResponse); err != nil {
		log.Printf("GenerateLandscapeImage: Error parsing response: %v", err)
		return fmt.Errorf("error parsing response: %w", err)
	}

	// Check for API error
	if fluxResponse.ErrorMessage != "" {
		log.Printf("GenerateLandscapeImage: API error: %s", fluxResponse.ErrorMessage)
		return fmt.Errorf("API error: %s", fluxResponse.ErrorMessage)
	}

	// Decode base64 image
	imageData, err := base64.StdEncoding.DecodeString(fluxResponse.ImageData)
	if err != nil {
		log.Printf("GenerateLandscapeImage: Error decoding image data: %v", err)
		return fmt.Errorf("error decoding image data: %w", err)
	}

	// Save image to file
	if err := os.WriteFile(outputFile, imageData, 0644); err != nil {
		log.Printf("GenerateLandscapeImage: Error saving image: %v", err)
		return fmt.Errorf("error saving image: %w", err)
	}

	log.Printf("GenerateLandscapeImage: Image successfully saved to %s", outputFile)
	return nil
}

var config Config

func main() {
	// Load configuration
	log.Println("main: Loading configuration")
	loadConfig()

	// Serve static files from the "static" directory
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/", fs)
	log.Println("main: Serving static files from /static")

	// API endpoints
	http.HandleFunc("/api/config", handleConfig)
	http.HandleFunc("/api/save", handleSave)
	http.HandleFunc("/api/load", handleLoad)
	http.HandleFunc("/api/list", handleList)
	http.HandleFunc("/api/media-list", handleMediaList)
	http.HandleFunc("/api/process-media", handleProcessMedia)
	http.HandleFunc("/api/create-post", handleCreatePost)
	http.HandleFunc("/api/tags", handleGetTags)
	http.HandleFunc("/api/categories", handleGetCategories)
	http.HandleFunc("/api/delete-media", handleDeleteMedia)
	http.HandleFunc("/api/upload-media", handleUploadMediaFolder)

	// Updated Swagger handler
	http.Handle("/swagger/", httpSwagger.Handler(
		httpSwagger.URL("/docs/swagger.json"), // The url pointing to API definition
		httpSwagger.DeepLinking(true),
		httpSwagger.DocExpansion("none"),
		httpSwagger.DomID("swagger-ui"),
	))
	log.Println("main: Swagger UI configured")

	// Determine the address to listen on
	addr := fmt.Sprintf(":%d", config.Server.Port)

	// Show URL on start if configured
	if config.Server.ShowURLOnStart {
		log.Printf("Server starting on http://localhost%s", addr)
		log.Printf("Swagger UI available at http://localhost%s/swagger/index.html", addr)
	} else {
		log.Printf("Server starting on port %d", config.Server.Port)
	}

	// Start the server
	log.Println("main: Starting the server")
	log.Fatal(http.ListenAndServe(addr, nil))
}

func loadConfig() {
	file, err := ioutil.ReadFile("config.json")
	if err != nil {
		log.Fatalf("loadConfig: Error reading config file: %v", err)
	}

	err = json.Unmarshal(file, &config)
	if err != nil {
		log.Fatalf("loadConfig: Error parsing config file: %v", err)
	}

	// Set default values if not specified
	if config.Server.Port == 0 {
		config.Server.Port = 8080
		log.Println("loadConfig: Server Port not set, defaulting to 8080")
	}
	if config.Server.GermanFolder == "" {
		config.Server.GermanFolder = "../content/de/blog"
		log.Println("loadConfig: GermanFolder not set, defaulting to ../content/de/blog")
	}
	if config.Server.EnglishFolder == "" {
		config.Server.EnglishFolder = "../content/en/blog"
		log.Println("loadConfig: EnglishFolder not set, defaulting to ../content/en/blog")
	}

	// Convert relative paths to absolute paths
	absGermanFolder, err := filepath.Abs(config.Server.GermanFolder)
	if err != nil {
		log.Fatalf("loadConfig: Error converting GermanFolder to absolute path: %v", err)
	}
	config.Server.GermanFolder = absGermanFolder
	log.Printf("loadConfig: GermanFolder set to %s", absGermanFolder)

	absEnglishFolder, err := filepath.Abs(config.Server.EnglishFolder)
	if err != nil {
		log.Fatalf("loadConfig: Error converting EnglishFolder to absolute path: %v", err)
	}
	config.Server.EnglishFolder = absEnglishFolder
	log.Printf("loadConfig: EnglishFolder set to %s", absEnglishFolder)
}

func handleConfig(w http.ResponseWriter, r *http.Request) {
	log.Println("handleConfig: Handling config request")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(config)
}

func handleSave(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		log.Printf("handleSave: Method not allowed - %s", r.Method)
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	filename := r.URL.Query().Get("file")
	if filename == "" {
		log.Println("handleSave: Filename is required")
		http.Error(w, "Filename is required", http.StatusBadRequest)
		return
	}

	content, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Printf("handleSave: Error reading request body: %v", err)
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		return
	}

	fullPath := getFullPath(filename)
	err = ioutil.WriteFile(fullPath, content, 0644)
	if err != nil {
		log.Printf("handleSave: Error saving file %s: %v", fullPath, err)
		http.Error(w, "Error saving file", http.StatusInternalServerError)
		return
	}

	log.Printf("handleSave: Successfully saved file %s", fullPath)
	w.WriteHeader(http.StatusOK)
}

func handleLoad(w http.ResponseWriter, r *http.Request) {
	filename := r.URL.Query().Get("file")
	if filename == "" {
		log.Println("handleLoad: Filename is required")
		http.Error(w, "Filename is required", http.StatusBadRequest)
		return
	}

	fullPath := getFullPath(filename)
	content, err := ioutil.ReadFile(fullPath)
	if err != nil {
		if os.IsNotExist(err) {
			log.Printf("handleLoad: File not found: %s", fullPath)
			http.Error(w, "File not found", http.StatusNotFound)
		} else {
			log.Printf("handleLoad: Error reading file %s: %v", fullPath, err)
			http.Error(w, "Error reading file", http.StatusInternalServerError)
		}
		return
	}

	log.Printf("handleLoad: Successfully loaded file %s", fullPath)
	w.Header().Set("Content-Type", "text/plain")
	w.Write(content)
}

func handleList(w http.ResponseWriter, r *http.Request) {
	log.Println("handleList: Handling list request")
	files := make(map[string][]string)

	germanFiles, err := listFiles(config.Server.GermanFolder)
	if err != nil {
		log.Printf("handleList: Error reading German directory: %v", err)
		http.Error(w, "Error reading German directory", http.StatusInternalServerError)
		return
	}
	files["de"] = germanFiles

	englishFiles, err := listFiles(config.Server.EnglishFolder)
	if err != nil {
		log.Printf("handleList: Error reading English directory: %v", err)
		http.Error(w, "Error reading English directory", http.StatusInternalServerError)
		return
	}
	files["en"] = englishFiles

	w.Header().Set("Content-Type", "application/json")
	lang := r.URL.Query().Get("lang")
	switch lang {
	case "de":
		log.Println("handleList: Responding with German files")
		json.NewEncoder(w).Encode(germanFiles)
	case "en":
		log.Println("handleList: Responding with English files")
		json.NewEncoder(w).Encode(englishFiles)
	default:
		log.Println("handleList: Responding with all files")
		json.NewEncoder(w).Encode(files)
	}
}

func handleMediaList(w http.ResponseWriter, r *http.Request) {
	log.Println("handleMediaList: Handling media list request")
	files, err := ioutil.ReadDir(config.Server.MediaFolder)
	if err != nil {
		log.Printf("handleMediaList: Error reading media directory: %v", err)
		http.Error(w, "Error reading media directory", http.StatusInternalServerError)
		return
	}

	var mediaFiles []string
	for _, file := range files {
		if !file.IsDir() {
			mediaFiles = append(mediaFiles, file.Name())
		}
	}

	log.Printf("handleMediaList: Found %d media files", len(mediaFiles))
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(mediaFiles)
}

func handleProcessMedia(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		log.Printf("handleProcessMedia: Method not allowed - %s", r.Method)
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var request struct {
		File    string `json:"file"`
		NewName string `json:"newName"`
	}
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		log.Printf("handleProcessMedia: Invalid request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	log.Printf("handleProcessMedia: Processing media file: %s with new name: %s", request.File, request.NewName)
	newFileName, err := processMediaFile(request)
	if err != nil {
		log.Printf("handleProcessMedia: Error processing media file: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := struct {
		Filename string `json:"filename"`
	}{
		Filename: newFileName,
	}

	log.Printf("handleProcessMedia: Successfully processed media file: %s", newFileName)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func handleCreatePost(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		log.Printf("handleCreatePost: Method not allowed - %s", r.Method)
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	log.Println("handleCreatePost: Received request to create a new post")

	// Read the raw request body first for debugging
	bodyBytes, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("handleCreatePost: Error reading request body: %v", err)
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return
	}
	r.Body = io.NopCloser(bytes.NewBuffer(bodyBytes)) // Restore the body for later use

	// Log raw request for debugging
	log.Printf("handleCreatePost: Raw request body: %s", string(bodyBytes))

	var request NewPostRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		log.Printf("handleCreatePost: Invalid request body: %v, Raw body: %s", err, string(bodyBytes))
		http.Error(w, fmt.Sprintf("Invalid request body: %v", err), http.StatusBadRequest)
		return
	}

	log.Printf("handleCreatePost: Decoded request: %+v", request)

	// Validate required fields with more specific logging
	if request.Title == "" {
		log.Println("handleCreatePost: Title is missing")
		http.Error(w, "Title is required", http.StatusBadRequest)
		return
	}
	if request.Date == "" {
		log.Println("handleCreatePost: Date is missing")
		http.Error(w, "Date is required", http.StatusBadRequest)
		return
	}
	log.Printf("handleCreatePost: Validation passed - Title: %s, Date: %s", request.Title, request.Date)

	// Create filename from title
	filename := createSlug(request.Title) + ".md"
	log.Printf("handleCreatePost: Generated filename: %s from title: %s", filename, request.Title)

	if request.Slug == "" {
		request.Slug = slug.Make(request.Title)
		log.Printf("handleCreatePost: Generated slug: %s from title: %s", request.Slug, request.Title)
	}

	// Handle Thumbnail Creation with more detailed logging
	log.Printf("handleCreatePost: Starting thumbnail handling - LocalFile: %s, URL: %s",
		request.Thumbnail.LocalFile, request.Thumbnail.URL)

	if request.Thumbnail.LocalFile == "" && request.Thumbnail.URL == "" {
		newFileName := request.Slug + ".jpg"
		destFile := filepath.Join(config.Server.AssetFolder, newFileName)
		log.Printf("handleCreatePost: Thumbnail destination file: %s (AssetFolder: %s)",
			destFile, config.Server.AssetFolder)

		// Check if AssetFolder exists
		if _, err := os.Stat(config.Server.AssetFolder); os.IsNotExist(err) {
			log.Printf("handleCreatePost: AssetFolder does not exist: %s", config.Server.AssetFolder)
			if err := os.MkdirAll(config.Server.AssetFolder, 0755); err != nil {
				log.Printf("handleCreatePost: Error creating AssetFolder: %v", err)
				http.Error(w, "Error creating asset folder: "+err.Error(), http.StatusInternalServerError)
				return
			}
			log.Printf("handleCreatePost: Created AssetFolder: %s", config.Server.AssetFolder)
		}

		// Check if thumbnail file exists
		if _, err := os.Stat(destFile); err == nil {
			log.Printf("handleCreatePost: Thumbnail file already exists: %s", destFile)
		} else {
			log.Printf("handleCreatePost: Creating thumbnail using ImagePig with title: %s", request.Title)
			err := createImageWithImagePig(request.Title, destFile)
			if err != nil {
				log.Printf("handleCreatePost: Error creating thumbnail: %v", err)
				http.Error(w, fmt.Sprintf("Error creating thumbnail: %v", err), http.StatusInternalServerError)
				return
			}
			log.Printf("handleCreatePost: Successfully created thumbnail: %s", destFile)
		}
		request.Thumbnail.URL = "/img/blog/" + newFileName
		log.Printf("handleCreatePost: Set Thumbnail URL: %s", request.Thumbnail.URL)
	}

	// Process Local Thumbnail File
	if request.Thumbnail.LocalFile != "" && request.Thumbnail.URL == "" {
		log.Printf("handleCreatePost: Processing local thumbnail file: %s", request.Thumbnail.LocalFile)

		var reqMediaFile struct {
			File    string `json:"file"`
			NewName string `json:"newName"`
		}

		reqMediaFile.File = request.Thumbnail.LocalFile
		reqMediaFile.NewName = request.Slug

		newFileName, err := processMediaFile(reqMediaFile)
		if err != nil {
			log.Printf("handleCreatePost: Error processing media file: %v", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		log.Printf("handleCreatePost: Processed media file from %s to %s", request.Thumbnail.LocalFile, newFileName)
		request.Thumbnail.URL = "/img/blog/" + newFileName
	}

	// Determine the target folder based on language
	var targetFolder string
	switch request.Language {
	case "de":
		targetFolder = config.Server.GermanFolder
	case "en":
		targetFolder = config.Server.EnglishFolder
	default:
		log.Printf("handleCreatePost: Invalid language specified: %s", request.Language)
		http.Error(w, "Invalid language", http.StatusBadRequest)
		return
	}
	log.Printf("handleCreatePost: Target folder set to: %s", targetFolder)

	// Generate markdown content with logging
	log.Printf("handleCreatePost: Generating markdown content for post: %s", request.Title)
	content := generateMarkdownContent(request)
	log.Printf("handleCreatePost: Generated markdown content length: %d bytes", len(content))

	// Ensure target folder exists
	if _, err := os.Stat(targetFolder); os.IsNotExist(err) {
		log.Printf("handleCreatePost: Target folder does not exist: %s", targetFolder)
		if err := os.MkdirAll(targetFolder, 0755); err != nil {
			log.Printf("handleCreatePost: Error creating target folder: %v", err)
			http.Error(w, fmt.Sprintf("Error creating target folder: %v", err), http.StatusInternalServerError)
			return
		}
		log.Printf("handleCreatePost: Created target folder: %s", targetFolder)
	}

	// Save the file with detailed error logging
	fullPath := filepath.Join(targetFolder, filename)
	log.Printf("handleCreatePost: Attempting to save file to: %s", fullPath)
	if err := ioutil.WriteFile(fullPath, []byte(content), 0644); err != nil {
		log.Printf("handleCreatePost: Error saving file %s: %v (Content length: %d)", fullPath, err, len(content))
		http.Error(w, fmt.Sprintf("Error saving file: %v", err), http.StatusInternalServerError)
		return
	}
	log.Printf("handleCreatePost: Successfully saved post to %s (Content length: %d)", fullPath, len(content))

	// Update tags and categories in config with detailed logging
	log.Printf("handleCreatePost: Updating tags (%d) and categories (%d)", len(request.Tags), len(request.Categories))
	if err := updateTagsAndCategories(request.Tags, request.Categories); err != nil {
		log.Printf("handleCreatePost: Error updating tags and categories: %v (Tags: %v, Categories: %v)",
			err, request.Tags, request.Categories)
		http.Error(w, fmt.Sprintf("Error updating tags and categories: %v", err), http.StatusInternalServerError)
		return
	}
	log.Printf("handleCreatePost: Successfully updated %d tags and %d categories", len(request.Tags), len(request.Categories))

	// Prepare and send response with proper error handling
	w.Header().Set("Content-Type", "application/json")
	response := map[string]string{
		"filename": filename,
		"path":     fullPath,
	}
	log.Printf("handleCreatePost: Preparing response: %+v", response)

	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("handleCreatePost: Error encoding response: %v", err)
		http.Error(w, fmt.Sprintf("Error encoding response: %v", err), http.StatusInternalServerError)
		return
	}
	log.Printf("handleCreatePost: Successfully completed post creation: %s", filename)
}

func handleGetTags(w http.ResponseWriter, r *http.Request) {
	log.Println("handleGetTags: Handling get tags request")
	tags, err := getAllTags()
	if err != nil {
		log.Printf("handleGetTags: Error reading tags: %v", err)
		http.Error(w, "Error reading tags", http.StatusInternalServerError)
		return
	}

	log.Printf("handleGetTags: Retrieved %d tags", len(tags))
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tags)
}

func handleGetCategories(w http.ResponseWriter, r *http.Request) {
	log.Println("handleGetCategories: Handling get categories request")
	categories, err := getAllCategories()
	if err != nil {
		log.Printf("handleGetCategories: Error reading categories: %v", err)
		http.Error(w, "Error reading categories", http.StatusInternalServerError)
		return
	}

	log.Printf("handleGetCategories: Retrieved %d categories", len(categories))
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(categories)
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
		log.Printf("generateMarkdownContent: Error parsing date: %v", err)
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
func getAllTags() ([]Tag, error) {
	log.Println("getAllTags: Reading tags from data/tags.json")
	file, err := ioutil.ReadFile("data/tags.json")
	if err != nil {
		if os.IsNotExist(err) {
			log.Println("getAllTags: tags.json does not exist, returning empty slice")
			return []Tag{}, nil
		}
		log.Printf("getAllTags: Error reading tags.json: %v", err)
		return nil, err
	}

	var tagsData TagsData
	err = json.Unmarshal(file, &tagsData)
	if err != nil {
		log.Printf("getAllTags: Error unmarshaling tags.json: %v", err)
		return nil, err
	}

	log.Printf("getAllTags: Retrieved %d tags", len(tagsData.Tags))
	return tagsData.Tags, nil
}

// getAllCategories reads and returns all categories from the categories data file
func getAllCategories() ([]Category, error) {
	log.Println("getAllCategories: Reading categories from data/categories.json")
	file, err := ioutil.ReadFile("data/categories.json")
	if err != nil {
		if os.IsNotExist(err) {
			log.Println("getAllCategories: categories.json does not exist, returning empty slice")
			return []Category{}, nil
		}
		log.Printf("getAllCategories: Error reading categories.json: %v", err)
		return nil, err
	}

	var categoriesData CategoriesData
	err = json.Unmarshal(file, &categoriesData)
	if err != nil {
		log.Printf("getAllCategories: Error unmarshaling categories.json: %v", err)
		return nil, err
	}

	log.Printf("getAllCategories: Retrieved %d categories", len(categoriesData.Categories))
	return categoriesData.Categories, nil
}

// updateTagsAndCategories updates the tags and categories data files with new entries
func updateTagsAndCategories(newTags []string, newCategories []string) error {
	log.Println("updateTagsAndCategories: Updating tags and categories")
	// Update tags
	if err := updateTags(newTags); err != nil {
		log.Printf("updateTagsAndCategories: Error updating tags: %v", err)
		return err
	}

	// Update categories
	if err := updateCategories(newCategories); err != nil {
		log.Printf("updateTagsAndCategories: Error updating categories: %v", err)
		return err
	}

	log.Println("updateTagsAndCategories: Successfully updated tags and categories")
	return nil
}

// updateTags updates the tags data file with new tags
func updateTags(newTags []string) error {
	log.Println("updateTags: Updating tags")
	existingTags, err := getAllTags()
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
			log.Printf("updateTags: Incremented count for existing tag: %s (New count: %d)", newTag, tag.Count)
		} else {
			existingTags = append(existingTags, Tag{
				Name:  newTag,
				Count: 1,
			})
			log.Printf("updateTags: Added new tag: %s", newTag)
		}
	}

	// Create data directory if it doesn't exist
	if err := os.MkdirAll("data", 0755); err != nil {
		log.Printf("updateTags: Error creating data directory: %v", err)
		return err
	}

	// Save updated tags to file
	tagsData := TagsData{Tags: existingTags}
	jsonData, err := json.MarshalIndent(tagsData, "", "  ")
	if err != nil {
		log.Printf("updateTags: Error marshaling tags data: %v", err)
		return err
	}

	err = ioutil.WriteFile("data/tags.json", jsonData, 0644)
	if err != nil {
		log.Printf("updateTags: Error writing tags.json: %v", err)
		return err
	}

	log.Println("updateTags: Successfully updated tags.json")
	return nil
}

// updateCategories updates the categories data file with new categories
func updateCategories(newCategories []string) error {
	log.Println("updateCategories: Updating categories")
	existingCategories, err := getAllCategories()
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
			log.Printf("updateCategories: Incremented count for existing category: %s (New count: %d)", newCategory, category.Count)
		} else {
			existingCategories = append(existingCategories, Category{
				Name:  newCategory,
				Count: 1,
			})
			log.Printf("updateCategories: Added new category: %s", newCategory)
		}
	}

	// Create data directory if it doesn't exist
	if err := os.MkdirAll("data", 0755); err != nil {
		log.Printf("updateCategories: Error creating data directory: %v", err)
		return err
	}

	// Save updated categories to file
	categoriesData := CategoriesData{Categories: existingCategories}
	jsonData, err := json.MarshalIndent(categoriesData, "", "  ")
	if err != nil {
		log.Printf("updateCategories: Error marshaling categories data: %v", err)
		return err
	}

	err = ioutil.WriteFile("data/categories.json", jsonData, 0644)
	if err != nil {
		log.Printf("updateCategories: Error writing categories.json: %v", err)
		return err
	}

	log.Println("updateCategories: Successfully updated categories.json")
	return nil
}

// processMediaFile processes the media file and returns the new filename
func processMediaFile(request struct {
	File    string `json:"file"`
	NewName string `json:"newName"`
}) (string, error) {
	log.Printf("processMediaFile: Processing file %s with new name %s", request.File, request.NewName)
	sourceFile := filepath.Join(config.Server.MediaFolder, request.File)
	ext := filepath.Ext(request.File)
	newFileName := request.NewName + ext
	destFile := filepath.Join(config.Server.AssetFolder, newFileName)

	log.Printf("processMediaFile: Source file: %s, Destination file: %s", sourceFile, destFile)

	// Open the source image
	src, err := imaging.Open(sourceFile)
	if err != nil {
		log.Printf("processMediaFile: Error opening source image: %v", err)
		return "", fmt.Errorf("error opening source image: %w", err)
	}
	log.Println("processMediaFile: Source image opened successfully")

	// Get the dimensions of the source image
	srcWidth := src.Bounds().Dx()
	srcHeight := src.Bounds().Dy()
	log.Printf("processMediaFile: Source image dimensions: %dx%d", srcWidth, srcHeight)

	// Calculate the new height to maintain the aspect ratio
	newHeight := (config.Server.ImageResize.MaxWidth * srcHeight) / srcWidth
	log.Printf("processMediaFile: Calculated new height: %d", newHeight)

	// Resize the image
	var resized image.Image
	if config.Server.ImageResize.Method == "fit" {
		resized = imaging.Fit(src, config.Server.ImageResize.MaxWidth, newHeight, imaging.Lanczos)
		log.Println("processMediaFile: Image resized using 'fit' method")
	} else {
		resized = imaging.Fill(src, config.Server.ImageResize.MaxWidth, newHeight, imaging.Center, imaging.Lanczos)
		log.Println("processMediaFile: Image resized using 'fill' method")
	}

	// Save the resized image
	err = imaging.Save(resized, destFile)
	if err != nil {
		log.Printf("processMediaFile: Error saving resized image: %v", err)
		return "", fmt.Errorf("error saving resized image: %w", err)
	}
	log.Printf("processMediaFile: Resized image saved to %s", destFile)

	// Create and save thumbnail
	var thumbnail image.Image
	if config.Server.ThumbnailResize.Method == "fit" {
		thumbnail = imaging.Fit(src, config.Server.ThumbnailResize.MaxWidth, newHeight, imaging.Lanczos)
		log.Println("processMediaFile: Thumbnail resized using 'fit' method")
	} else {
		thumbnail = imaging.Fill(src, config.Server.ThumbnailResize.MaxWidth, newHeight, imaging.Center, imaging.Lanczos)
		log.Println("processMediaFile: Thumbnail resized using 'fill' method")
	}

	thumbnailFile := filepath.Join(config.Server.AssetFolder, "thumb_"+newFileName)
	err = imaging.Save(thumbnail, thumbnailFile)
	if err != nil {
		log.Printf("processMediaFile: Error saving thumbnail: %v", err)
		return "", fmt.Errorf("error saving thumbnail: %w", err)
	}
	log.Printf("processMediaFile: Thumbnail saved to %s", thumbnailFile)

	return newFileName, nil
}

func handleUploadMediaFolder(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		log.Printf("handleUploadMediaFolder: Method not allowed - %s", r.Method)
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse the multipart form data with a 32MB limit
	err := r.ParseMultipartForm(32 << 20)
	if err != nil {
		log.Printf("handleUploadMediaFolder: Error parsing form data: %v", err)
		http.Error(w, "Error parsing form data", http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		log.Printf("handleUploadMediaFolder: Error retrieving file: %v", err)
		http.Error(w, "Error retrieving file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Generate a unique filename
	ext := filepath.Ext(header.Filename)
	filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)
	fullPath := filepath.Join(config.Server.MediaFolder, filename)
	log.Printf("handleUploadMediaFolder: Saving uploaded file as %s", fullPath)

	// Create a new file in the media folder
	dst, err := os.Create(fullPath)
	if err != nil {
		log.Printf("handleUploadMediaFolder: Error creating file %s: %v", fullPath, err)
		http.Error(w, "Error creating file", http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	// Copy the uploaded file to the destination
	_, err = io.Copy(dst, file)
	if err != nil {
		log.Printf("handleUploadMediaFolder: Error saving file %s: %v", fullPath, err)
		http.Error(w, "Error saving file", http.StatusInternalServerError)
		return
	}

	// Return the filename in the response
	response := struct {
		Filename string `json:"filename"`
	}{
		Filename: filename,
	}

	log.Printf("handleUploadMediaFolder: Successfully uploaded file %s", filename)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func handleUploadMedia(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		log.Printf("handleUploadMedia: Method not allowed - %s", r.Method)
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse the multipart form data with a 32MB limit
	err := r.ParseMultipartForm(32 << 20)
	if err != nil {
		log.Printf("handleUploadMedia: Error parsing form data: %v", err)
		http.Error(w, "Error parsing form data", http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		log.Printf("handleUploadMedia: Error retrieving file: %v", err)
		http.Error(w, "Error retrieving file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Generate a unique filename
	ext := filepath.Ext(header.Filename)
	filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)
	fullPath := filepath.Join(config.Server.MediaFolder, filename)
	log.Printf("handleUploadMedia: Saving uploaded file as %s", fullPath)

	// Create a new file in the media folder
	dst, err := os.Create(fullPath)
	if err != nil {
		log.Printf("handleUploadMedia: Error creating file %s: %v", fullPath, err)
		http.Error(w, "Error creating file", http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	// Copy the uploaded file to the destination
	_, err = io.Copy(dst, file)
	if err != nil {
		log.Printf("handleUploadMedia: Error saving file %s: %v", fullPath, err)
		http.Error(w, "Error saving file", http.StatusInternalServerError)
		return
	}

	// Return the filename in the response
	response := struct {
		Filename string `json:"filename"`
	}{
		Filename: filename,
	}

	log.Printf("handleUploadMedia: Successfully uploaded file %s", filename)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func handleDeleteMedia(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		log.Printf("handleDeleteMedia: Method not allowed - %s", r.Method)
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	filename := r.URL.Query().Get("file")
	if filename == "" {
		log.Println("handleDeleteMedia: Filename is required")
		http.Error(w, "Filename is required", http.StatusBadRequest)
		return
	}

	// Ensure the filename is safe
	if strings.Contains(filename, "..") {
		log.Printf("handleDeleteMedia: Invalid filename attempted: %s", filename)
		http.Error(w, "Invalid filename", http.StatusBadRequest)
		return
	}

	// Create the full path for the file
	fullPath := filepath.Join(config.Server.MediaFolder, filename)

	// Check if file exists
	if _, err := os.Stat(fullPath); os.IsNotExist(err) {
		log.Printf("handleDeleteMedia: File not found: %s", fullPath)
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}

	// Delete the file
	err := os.Remove(fullPath)
	if err != nil {
		log.Printf("handleDeleteMedia: Error deleting file %s: %v", fullPath, err)
		http.Error(w, "Error deleting file", http.StatusInternalServerError)
		return
	}
	log.Printf("handleDeleteMedia: Successfully deleted file %s", fullPath)

	// Also delete thumbnail if it exists
	thumbPath := filepath.Join(config.Server.MediaFolder, "thumb_"+filename)
	err = os.Remove(thumbPath)
	if err != nil {
		log.Printf("handleDeleteMedia: Thumbnail not found or error deleting thumbnail %s: %v", thumbPath, err)
	} else {
		log.Printf("handleDeleteMedia: Successfully deleted thumbnail %s", thumbPath)
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "success"})
}

func createImageWithImagePig(prompt string, outputFile string) error {
	log.Println("createImageWithImagePig: Loading environment variables")
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		log.Printf("createImageWithImagePig: Error loading .env file: %v", err)
		return fmt.Errorf("Error loading .env file: %v", err)
	}

	// Get API key from environment
	apiKey := os.Getenv("IMAGEPIG_API_KEY")
	if apiKey == "" {
		log.Println("createImageWithImagePig: IMAGEPIG_API_KEY not found in environment")
		return fmt.Errorf("IMAGEPIG_API_KEY not found in environment")
	}
	log.Println("createImageWithImagePig: IMAGEPIG_API_KEY loaded successfully")

	// Create client
	client := NewFluxClient(apiKey)
	log.Println("createImageWithImagePig: FluxClient created")

	// Generate landscape image
	log.Printf("createImageWithImagePig: Generating landscape image with prompt: %s", prompt)
	if err := client.GenerateLandscapeImage(prompt, outputFile); err != nil {
		log.Printf("createImageWithImagePig: Error generating image: %v", err)
		return fmt.Errorf("Error generating image: %v", err)
	}
	log.Printf("createImageWithImagePig: Image generated and saved to %s", outputFile)

	return nil
}

// Helper functions are moved to utils.go
// Types are moved to types.go
