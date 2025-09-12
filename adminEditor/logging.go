package main

import (
	"context"
	"net/http"
	"os"
	"time"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// LoggerKey is the key used to store the logger in the request context
type LoggerKey struct{}

// RequestIDKey is the key used to store the request ID in the request context
type RequestIDKey struct{}

// Logger wraps the zap logger for application-specific logging
type Logger struct {
	*zap.Logger
}

// NewLogger creates a new structured logger
func NewLogger() (*Logger, error) {
	// Set the log level based on environment variable
	logLevel := zapcore.InfoLevel
	if os.Getenv("LOG_LEVEL") == "debug" {
		logLevel = zapcore.DebugLevel
	}

	// Configure the encoder config
	encoderConfig := zapcore.EncoderConfig{
		TimeKey:        "timestamp",
		LevelKey:       "level",
		NameKey:        "logger",
		CallerKey:      "caller",
		FunctionKey:    zapcore.OmitKey,
		MessageKey:     "message",
		StacktraceKey:  "stacktrace",
		LineEnding:     zapcore.DefaultLineEnding,
		EncodeLevel:    zapcore.LowercaseLevelEncoder,
		EncodeTime:     zapcore.ISO8601TimeEncoder,
		EncodeDuration: zapcore.SecondsDurationEncoder,
		EncodeCaller:   zapcore.ShortCallerEncoder,
	}

	// Create the core
	core := zapcore.NewCore(
		zapcore.NewJSONEncoder(encoderConfig),
		zapcore.AddSync(os.Stdout),
		logLevel,
	)

	// Create the logger
	logger := zap.New(core, zap.AddCaller(), zap.AddCallerSkip(1))

	return &Logger{Logger: logger}, nil
}

// WithRequest creates a new logger with request context
func (l *Logger) WithRequest(r *http.Request) *Logger {
	// Extract request ID from context or generate a new one
	requestID := r.Context().Value(RequestIDKey{})
	if requestID == nil {
		requestID = generateRequestID()
	}

	// Create a new logger with request context
	return &Logger{
		Logger: l.Logger.With(
			zap.String("request_id", requestID.(string)),
			zap.String("method", r.Method),
			zap.String("path", r.URL.Path),
			zap.String("remote_addr", r.RemoteAddr),
			zap.String("user_agent", r.UserAgent()),
		),
	}
}

// WithError creates a new logger with error context
func (l *Logger) WithError(err error) *Logger {
	return &Logger{
		Logger: l.Logger.With(zap.Error(err)),
	}
}

// WithField creates a new logger with an additional field
func (l *Logger) WithField(key string, value interface{}) *Logger {
	return &Logger{
		Logger: l.Logger.With(zap.Any(key, value)),
	}
}

// WithFields creates a new logger with additional fields
func (l *Logger) WithFields(fields map[string]interface{}) *Logger {
	zapFields := make([]zap.Field, 0, len(fields))
	for key, value := range fields {
		zapFields = append(zapFields, zap.Any(key, value))
	}
	return &Logger{
		Logger: l.Logger.With(zapFields...),
	}
}

// LogHTTPRequest logs HTTP request details
func (l *Logger) LogHTTPRequest(r *http.Request, duration time.Duration, statusCode int) {
	l.WithRequest(r).Info("HTTP request",
		zap.Duration("duration", duration),
		zap.Int("status_code", statusCode),
	)
}

// LogError logs an error with context
func (l *Logger) LogError(r *http.Request, err error, message string) {
	if r != nil {
		l.WithRequest(r).WithError(err).Error(message)
	} else {
		l.WithError(err).Error(message)
	}
}

// generateRequestID generates a unique request ID
func generateRequestID() string {
	return time.Now().Format("20060102150405.000000000")
}

// RequestIDMiddleware is middleware that adds a request ID to the context
func RequestIDMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Generate or extract request ID
		requestID := r.Header.Get("X-Request-ID")
		if requestID == "" {
			requestID = generateRequestID()
		}

		// Add request ID to response headers
		w.Header().Set("X-Request-ID", requestID)

		// Add request ID to context
		ctx := context.WithValue(r.Context(), RequestIDKey{}, requestID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// LoggingMiddleware is middleware that logs HTTP requests
func LoggingMiddleware(logger *Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()

			// Wrap the response writer to capture status code
			wrapped := &responseWriter{w, http.StatusOK}

			// Call the next handler
			next.ServeHTTP(wrapped, r)

			// Log the request
			logger.LogHTTPRequest(r, time.Since(start), wrapped.status)
		})
	}
}

// responseWriter is a wrapper around http.ResponseWriter that captures the status code
type responseWriter struct {
	http.ResponseWriter
	status int
}

// WriteHeader captures the status code
func (rw *responseWriter) WriteHeader(code int) {
	rw.status = code
	rw.ResponseWriter.WriteHeader(code)
}

// GetLoggerFromContext extracts the logger from the context
func GetLoggerFromContext(ctx context.Context) *Logger {
	if logger, ok := ctx.Value(LoggerKey{}).(*Logger); ok {
		return logger
	}
	// Return a default logger if none is found in context
	logger, _ := NewLogger()
	return logger
}

// WithLogger adds a logger to the context
func WithLogger(ctx context.Context, logger *Logger) context.Context {
	return context.WithValue(ctx, LoggerKey{}, logger)
}
