package main

import (
	"net/http"
	"os"
	"path/filepath"
)

// ImageGenerator defines the interface for image generation services
type ImageGenerator interface {
	GenerateLandscapeImage(prompt string, outputFile string) error
}

// FileSystem defines the interface for file system operations
type FileSystem interface {
	ReadFile(filename string) ([]byte, error)
	WriteFile(filename string, data []byte, perm os.FileMode) error
	ReadDir(dirname string) ([]os.FileInfo, error)
	MkdirAll(path string, perm os.FileMode) error
	Remove(name string) error
	Stat(name string) (os.FileInfo, error)
	Create(name string) (*os.File, error)
	Walk(root string, walkFn filepath.WalkFunc) error
}

// HTTPClient defines the interface for HTTP client operations
type HTTPClient interface {
	Do(req *http.Request) (*http.Response, error)
}

// ConfigProvider defines the interface for configuration operations
type ConfigProvider interface {
	GetConfig() Config
	LoadConfig() error
}

// ImageProcessingService defines the interface for image processing operations
type ImageProcessingService interface {
	ProcessMediaFile(request MediaProcessRequest) (string, error)
}

// MediaProcessRequest represents the request structure for processing a media file
type MediaProcessRequest struct {
	File    string `json:"file"`
	NewName string `json:"newName"`
}
