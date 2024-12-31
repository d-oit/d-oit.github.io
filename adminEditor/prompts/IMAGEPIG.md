package main

import (
    "bytes"
    "encoding/base64"
    "encoding/json"
    "fmt"
    "image/jpeg"
    "io/ioutil"
    "net/http"
    "os"
    "time"

    "github.com/joho/godotenv"
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
func (c *FluxClient) GenerateLandscapeImage(prompt string, outputPath string) error {
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
    body, err := ioutil.ReadAll(resp.Body)
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
    if err := ioutil.WriteFile(outputPath, imageData, 0644); err != nil {
        return fmt.Errorf("error saving image: %w", err)
    }

    return nil
}

func main() {
    // Load environment variables from .env file
    if err := godotenv.Load(); err != nil {
        fmt.Printf("Error loading .env file: %v\n", err)
        return
    }

    // Get API key from environment
    apiKey := os.Getenv("IMAGEPIG_API_KEY")
    if apiKey == "" {
        fmt.Println("IMAGEPIG_API_KEY not found in environment")
        return
    }

    // Create client
    client := NewFluxClient(apiKey)

    // Example usage
    prompt := "beautiful mountain landscape with a lake at sunset, dramatic clouds"
    outputPath := "landscape.jpg"

    fmt.Println("Generating landscape image...")
    if err := client.GenerateLandscapeImage(prompt, outputPath); err != nil {
        fmt.Printf("Error generating image: %v\n", err)
        return
    }

    fmt.Printf("Image successfully generated and saved to %s\n", outputPath)
}