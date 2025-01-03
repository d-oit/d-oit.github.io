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
	// Prepare the request
	request := FluxRequest{
		Prompt:     prompt,
		Proportion: "landscape", // 1216×832 px
		Format:     "JPEG",
	}

	// Convert request to JSON
	requestBody, err := json.Marshal(request)
	if err != nil {
		return fmt.Errorf("error marshaling request: %w", err)
	}

	// Create HTTP request
	req, err := http.NewRequest("POST", c.baseURL, bytes.NewBuffer(requestBody))
	if err != nil {
		return fmt.Errorf("error creating request: %w", err)
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Api-Key", c.apiKey)

	// Send request
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("error sending request: %w", err)
	}
	defer resp.Body.Close()

	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("error reading response: %w", err)
	}

	// Check for successful status code
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("API request failed with status %d: %s", resp.StatusCode, string(body))
	}

	// Parse response
	var fluxResponse FluxResponse
	if err := json.Unmarshal(body, &fluxResponse); err != nil {
		return fmt.Errorf("error parsing response: %w", err)
	}

	// Check for API error
	if fluxResponse.ErrorMessage != "" {
		return fmt.Errorf("API error: %s", fluxResponse.ErrorMessage)
	}

	// Decode base64 image
	imageData, err := base64.StdEncoding.DecodeString(fluxResponse.ImageData)
	if err != nil {
		return fmt.Errorf("error decoding image data: %w", err)
	}

	// Save image to file
	if err := os.WriteFile(outputFile, imageData, 0644); err != nil {
		return fmt.Errorf("error saving image: %w", err)
	}

	return nil
}

var config Config

func main() {
	// Load configuration
	loadConfig()

	// Serve static files from the "static" directory
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/", fs)

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
	log.Fatal(http.ListenAndServe(addr, nil))
}

func loadConfig() {
	file, err := ioutil.ReadFile("config.json")
	if err != nil {
		log.Fatal("Error reading config file:", err)
	}

	err = json.Unmarshal(file, &config)
	if err != nil {
		log.Fatal("Error parsing config file:", err)
	}

	// Set default values if not specified
	if config.Server.Port == 0 {
		config.Server.Port = 8080
	}
	if config.Server.GermanFolder == "" {
		config.Server.GermanFolder = "../content/de/blog"
	}
	if config.Server.EnglishFolder == "" {
		config.Server.EnglishFolder = "../content/en/blog"
	}

	// Convert relative paths to absolute paths
	absGermanFolder, err := filepath.Abs(config.Server.GermanFolder)
	if err != nil {
		log.Fatalf("Error converting relative path to absolute path for German folder: %v", err)
	}
	config.Server.GermanFolder = absGermanFolder

	absEnglishFolder, err := filepath.Abs(config.Server.EnglishFolder)
	if err != nil {
		log.Fatalf("Error converting relative path to absolute path for English folder: %v", err)
	}
	config.Server.EnglishFolder = absEnglishFolder
}

func handleConfig(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(config)
}

func handleSave(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	filename := r.URL.Query().Get("file")
	if filename == "" {
		http.Error(w, "Filename is required", http.StatusBadRequest)
		return
	}

	content, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		return
	}

	fullPath := getFullPath(filename)
	err = ioutil.WriteFile(fullPath, content, 0644)
	if err != nil {
		http.Error(w, "Error saving file", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func handleLoad(w http.ResponseWriter, r *http.Request) {
	filename := r.URL.Query().Get("file")
	if filename == "" {
		http.Error(w, "Filename is required", http.StatusBadRequest)
		return
	}

	fullPath := getFullPath(filename)
	content, err := ioutil.ReadFile(fullPath)
	if err != nil {
		if os.IsNotExist(err) {
			http.Error(w, "File not found", http.StatusNotFound)
		} else {
			http.Error(w, "Error reading file", http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "text/plain")
	w.Write(content)
}

func handleList(w http.ResponseWriter, r *http.Request) {
	files := make(map[string][]string)

	germanFiles, err := listFiles(config.Server.GermanFolder)
	if err != nil {
		http.Error(w, "Error reading German directory", http.StatusInternalServerError)
		return
	}
	files["de"] = germanFiles

	englishFiles, err := listFiles(config.Server.EnglishFolder)
	if err != nil {
		http.Error(w, "Error reading English directory", http.StatusInternalServerError)
		return
	}
	files["en"] = englishFiles

	files["en"] = englishFiles

	w.Header().Set("Content-Type", "application/json")
	lang := r.URL.Query().Get("lang")
	switch lang {
	case "de":
		json.NewEncoder(w).Encode(germanFiles)
	case "en":
		json.NewEncoder(w).Encode(englishFiles)
	default:
		json.NewEncoder(w).Encode(files)
	}

	w.Header().Set("Content-Type", "application/json")

}

func handleMediaList(w http.ResponseWriter, r *http.Request) {
	files, err := ioutil.ReadDir(config.Server.MediaFolder)
	if err != nil {
		http.Error(w, "Error reading media directory", http.StatusInternalServerError)
		return
	}

	var mediaFiles []string
	for _, file := range files {
		if !file.IsDir() {
			mediaFiles = append(mediaFiles, file.Name())
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(mediaFiles)
}

func handleProcessMedia(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var request struct {
		File    string `json:"file"`
		NewName string `json:"newName"`
	}
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	newFileName, err := processMediaFile(request)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := struct {
		Filename string `json:"filename"`
	}{
		Filename: newFileName,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func handleCreatePost(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var request NewPostRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if request.Title == "" || request.Date == "" {
		http.Error(w, "Title and date are required", http.StatusBadRequest)
		return
	}

	// Create filename from title
	filename := createSlug(request.Title) + ".md"
	if request.Slug == "" {
		request.Slug = slug.Make(request.Title)
	}

	if request.Thumbnail.LocalFile == "" && request.Thumbnail.URL == "" {
		newFileName := request.Slug + ".jpg"
		destFile := filepath.Join(config.Server.AssetFolder, newFileName)
		// Check if file exists
		if _, err := os.Stat(destFile); err == nil {
			fmt.Printf("File exists already: %s\n", destFile)
		} else {
			err := createImageWithImagePig(request.Title, destFile)
			if err != nil {
				http.Error(w, "Error creating thumbnail: "+err.Error(), http.StatusInternalServerError)
				return
			}
		}
		request.Thumbnail.URL = "/img/blog/" + newFileName
	}

	if request.Thumbnail.LocalFile != "" && request.Thumbnail.URL == "" {

		// Create a variable of the struct type
		var reqMediaFile struct {
			File    string `json:"file"`
			NewName string `json:"newName"`
		}

		reqMediaFile.File = request.Thumbnail.LocalFile
		reqMediaFile.NewName = request.Slug
		// Log the processing of the media file
		log.Printf("Processing media file: %s\n", request.Thumbnail.LocalFile)

		newFileName, err := processMediaFile(reqMediaFile)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)

			return
		}

		// Log the result of the media file processing
		log.Printf("Processed media file: %s -> %s\n", request.Thumbnail.LocalFile, newFileName)

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
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid language"})
		return
	}

	// Generate markdown content
	content := generateMarkdownContent(request)

	// Save the file
	fullPath := filepath.Join(targetFolder, filename)
	if err := ioutil.WriteFile(fullPath, []byte(content), 0644); err != nil {
		http.Error(w, "Error saving file", http.StatusInternalServerError)
		return
	}

	// Update tags and categories in config
	updateTagsAndCategories(request.Tags, request.Categories)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"filename": filename})
}

func handleGetTags(w http.ResponseWriter, r *http.Request) {
	tags, err := getAllTags()
	if err != nil {
		http.Error(w, "Error reading tags", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tags)
}

func handleGetCategories(w http.ResponseWriter, r *http.Request) {
	categories, err := getAllCategories()
	if err != nil {
		http.Error(w, "Error reading categories", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(categories)
}

func createSlug(title string) string {
	// Convert to lowercase and replace spaces with hyphens
	slug := strings.ToLower(title)
	slug = strings.ReplaceAll(slug, " ", "-")
	// Remove special characters
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
		log.Printf("Error parsing date: %v", err)
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
	// Read tags from a JSON file
	file, err := ioutil.ReadFile("data/tags.json")
	if err != nil {
		if os.IsNotExist(err) {
			// Return empty array if file doesn't exist
			return []Tag{}, nil
		}
		return nil, err
	}

	var tagsData TagsData
	err = json.Unmarshal(file, &tagsData)
	if err != nil {
		return nil, err
	}

	return tagsData.Tags, nil
}

// getAllCategories reads and returns all categories from the categories data file
func getAllCategories() ([]Category, error) {
	// Read categories from a JSON file
	file, err := ioutil.ReadFile("data/categories.json")
	if err != nil {
		if os.IsNotExist(err) {
			// Return empty array if file doesn't exist
			return []Category{}, nil
		}
		return nil, err
	}

	var categoriesData CategoriesData
	err = json.Unmarshal(file, &categoriesData)
	if err != nil {
		return nil, err
	}

	return categoriesData.Categories, nil
}

// updateTagsAndCategories updates the tags and categories data files with new entries
func updateTagsAndCategories(newTags []string, newCategories []string) error {
	// Update tags
	if err := updateTags(newTags); err != nil {
		return err
	}

	// Update categories
	if err := updateCategories(newCategories); err != nil {
		return err
	}

	return nil
}

// updateTags updates the tags data file with new tags
func updateTags(newTags []string) error {
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
		} else {
			existingTags = append(existingTags, Tag{
				Name:  newTag,
				Count: 1,
			})
		}
	}

	// Create data directory if it doesn't exist
	if err := os.MkdirAll("data", 0755); err != nil {
		return err
	}

	// Save updated tags to file
	tagsData := TagsData{Tags: existingTags}
	jsonData, err := json.MarshalIndent(tagsData, "", "  ")
	if err != nil {
		return err
	}

	return ioutil.WriteFile("data/tags.json", jsonData, 0644)
}

// updateCategories updates the categories data file with new categories
func updateCategories(newCategories []string) error {
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
		} else {
			existingCategories = append(existingCategories, Category{
				Name:  newCategory,
				Count: 1,
			})
		}
	}

	// Create data directory if it doesn't exist
	if err := os.MkdirAll("data", 0755); err != nil {
		return err
	}

	// Save updated categories to file
	categoriesData := CategoriesData{Categories: existingCategories}
	jsonData, err := json.MarshalIndent(categoriesData, "", "  ")
	if err != nil {
		return err
	}

	return ioutil.WriteFile("data/categories.json", jsonData, 0644)
}

func processMediaFile(request struct {
	File    string `json:"file"`
	NewName string `json:"newName"`
}) (string, error) {
	sourceFile := filepath.Join(config.Server.MediaFolder, request.File)
	ext := filepath.Ext(request.File)
	newFileName := request.NewName + ext
	destFile := filepath.Join(config.Server.AssetFolder, newFileName)

	// Open the source image
	src, err := imaging.Open(sourceFile)
	if err != nil {
		return "", fmt.Errorf("error opening source image: %w", err)
	}

	// Get the dimensions of the source image
	srcWidth := src.Bounds().Dx()
	srcHeight := src.Bounds().Dy()

	// Calculate the new height to maintain the aspect ratio
	newHeight := (config.Server.ImageResize.MaxWidth * srcHeight) / srcWidth

	// Resize the image
	var resized image.Image
	if config.Server.ImageResize.Method == "fit" {
		resized = imaging.Fit(src, config.Server.ImageResize.MaxWidth, newHeight, imaging.Lanczos)
	} else {
		resized = imaging.Fill(src, config.Server.ImageResize.MaxWidth, newHeight, imaging.Center, imaging.Lanczos)
	}

	// Save the resized image
	err = imaging.Save(resized, destFile)
	if err != nil {
		return "", fmt.Errorf("error saving resized image: %w", err)
	}

	// Create and save thumbnail
	var thumbnail image.Image
	if config.Server.ThumbnailResize.Method == "fit" {
		thumbnail = imaging.Fit(src, config.Server.ThumbnailResize.MaxWidth, newHeight, imaging.Lanczos)
	} else {
		thumbnail = imaging.Fill(src, config.Server.ThumbnailResize.MaxWidth, newHeight, imaging.Center, imaging.Lanczos)
	}

	thumbnailFile := filepath.Join(config.Server.AssetFolder, "thumb_"+newFileName)
	err = imaging.Save(thumbnail, thumbnailFile)
	if err != nil {
		return "", fmt.Errorf("error saving thumbnail: %w", err)
	}

	return newFileName, nil
}

func handleUploadMediaFolder(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse the multipart form data with a 32MB limit
	err := r.ParseMultipartForm(32 << 20)
	if err != nil {
		http.Error(w, "Error parsing form data", http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Error retrieving file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Generate a unique filename
	ext := filepath.Ext(header.Filename)
	filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)

	// Create the full path for the new file
	fullPath := filepath.Join(config.Server.MediaFolder, filename)

	// Create a new file in the media folder
	dst, err := os.Create(fullPath)
	if err != nil {
		http.Error(w, "Error creating file", http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	// Copy the uploaded file to the destination
	_, err = io.Copy(dst, file)
	if err != nil {
		http.Error(w, "Error saving file", http.StatusInternalServerError)
		return
	}

	// Return the filename in the response
	response := struct {
		Filename string `json:"filename"`
	}{
		Filename: filename,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func handleUploadMedia(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse the multipart form data with a 32MB limit
	err := r.ParseMultipartForm(32 << 20)
	if err != nil {
		http.Error(w, "Error parsing form data", http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Error retrieving file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Generate a unique filename
	ext := filepath.Ext(header.Filename)
	filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)

	// Create the full path for the new file
	fullPath := filepath.Join(config.Server.MediaFolder, filename)

	// Create a new file in the media folder
	dst, err := os.Create(fullPath)
	if err != nil {
		http.Error(w, "Error creating file", http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	// Copy the uploaded file to the destination
	_, err = io.Copy(dst, file)
	if err != nil {
		http.Error(w, "Error saving file", http.StatusInternalServerError)
		return
	}

	// Return the filename in the response
	response := struct {
		Filename string `json:"filename"`
	}{
		Filename: filename,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func handleDeleteMedia(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	filename := r.URL.Query().Get("file")
	if filename == "" {
		http.Error(w, "Filename is required", http.StatusBadRequest)
		return
	}

	// Ensure the filename is safe
	if strings.Contains(filename, "..") {
		http.Error(w, "Invalid filename", http.StatusBadRequest)
		return
	}

	// Create the full path for the file
	fullPath := filepath.Join(config.Server.MediaFolder, filename)

	// Check if file exists
	if _, err := os.Stat(fullPath); os.IsNotExist(err) {
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}

	// Delete the file
	err := os.Remove(fullPath)
	if err != nil {
		http.Error(w, "Error deleting file", http.StatusInternalServerError)
		return
	}

	// Also delete thumbnail if it exists
	thumbPath := filepath.Join(config.Server.MediaFolder, "thumb_"+filename)
	_ = os.Remove(thumbPath) // Ignore error as thumbnail might not exist

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "success"})
}

func createImageWithImagePig(prompt string, outputFile string) error {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		return fmt.Errorf("Error loading .env file: %v", err)
	}

	// Get API key from environment
	apiKey := os.Getenv("IMAGEPIG_API_KEY")
	if apiKey == "" {
		return fmt.Errorf("IMAGEPIG_API_KEY not found in environment")
	}

	// Create client
	client := NewFluxClient(apiKey)

	// Generate landscape image
	if err := client.GenerateLandscapeImage(prompt, outputFile); err != nil {
		return fmt.Errorf("Error generating image: %v", err)
	}

	return nil
}
