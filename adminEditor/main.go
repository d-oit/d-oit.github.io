package main

import (
	"encoding/json"
	"fmt"
	"image"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/disintegration/imaging"
	"github.com/gosimple/slug"
)

type Shortcode struct {
	ID      string `json:"id"`
	Code    string `json:"code"`
	Icon    string `json:"icon"`
	Order   int    `json:"order"`
	Tooltip string `json:"tooltip"`
}

type Tag struct {
	Name  string `json:"name"`
	Count int    `json:"count"`
}

type Category struct {
	Name  string `json:"name"`
	Count int    `json:"count"`
}

type NewPostRequest struct {
	Title       string   `json:"title"`
	Slug        string   `json:"slug"`
	Description string   `json:"description"`
	Date        string   `json:"date"`
	Tags        []string `json:"tags"`
	Categories  []string `json:"categories"`
	Thumbnail   struct {
		URL       string `json:"url"`
		Author    string `json:"author,omitempty"`
		AuthorURL string `json:"authorUrl,omitempty"`
		Origin    string `json:"origin,omitempty"`
	} `json:"thumbnail"`
	Language string `json:"language"`
}

type ServerConfig struct {
	Port           int    `json:"port"`
	ShowURLOnStart bool   `json:"showURLOnStart"`
	GermanFolder   string `json:"germanFolder"`
	EnglishFolder  string `json:"englishFolder"`
	MediaFolder    string `json:"mediaFolder"`
	AssetFolder    string `json:"assetFolder"`
	ImageResize    struct {
		Method   string `json:"method"`
		MaxWidth int    `json:"maxWidth"`
	} `json:"imageResize"`
	ThumbnailResize struct {
		Method   string `json:"method"`
		MaxWidth int    `json:"maxWidth"`
	} `json:"thumbnailResize"`
}

type Config struct {
	Shortcodes []Shortcode  `json:"shortcodes"`
	Server     ServerConfig `json:"server"`
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

	// Determine the address to listen on
	addr := fmt.Sprintf(":%d", config.Server.Port)

	// Show URL on start if configured
	if config.Server.ShowURLOnStart {
		log.Printf("Server starting on http://localhost%s", addr)
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

func listFiles(dir string) ([]string, error) {
	var files []string
	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if !info.IsDir() && strings.HasSuffix(info.Name(), ".md") {
			relPath, err := filepath.Rel(dir, path)
			if err != nil {
				return err
			}
			files = append(files, relPath)
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	return files, nil
}

func getFullPath(filename string) string {
	parts := strings.SplitN(filename, "/", 2)
	if len(parts) != 2 {
		return filename
	}

	lang, file := parts[0], parts[1]
	switch lang {
	case "de":
		return filepath.Join(config.Server.GermanFolder, file)
	case "en":
		return filepath.Join(config.Server.EnglishFolder, file)
	default:
		return filename
	}
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
	var request struct {
		File    string `json:"file"`
		NewName string `json:"newName"`
	}

	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	sourceFile := filepath.Join(config.Server.MediaFolder, request.File)
	ext := filepath.Ext(request.File)
	newFileName := request.NewName + ext
	destFile := filepath.Join(config.Server.AssetFolder, newFileName)

	// Open the source image
	src, err := imaging.Open(sourceFile)
	if err != nil {
		http.Error(w, "Error opening source image", http.StatusInternalServerError)
		return
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
		http.Error(w, "Error saving resized image", http.StatusInternalServerError)
		return
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
		http.Error(w, "Error saving thumbnail", http.StatusInternalServerError)
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

	// Determine the target folder based on language
	var targetFolder string
	switch request.Language {
	case "de":
		targetFolder = config.Server.GermanFolder
	case "en":
		targetFolder = config.Server.EnglishFolder
	default:
		http.Error(w, "Invalid language", http.StatusBadRequest)
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
	sb.WriteString(fmt.Sprintf("title: %s\n", post.Title))
	post.Slug = slug.Make(post.Title)
	sb.WriteString(fmt.Sprintf("slug: %s\n", post.Slug))
	if post.Description != "" {
		sb.WriteString(fmt.Sprintf("description: %s\n", post.Description))
	}
	sb.WriteString(fmt.Sprintf("date: %s\n", post.Date))

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

	sb.WriteString("---\n")
	return sb.String()
}

// Tag and Category related structures
type TagsData struct {
	Tags []Tag `json:"tags"`
}

type CategoriesData struct {
	Categories []Category `json:"categories"`
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
