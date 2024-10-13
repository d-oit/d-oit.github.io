package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

type ShortcodeConfig struct {
	Shortcodes map[string]string `json:"shortcodes"`
	Icons      map[string]string `json:"icons"`
}

type ServerConfig struct {
	Port           int    `json:"port"`
	ShowURLOnStart bool   `json:"showURLOnStart"`
	GermanFolder   string `json:"germanFolder"`
	EnglishFolder  string `json:"englishFolder"`
}

type Config struct {
	// Shortcodes ShortcodeConfig `json:"shortcodes"`
	Shortcodes map[string]string `json:"shortcodes"`
	Icons      map[string]string `json:"icons"`
	Server     ServerConfig      `json:"server"`
}

var config Config

func main() {
	// Load configuration
	loadConfig()

	port := config.Server.Port

	// Serve static files from the "static" directory
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/", fs)

	// Start the server on localhost with the specified port
	address := fmt.Sprintf("http://localhost:%d", port)
	fmt.Printf("Starting server at %s\n", address)
	err := http.ListenAndServe(address, nil)
	if err != nil {
		fmt.Printf("Error starting server: %s\n", err)
	}

	// API endpoints
	http.HandleFunc("/api/config", handleConfig)
	http.HandleFunc("/api/save", handleSave)
	http.HandleFunc("/api/load", handleLoad)
	http.HandleFunc("/api/list", handleList)

	// Determine the address to listen on
	addr := fmt.Sprintf(":%d", config.Server.Port)

	// Show URL on start if configured
	if config.Server.ShowURLOnStart {
		log.Printf("Server starting on http://localhost%s", addr)
	} else {
		log.Printf("Server starting on port %d", config.Server.Port)
	}

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
	absPath, err := filepath.Abs(config.Server.GermanFolder)
	if err == nil {
		config.Server.GermanFolder = absPath
	}
	absPath, err = filepath.Abs(config.Server.EnglishFolder)
	if err == nil {
		config.Server.EnglishFolder = absPath
	}
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
	json.NewEncoder(w).Encode(files)
}

func listFiles(dir string) ([]string, error) {
	var files []string
	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.IsDir() && strings.HasSuffix(info.Name(), ".md") {
			relPath, err := filepath.Rel(dir, path)
			if err != nil {
				return err
			}
			files = append(files, relPath)
		}
		return nil
	})
	return files, err
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
