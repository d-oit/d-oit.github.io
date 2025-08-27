# Agent Guidelines for d-oit.github.io

## Build/Lint/Test Commands

### Build Commands
- **Production build**: `npm run build` - Builds Hugo site with minification
- **Development build**: `npm run build:debug` - Debug build with verbose output
- **Clean build**: `npm run prebuild` - Cleans public directory and vendors dependencies

### Development Server
- **Start dev server**: `npm run start` - Hugo server with live reload
- **Production dev server**: `npm run start:prod` - Production-like dev server

### Linting
- **All linting**: `npm run lint` - Runs all linters (scripts, styles, markdown)
- **JavaScript linting**: `npm run lint:scripts` - ESLint for JS files
- **SCSS linting**: `npm run lint:styles` - Stylelint for SCSS files
- **Markdown linting**: `npm run lint:markdown` - Markdownlint for content files

### Testing
- **All tests**: `npm run test` - Runs linting (no dedicated test suite)
- **Playwright e2e tests**: `npx playwright test` - Runs end-to-end tests
- **Single test file**: `npx playwright test tests/filename.spec.js`
- **Test with UI**: `npx playwright test --ui` - Interactive test runner

### Hugo Commands
- **Hugo modules**: `npm run mod:vendor` - Vendors Hugo modules
- **Clean modules**: `npm run mod:clean` - Cleans Hugo modules cache

## Code Style Guidelines

### JavaScript
- **Linting**: ESLint with recommended rules + browser globals
- **Quotes**: Single quotes (`'`) preferred
- **Semicolons**: Required
- **Formatting**: Prettier with single quotes, Go template plugin for HTML
- **IIFE Pattern**: Use strict mode in immediately invoked function expressions
- **Error Handling**: Comprehensive try-catch blocks with detailed logging
- **Comments**: JSDoc style for functions, inline comments for complex logic

### SCSS/CSS
- **Linting**: stylelint-config-standard-scss with custom overrides
- **Naming**: Kebab-case for classes, BEM methodology encouraged
- **Variables**: SCSS variables with `$` prefix
- **Nesting**: Max 3 levels deep
- **Vendor Prefixes**: Avoid manual prefixes (autoprefixer handles)

### Go
- **Formatting**: Standard Go formatting (`gofmt`)
- **Imports**: Group standard library, third-party, local imports with blank lines
- **Error Handling**: Explicit error checking with detailed logging
- **Naming**: CamelCase for exported, camelCase for unexported
- **Struct Tags**: JSON tags for API structs
- **Logging**: Comprehensive logging with context for debugging

### Python
- **Style**: PEP 8 compliant
- **Imports**: Standard library first, then third-party, then local
- **Error Handling**: Try-except blocks with specific exception types
- **Docstrings**: Use triple quotes for function documentation
- **Naming**: snake_case for variables/functions, CamelCase for classes

### Markdown
- **Linting**: markdownlint-cli2 with standard rules
- **Front Matter**: YAML format for Hugo front matter
- **Links**: Reference-style links preferred for readability
- **Images**: Use descriptive alt text, optimize file sizes

### General
- **Line Endings**: LF (Unix) only
- **Encoding**: UTF-8
- **Indentation**: 2 spaces for JS/SCSS, tabs for Go, 4 spaces for Python
- **Max Line Length**: 120 characters
- **Commits**: Use conventional commit format
- **Security**: Never commit secrets, validate user input, use HTTPS URLs

## File Structure
- `assets/js/` - Client-side JavaScript
- `assets/scss/` - Stylesheets
- `content/` - Hugo content (English/German)
- `layouts/` - Hugo templates
- `static/` - Static assets
- `tests/` - Playwright e2e tests
- `adminEditor/` - Go backend for content management

## Dependencies
- **Frontend**: Hugo, Bootstrap, SCSS
- **JavaScript**: ESLint, Prettier
- **CSS**: Stylelint, Autoprefixer
- **Testing**: Playwright
- **Backend**: Go, various HTTP libraries

## Environment Variables
- `BASE_URL_TESTING` - For Playwright tests
- `IMAGEPIG_API_KEY` - For image generation API

