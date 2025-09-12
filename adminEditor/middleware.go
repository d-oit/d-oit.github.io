package main

import (
	"encoding/json"
	"net/http"

	"go.uber.org/zap"
)

// ErrorHandlerMiddleware is middleware that handles errors consistently across all HTTP handlers
func ErrorHandlerMiddleware(logger *Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Create a context with the logger
			ctx := WithLogger(r.Context(), logger.WithRequest(r))

			// Wrap the response writer to capture status code
			wrapped := &responseWriter{w, http.StatusOK}

			// Call the next handler with the updated context
			defer func() {
				if err := recover(); err != nil {
					// Log the panic
					logger.WithRequest(r).Error("Panic recovered",
						zap.Any("panic", err),
						zap.Stack("stack"),
					)

					// Send a 500 error response
					sendErrorResponse(w, r, http.StatusInternalServerError, "Internal server error", "")
				}
			}()

			next.ServeHTTP(wrapped, r.WithContext(ctx))

			// If the status code is an error status, log it
			if wrapped.status >= 400 {
				logger.WithRequest(r).Error("HTTP error response",
					zap.Int("status_code", wrapped.status),
				)
			}
		})
	}
}

// SecurityHeadersMiddleware adds security headers to HTTP responses
func SecurityHeadersMiddleware(logger *Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Add Content Security Policy
			// This is a basic CSP. Adjust according to your application's needs.
			w.Header().Set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: https:; font-src 'self' https://cdn.jsdelivr.net; connect-src 'self'; frame-ancestors 'none';")

			// Add Strict Transport Security (HSTS) for HTTPS
			// Only enable HSTS if the connection is secure (HTTPS)
			if r.URL.Scheme == "https" {
				w.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
			}

			// Prevent MIME-type sniffing
			w.Header().Set("X-Content-Type-Options", "nosniff")

			// Prevent clickjacking
			w.Header().Set("X-Frame-Options", "DENY")

			// Enable XSS protection (modern browsers have built-in protection, but this doesn't hurt)
			w.Header().Set("X-XSS-Protection", "1; mode=block")

			// Referrer Policy
			w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")

			// Permissions Policy (formerly Feature Policy)
			w.Header().Set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

			// Remove server info (optional, but good for security by obscurity)
			w.Header().Set("Server", "")

			logger.Debug("SecurityHeadersMiddleware: Applied security headers")
			next.ServeHTTP(w, r)
		})
	}
}

// HandleError is a helper function to handle errors in HTTP handlers
func HandleError(w http.ResponseWriter, r *http.Request, err error) {
	logger := GetLoggerFromContext(r.Context())

	// Log the error with context
	logger.LogError(r, err, "Error handling request")

	// Determine the HTTP status code
	var statusCode int
	if httpErr, ok := err.(HTTPError); ok {
		statusCode = httpErr.StatusCode()
	} else {
		statusCode = http.StatusInternalServerError
	}

	// Send the error response
	sendErrorResponse(w, r, statusCode, err.Error(), "")
}

// sendErrorResponse sends a standardized error response
func sendErrorResponse(w http.ResponseWriter, r *http.Request, statusCode int, message, details string) {
	// Set the content type
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	// Create the error response
	errorResponse := ErrorResponse{
		Error:   message,
		Details: details,
		Code:    statusCode,
	}

	// Encode and send the response
	if err := json.NewEncoder(w).Encode(errorResponse); err != nil {
		// If we can't encode the error response, just log it
		logger := GetLoggerFromContext(r.Context())
		logger.LogError(r, err, "Failed to encode error response")
	}
}

// WithErrorHandling wraps an HTTP handler with centralized error handling
func WithErrorHandling(handler func(http.ResponseWriter, *http.Request) error) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := handler(w, r); err != nil {
			HandleError(w, r, err)
		}
	}
}

// WithValidation wraps an HTTP handler with input validation
func WithValidation(handler func(http.ResponseWriter, *http.Request, interface{}) error, validator func(interface{}) error) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Parse the request body
		var data interface{}
		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			HandleError(w, r, NewValidationError("request_body", "Invalid request body", err))
			return
		}

		// Validate the data
		if err := validator(data); err != nil {
			HandleError(w, r, err)
			return
		}

		// Call the handler
		if err := handler(w, r, data); err != nil {
			HandleError(w, r, err)
		}
	}
}
