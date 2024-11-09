package main

// Shortcode represents a custom shortcode configuration
type Shortcode struct {
	ID      string `json:"id"`
	Code    string `json:"code"`
	Icon    string `json:"icon"`
	Order   int    `json:"order"`
	Tooltip string `json:"tooltip"`
}

// Tag represents a blog post tag
type Tag struct {
	Name  string `json:"name"`
	Count int    `json:"count"`
}

// Category represents a blog post category
type Category struct {
	Name  string `json:"name"`
	Count int    `json:"count"`
}

// NewPostRequest represents the structure for creating a new blog post
type NewPostRequest struct {
	Title       string   `json:"title"`
	Slug        string   `json:"slug"`
	Description string   `json:"description"`
	Date        string   `json:"date"`
	Tags        []string `json:"tags"`
	Categories  []string `json:"categories"`
	Thumbnail   struct {
		URL       string `json:"url"`
		LocalFile string `json:"localFile,omitempty"`
		Author    string `json:"author,omitempty"`
		AuthorURL string `json:"authorUrl,omitempty"`
		Origin    string `json:"origin,omitempty"`
	} `json:"thumbnail"`
	Language string `json:"language"`
}

// ServerConfig represents server-specific configuration
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

// Config represents the main application configuration
type Config struct {
	Shortcodes []Shortcode  `json:"shortcodes"`
	Server     ServerConfig `json:"server"`
}

// TagsData represents the structure for storing tags
type TagsData struct {
	Tags []Tag `json:"tags"`
}

// CategoriesData represents the structure for storing categories
type CategoriesData struct {
	Categories []Category `json:"categories"`
}
