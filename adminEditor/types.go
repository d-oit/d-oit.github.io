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
	Port                int    `json:"port" mapstructure:"port"`
	HTTPSPort           int    `json:"httpsPort" mapstructure:"httpsPort"`
	ShowURLOnStart      bool   `json:"showURLOnStart" mapstructure:"showURLOnStart"`
	GermanFolder        string `json:"germanFolder" mapstructure:"germanFolder"`
	EnglishFolder       string `json:"englishFolder" mapstructure:"englishFolder"`
	MediaFolder         string `json:"mediaFolder" mapstructure:"mediaFolder"`
	AssetFolder         string `json:"assetFolder" mapstructure:"assetFolder"`
	CertFile            string `json:"certFile" mapstructure:"certFile"`
	KeyFile             string `json:"keyFile" mapstructure:"keyFile"`
	RedirectHTTPToHTTPS bool   `json:"redirectHTTPToHTTPS" mapstructure:"redirectHTTPToHTTPS"`
	ImageResize         struct {
		Method   string `json:"method" mapstructure:"method"`
		MaxWidth int    `json:"maxWidth" mapstructure:"maxWidth"`
	} `json:"imageResize" mapstructure:"imageResize"`
	ThumbnailResize struct {
		Method   string `json:"method" mapstructure:"method"`
		MaxWidth int    `json:"maxWidth" mapstructure:"maxWidth"`
	} `json:"thumbnailResize" mapstructure:"thumbnailResize"`
}

// SecretsConfig holds secret configuration values
type SecretsConfig struct {
	ImagePigAPIKey string `json:"imagePigAPIKey" mapstructure:"imagePigAPIKey"`
}

// Config represents the main application configuration
type Config struct {
	Shortcodes []Shortcode   `json:"shortcodes" mapstructure:"shortcodes"`
	Server     ServerConfig  `json:"server" mapstructure:"server"`
	Secrets    SecretsConfig `json:"secrets" mapstructure:"secrets"`
}

// TagsData represents the structure for storing tags
type TagsData struct {
	Tags []Tag `json:"tags"`
}

// CategoriesData represents the structure for storing categories
type CategoriesData struct {
	Categories []Category `json:"categories"`
}
