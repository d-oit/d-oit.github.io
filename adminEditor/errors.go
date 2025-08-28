package main

import (
	"fmt"
	"net/http"
)

// ValidationError represents an error related to input validation
type ValidationError struct {
	Field   string
	Message string
	Cause   error
}

// Error implements the error interface
func (e *ValidationError) Error() string {
	if e.Cause != nil {
		return fmt.Sprintf("validation error on field '%s': %s (cause: %v)", e.Field, e.Message, e.Cause)
	}
	return fmt.Sprintf("validation error on field '%s': %s", e.Field, e.Message)
}

// Unwrap returns the underlying cause
func (e *ValidationError) Unwrap() error {
	return e.Cause
}

// StatusCode returns the HTTP status code for this error
func (e *ValidationError) StatusCode() int {
	return http.StatusBadRequest
}

// APIError represents an error related to external API calls
type APIError struct {
	Service    string
	Endpoint   string
	Message    string
	HTTPStatus int
	Cause      error
}

// Error implements the error interface
func (e *APIError) Error() string {
	if e.Cause != nil {
		return fmt.Sprintf("API error from service '%s' on endpoint '%s': %s (status: %d, cause: %v)",
			e.Service, e.Endpoint, e.Message, e.HTTPStatus, e.Cause)
	}
	return fmt.Sprintf("API error from service '%s' on endpoint '%s': %s (status: %d)",
		e.Service, e.Endpoint, e.Message, e.HTTPStatus)
}

// Unwrap returns the underlying cause
func (e *APIError) Unwrap() error {
	return e.Cause
}

// StatusCode returns the HTTP status code for this error
func (e *APIError) StatusCode() int {
	if e.HTTPStatus != 0 {
		return e.HTTPStatus
	}
	return http.StatusInternalServerError
}

// FileSystemError represents an error related to file system operations
type FileSystemError struct {
	Operation string
	Path      string
	Message   string
	Cause     error
}

// Error implements the error interface
func (e *FileSystemError) Error() string {
	if e.Cause != nil {
		return fmt.Sprintf("file system error during operation '%s' on path '%s': %s (cause: %v)",
			e.Operation, e.Path, e.Message, e.Cause)
	}
	return fmt.Sprintf("file system error during operation '%s' on path '%s': %s",
		e.Operation, e.Path, e.Message)
}

// Unwrap returns the underlying cause
func (e *FileSystemError) Unwrap() error {
	return e.Cause
}

// StatusCode returns the HTTP status code for this error
func (e *FileSystemError) StatusCode() int {
	return http.StatusInternalServerError
}

// ErrorResponse represents a standardized error response
type ErrorResponse struct {
	Error   string `json:"error"`
	Details string `json:"details,omitempty"`
	Code    int    `json:"code"`
}

// NewValidationError creates a new ValidationError
func NewValidationError(field, message string, cause error) *ValidationError {
	return &ValidationError{
		Field:   field,
		Message: message,
		Cause:   cause,
	}
}

// NewAPIError creates a new APIError
func NewAPIError(service, endpoint, message string, statusCode int, cause error) *APIError {
	return &APIError{
		Service:    service,
		Endpoint:   endpoint,
		Message:    message,
		HTTPStatus: statusCode,
		Cause:      cause,
	}
}

// NewFileSystemError creates a new FileSystemError
func NewFileSystemError(operation, path, message string, cause error) *FileSystemError {
	return &FileSystemError{
		Operation: operation,
		Path:      path,
		Message:   message,
		Cause:     cause,
	}
}

// HTTPError is an interface for errors that can return HTTP status codes
type HTTPError interface {
	error
	StatusCode() int
}
