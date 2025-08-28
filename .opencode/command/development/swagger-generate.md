---
description: Auto-generate Swagger documentation from Go code using swag tool
agent: build
---

# Swagger Generate Command

Generate Swagger/OpenAPI documentation from Go code annotations automatically.

**Usage:**
/swagger-generate [--output OUTPUT_DIR] [--format FORMAT] [--host HOST] [--basePath BASEPATH] [--clean]

**Options:**
- `--output`: Output directory for generated files (default: ./docs)
- `--format`: Output format - json, yaml, or both (default: both)
- `--host`: API host (default: localhost:8080)
- `--basePath`: Base path for API (default: /)
- `--clean`: Clean output directory before generation

**Examples:**
- `/swagger-generate` - Generate Swagger docs with default settings
- `/swagger-generate --output ./api-docs --format json` - Generate JSON docs in custom directory
- `/swagger-generate --host api.example.com --basePath /v1` - Generate with custom host and base path
- `/swagger-generate --clean --format yaml` - Clean and generate YAML only

**Implementation:**
!swag init --output $OUTPUT_DIR --format $FORMAT --host $HOST --basePath $BASEPATH --clean=$CLEAN

**Files:**
@docs/swagger.json
@docs/swagger.yaml
@main.go
@go.mod
@docs/docs.go