# OpenCode Framework Test Runner - Docker Image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy OpenCode framework files
COPY .opencode/ .opencode/

# Install any dependencies if needed
RUN apk add --no-cache bash curl

# Set the default command
CMD ["bash", ".opencode/tests/run-tests.sh"]