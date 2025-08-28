# Security Best Practices for adminEditor

This document outlines security best practices for deploying and maintaining the adminEditor application. Following these guidelines helps protect your application, data, and infrastructure from common threats.

## 1. Environment Configuration

### Use `APP_ENV` Appropriately

*   **Development:** Set `APP_ENV=development`. This enables developer-friendly features like automatic self-signed certificate generation and `.env` file loading.
    ```bash
    export APP_ENV=development
    ```
*   **Production:** Set `APP_ENV=production`. This disables `.env` file loading (with a warning if one is found) and encourages the use of system environment variables or a proper secrets management system.
    ```bash
    export APP_ENV=production
    ```
    Never run production applications with `APP_ENV=development`.

### Secure Configuration Files

*   **Least Privilege:** Ensure configuration files (`config.yaml`, `config.prod.yaml`) have restrictive file permissions (e.g., `600` or `640`).
    ```bash
    chmod 640 config.prod.yaml
    ```
*   **Version Control:** Do not commit sensitive information, such as API keys or database credentials, to version control. Use placeholder values or configuration templates in your repository.
*   **Environment Overrides:** Leverage environment variables to override configuration settings for different deployments (staging, production). This is handled automatically by Viper in the application.

## 2. Secrets Management

*   **Prioritize Environment Variables:** For production, always use system environment variables or a dedicated secrets management service (e.g., HashiCorp Vault, AWS Secrets Manager, Google Cloud Secret Manager, Azure Key Vault). The application is designed to prioritize environment variables over configuration file values for secrets.
*   **No `.env` in Production:** Never use `.env` files in production. They are a convenience for local development only. The application will log a warning if a `.env` file is detected when `APP_ENV=production`.
*   **Regular Rotation:** Establish a process for regularly rotating secrets, especially API keys and database credentials.
*   **Access Control:** Strictly limit access to secrets to only the personnel and services that absolutely need it.

## 3. Network Security (HTTPS)

### Always Use HTTPS in Production

*   **Encryption:** HTTPS encrypts data in transit between the client and the server, protecting it from eavesdropping and man-in-the-middle attacks.
*   **Implementation:**
    *   **Recommended:** Use a reverse proxy (e.g., Nginx, Apache, Caddy) in front of the adminEditor application to handle SSL/TLS termination. The proxy will manage certificates and serve HTTPS, while communicating with adminEditor over HTTP on a local network.
    *   **Direct:** Configure adminEditor to use HTTPS directly by providing valid TLS certificates (e.g., from Let's Encrypt) and setting `server.redirectHTTPToHTTPS: true`.
*   **HTTP to HTTPS Redirect:** Ensure all HTTP traffic is redirected to HTTPS. The application can do this itself if configured, or it can be handled by a reverse proxy.
*   **Strong TLS Configuration:**
    *   Use modern TLS protocols (TLS 1.2 or 1.3). The application defaults to `MinVersion: tls.VersionTLS12`.
    *   Use strong cipher suites. This is typically handled by the Go standard library's sensible defaults or the reverse proxy.
*   **Certificate Management:**
    *   **Validity:** Use certificates from a trusted Certificate Authority (CA).
    *   **Renewal:** Automate certificate renewal before they expire (e.g., using Certbot's cron jobs or renewal hooks).
    *   **Key Security:** Protect private key files with strict permissions (e.g., `600`).

## 4. Application Security Headers

The application includes a `SecurityHeadersMiddleware` that sets several important security headers:

*   **Content Security Policy (CSP):** `default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: https:; font-src 'self' https://cdn.jsdelivr.net; connect-src 'self'; frame-ancestors 'none';`
    *   **Purpose:** Mitigates Cross-Site Scripting (XSS), clickjacking, and other code injection attacks by defining allowed sources for content like scripts, styles, and images.
    *   **Customization:** Review and adjust the CSP policy based on your application's specific needs, especially if you load content from other domains.
*   **Strict Transport Security (HSTS):** `max-age=31536000; includeSubDomains; preload` (sent only over HTTPS)
    *   **Purpose:** Enforces the use of HTTPS by the browser, preventing downgrade attacks and cookie hijacking.
    *   **Considerations:** Be careful with `includeSubDomains` and `preload`. Ensure all subdomains support HTTPS before enabling them.
*   **X-Content-Type-Options:** `nosniff`
    *   **Purpose:** Prevents the browser from MIME-sniffing a response away from the declared `Content-Type`, reducing the risk of drive-by downloads and user-agent based XSS exploits.
*   **X-Frame-Options:** `DENY`
    *   **Purpose:** Protects against clickjacking by preventing the page from being rendered in an `<iframe>`, `<frame>`, or `<object>`.
*   **X-XSS-Protection:** `1; mode=block`
    *   **Purpose:** Enables the browser's built-in cross-site scripting filter, in blocking mode. While modern browsers have strong default XSS protection, this header provides an additional layer for older browsers.
*   **Referrer-Policy:** `strict-origin-when-cross-origin`
    *   **Purpose:** Controls how much referrer information is sent with requests. This policy helps protect user privacy by not sending the full URL as a referrer when navigating to a less secure destination.
*   **Permissions-Policy:** `camera=(), microphone=(), geolocation=()`
    *   **Purpose:** Provides a mechanism to allow or deny the use of browser features (like camera, microphone, geolocation) within the application. The current policy disables these potentially sensitive features.

## 5. Dependency Management

*   **Regular Updates:** Regularly update Go dependencies and any frontend libraries (e.g., Bootstrap, jQuery if used) to patch known vulnerabilities.
    ```bash
    go get -u ./...
    go mod tidy
    ```
*   **Vulnerability Scanning:** Use tools like `go vulncheck` (or third-party scanners) to periodically scan your dependencies for known security vulnerabilities.
    ```bash
    go install golang.org/x/vuln/cmd/govulncheck@latest
    govulncheck ./...
    ```
*   **Minimal Dependencies:** Keep the number of dependencies to a minimum to reduce the application's attack surface.

## 6. Logging and Monitoring

*   **Structured Logging:** The application uses `zap` for structured logging, which is more easily parsed by log management systems.
*   **Log Sensitive Data:** Ensure that sensitive data (e.g., API keys, passwords, PII) is never logged. The application should be reviewed to confirm this.
*   **Log Retention:** Define a log retention policy based on compliance requirements and operational needs.
*   **Monitoring:** Set up monitoring and alerting for suspicious activities or errors in the logs. Monitor for:
    *   High rates of HTTP errors (4xx, 5xx).
    *   Failed login attempts (if authentication is added).
    *   Unusual API usage patterns.
    *   Warnings related to configuration or security.

## 7. Runtime Security

*   **Principle of Least Privilege:** Run the application process with the least set of privileges necessary. Avoid running as `root` if possible.
*   **Container Security (if applicable):**
    *   Use official, minimal base images.
    *   Scan images for vulnerabilities before deployment.
    *   Do not store secrets in Docker images or Dockerfiles.
    *   Use read-only root filesystems where possible.
*   **Operating System:** Keep the host operating system and all its packages up to date with security patches.

## 8. Data Protection

*   **File Uploads:** Validate and sanitize all uploaded files. The application already has some measures in `handleUploadMediaFolder` (e.g., generating unique filenames). Ensure uploaded files cannot be executed as scripts.
*   **Data at Rest:** If the application were to store sensitive data persistently (it currently doesn't beyond media files and content), ensure it's encrypted.
*   **Data in Transit:** Ensure all external API calls (e.g., to ImagePig) are made over HTTPS. The `FluxClient` already does this.

## 9. Development and Deployment Lifecycle

*   **Code Reviews:** All code changes should undergo peer review to catch potential security issues early.
*   **Static Application Security Testing (SAST):** Integrate SAST tools into your CI/CD pipeline to automatically scan code for security flaws.
*   **Dynamic Application Security Testing (DAST):** Periodically run DAST scans on your running application to identify vulnerabilities in the deployed environment.
*   **Secure CI/CD Pipelines:** Secure your CI/CD pipelines by protecting secrets, using trusted base images, and validating dependencies.

By adhering to these best practices, you can significantly improve the security posture of your adminEditor deployment.