package main

import (
	"crypto/tls"
	"fmt"
	"net"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/fsnotify/fsnotify"
	"github.com/joho/godotenv"
	"github.com/spf13/viper"
	"go.uber.org/zap"
)

// LoadConfig loads configuration from multiple sources
func LoadConfig(logger *zap.Logger) (*Config, error) {
	v := viper.New()

	// Set default values
	setDefaults(v)

	// Configure Viper
	v.SetConfigName("config")   // name of config file (without extension)
	v.SetConfigType("yaml")     // REQUIRED if the config file does not have the extension in the name
	v.AddConfigPath(".")        // optionally look for config in the working directory
	v.AddConfigPath("./config") // path to look for the config file in

	// Environment specific configuration
	env := os.Getenv("APP_ENV")
	if env == "" {
		env = "development" // Default to development
		logger.Info("APP_ENV not set, defaulting to development", zap.String("env", env))
	}

	// Load .env file for development, but warn in production
	if env == "development" {
		if err := godotenv.Load(); err != nil {
			logger.Info("No .env file found or error loading .env, relying on environment variables", zap.Error(err))
		} else {
			logger.Info(".env file loaded for development. For production, use system environment variables.")
		}
	} else if env == "production" {
		if _, err := os.Stat(".env"); err == nil {
			logger.Warn(".env file found in production. For better security, use system environment variables or a secrets management system.")
		}
	}

	// Enable environment variable override (after .env is loaded)
	v.AutomaticEnv()
	v.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	// Try to load environment-specific config
	envConfigFile := fmt.Sprintf("config.%s", env)
	v.SetConfigName(envConfigFile)

	// Attempt to read the environment-specific config
	if err := v.ReadInConfig(); err != nil {
		// If environment-specific config is not found, try the default config.yaml
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			logger.Warn("Environment-specific config not found, trying default config.yaml",
				zap.String("envConfigFile", envConfigFile+".yaml"),
				zap.Error(err))

			v.SetConfigName("config")
			if err := v.ReadInConfig(); err != nil {
				if _, ok := err.(viper.ConfigFileNotFoundError); ok {
					logger.Warn("Default config.yaml not found, relying on defaults and environment variables", zap.Error(err))
				} else {
					return nil, fmt.Errorf("error reading config file: %w", err)
				}
			}
		} else {
			return nil, fmt.Errorf("error reading config file: %w", err)
		}
	} else {
		logger.Info("Loaded configuration file", zap.String("file", v.ConfigFileUsed()))
	}

	// Watch for changes and hot-reload
	v.WatchConfig()
	v.OnConfigChange(func(e fsnotify.Event) {
		logger.Info("Config file changed", zap.String("file", e.Name))
		// Re-validate configuration on change
		if err := validateConfig(v, logger); err != nil {
			logger.Error("Configuration validation failed after reload", zap.Error(err))
		}
	})

	// Unmarshal configuration
	var config Config
	if err := v.Unmarshal(&config); err != nil {
		return nil, fmt.Errorf("unable to decode config: %w", err)
	}

	// Prioritize environment variables for secrets
	if apiKey := os.Getenv("IMAGEPIG_API_KEY"); apiKey != "" {
		logger.Info("IMAGEPIG_API_KEY found in environment variables, overriding config file value.")
		config.Secrets.ImagePigAPIKey = apiKey
	} else if config.Secrets.ImagePigAPIKey != "" {
		logger.Info("IMAGEPIG_API_KEY loaded from configuration file.")
	} else {
		logger.Warn("IMAGEPIG_API_KEY not found in environment variables or configuration file. Image generation features may not work.")
	}

	// Validate configuration
	if err := validateConfig(v, logger); err != nil {
		return nil, fmt.Errorf("configuration validation failed: %w", err)
	}

	return &config, nil
}

// setDefaults sets default configuration values
func setDefaults(v *viper.Viper) {
	// Server defaults
	v.SetDefault("server.port", 8081)
	v.SetDefault("server.httpsPort", 8443)
	v.SetDefault("server.showURLOnStart", true)
	v.SetDefault("server.germanFolder", "../content/de/blog")
	v.SetDefault("server.englishFolder", "../content/en/blog")
	v.SetDefault("server.mediaFolder", "../adminEditor/static/media-data")
	v.SetDefault("server.assetFolder", "../assets/img/blog")
	v.SetDefault("server.certFile", "cert.pem")
	v.SetDefault("server.keyFile", "key.pem")
	v.SetDefault("server.redirectHTTPToHTTPS", true)

	// Image resize defaults
	v.SetDefault("server.imageResize.method", "fit")
	v.SetDefault("server.imageResize.maxWidth", 2800)
	v.SetDefault("server.thumbnailResize.method", "fit")
	v.SetDefault("server.thumbnailResize.maxWidth", 2800)

	// Shortcodes defaults (can be overridden by config file)
	v.SetDefault("shortcodes", []map[string]interface{}{
		{
			"id":      "bold",
			"code":    "**text**",
			"icon":    "bold",
			"order":   1,
			"tooltip": "Make text bold",
		},
		{
			"id":      "italic",
			"code":    "_text_",
			"icon":    "italic",
			"order":   2,
			"tooltip": "Make text italic",
		},
		// Add other default shortcodes as needed
	})
}

// validateConfig validates the configuration
func validateConfig(v *viper.Viper, logger *zap.Logger) error {
	// Validate server port
	port := v.GetInt("server.port")
	if port <= 0 || port > 65535 {
		return fmt.Errorf("invalid server port: %d. Must be between 1 and 65535", port)
	}

	// Check if port is available
	if err := checkPortAvailability(port); err != nil {
		return fmt.Errorf("server port %d is not available: %w", port, err)
	}

	// Validate HTTPS port
	httpsPort := v.GetInt("server.httpsPort")
	if httpsPort <= 0 || httpsPort > 65535 {
		return fmt.Errorf("invalid HTTPS server port: %d. Must be between 1 and 65535", httpsPort)
	}
	if port == httpsPort {
		return fmt.Errorf("HTTP port and HTTPS port cannot be the same: %d", port)
	}
	if err := checkPortAvailability(httpsPort); err != nil {
		logger.Warn("HTTPS port is not available, this might be due to another server using it or insufficient privileges. For HTTPS, a certificate and key are also required.", zap.Int("httpsPort", httpsPort), zap.Error(err))
	}

	// Validate paths
	pathsToValidate := []string{
		v.GetString("server.germanFolder"),
		v.GetString("server.englishFolder"),
		v.GetString("server.mediaFolder"),
		v.GetString("server.assetFolder"),
	}

	for _, path := range pathsToValidate {
		if path == "" {
			return fmt.Errorf("path cannot be empty")
		}

		// Convert relative path to absolute path for validation
		if !filepath.IsAbs(path) {
			absPath, err := filepath.Abs(path)
			if err != nil {
				return fmt.Errorf("failed to get absolute path for %s: %w", path, err)
			}
			path = absPath
		}

		// Check if parent directory exists, create if it doesn't (for media and asset folders)
		dir := filepath.Dir(path)
		if _, err := os.Stat(dir); os.IsNotExist(err) {
			// For media and asset folders, try to create the directory
			if strings.Contains(path, "media") || strings.Contains(path, "asset") {
				logger.Info("Directory does not exist, attempting to create it", zap.String("dir", dir))
				if err := os.MkdirAll(dir, 0755); err != nil {
					return fmt.Errorf("failed to create directory %s: %w", dir, err)
				}
			} else {
				// For content folders, just warn as they might be expected to exist
				logger.Warn("Directory does not exist", zap.String("dir", dir))
			}
		}
	}

	// Validate image resize method
	imageResizeMethod := v.GetString("server.imageResize.method")
	if imageResizeMethod != "fit" && imageResizeMethod != "fill" && imageResizeMethod != "resize" {
		return fmt.Errorf("invalid image resize method: %s. Must be 'fit', 'fill', or 'resize'", imageResizeMethod)
	}

	thumbnailResizeMethod := v.GetString("server.thumbnailResize.method")
	if thumbnailResizeMethod != "fit" && thumbnailResizeMethod != "fill" && thumbnailResizeMethod != "resize" {
		return fmt.Errorf("invalid thumbnail resize method: %s. Must be 'fit', 'fill', or 'resize'", thumbnailResizeMethod)
	}

	// Validate image resize max width
	imageResizeMaxWidth := v.GetInt("server.imageResize.maxWidth")
	if imageResizeMaxWidth <= 0 {
		return fmt.Errorf("invalid image resize max width: %d. Must be greater than 0", imageResizeMaxWidth)
	}

	thumbnailResizeMaxWidth := v.GetInt("server.thumbnailResize.maxWidth")
	if thumbnailResizeMaxWidth <= 0 {
		return fmt.Errorf("invalid thumbnail resize max width: %d. Must be greater than 0", thumbnailResizeMaxWidth)
	}

	// Validate secrets (check if environment variables are set for secrets)
	// Note: This validation is now redundant since we check this earlier in the config loading process
	// The actual validation happens in lines 99-106 where we prioritize environment variables

	// Validate certificate and key files if HTTPS is enabled
	certFile := v.GetString("server.certFile")
	keyFile := v.GetString("server.keyFile")
	if certFile != "" && keyFile != "" {
		if _, err := tls.LoadX509KeyPair(certFile, keyFile); err != nil {
			logger.Error("Failed to load certificate/key pair", zap.String("certFile", certFile), zap.String("keyFile", keyFile), zap.Error(err))
			return fmt.Errorf("failed to load certificate/key pair: %w", err)
		}
		logger.Info("Successfully loaded certificate and key for HTTPS", zap.String("certFile", certFile), zap.String("keyFile", keyFile))
	} else if v.GetBool("server.redirectHTTPToHTTPS") {
		logger.Warn("HTTPS redirection is enabled, but certFile or keyFile is not configured. HTTPS will not be available.")
	}

	logger.Info("Configuration validation passed")
	return nil
}

// checkPortAvailability checks if a port is available
func checkPortAvailability(port int) error {
	// Try to create a listener on the port
	listener, err := net.Listen("tcp", ":"+strconv.Itoa(port))
	if err != nil {
		return err
	}
	listener.Close()
	return nil
}
