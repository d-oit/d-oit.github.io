---
description: Organize and clean Go module dependencies using go mod tidy
agent: development
---

# Go Mod Tidy Command

Organize and clean Go module dependencies by adding missing module requirements and removing unused ones.

**Usage:**
/go-mod-tidy [arguments]

**Options:**
- No standard options, but arguments can be passed through for advanced usage

**Examples:**
- `/go-mod-tidy` - Clean and organize Go module dependencies
- `/go-mod-tidy -v` - Run with verbose output (if supported)

**Implementation:**
!go mod tidy $ARGUMENTS

**Files:**
@go.mod
@go.sum

**Notes:**
- This command ensures go.mod and go.sum are consistent with the source code
- It adds any missing module requirements and removes unused dependencies
- Run this after adding or removing imports to keep dependencies clean