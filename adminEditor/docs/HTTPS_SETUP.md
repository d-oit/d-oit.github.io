# HTTPS Setup Guide

This guide explains how to set up HTTPS for the adminEditor application, covering both development and production environments.

## Overview

The adminEditor application supports HTTPS to secure communication between the client and the server. It can automatically generate self-signed certificates for development and supports using official certificates for production.

## Development Setup

For development, the application can automatically generate and use self-signed certificates.

### Automatic Self-Signed Certificate Generation

1.  **Ensure `APP_ENV` is set to `development`** (or not set, as it defaults to `development`).
    ```bash
    export APP_ENV=development
    ```
2.  **Run the application.** If `server.certFile` and `server.keyFile` are not configured in your `config.dev.yaml` or via environment variables, the application will automatically generate `cert.pem` and `key.pem` in the root directory.
    ```bash
    go run .
    ```
3.  **Access the application.** Open your browser and navigate to `https://localhost:8443` (or the configured HTTPS port).
    *   You will see a browser warning about the self-signed certificate. This is expected. Click "Advanced" and "Proceed to localhost" to continue.

### Manual Self-Signed Certificate (Optional)

If you prefer to generate certificates manually, you can use `openssl`:

```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=localhost"
```

Then, configure the paths in your `config.dev.yaml`:
```yaml
server:
  certFile: "cert.pem"
  keyFile: "key.pem"
  httpsPort: 8443
  redirectHTTPToHTTPS: true
```

## Production Setup

For production, you should use certificates from a trusted Certificate Authority (CA) like Let's Encrypt, DigiCert, or your organization's internal CA.

### Using Let's Encrypt (Certbot)

Let's Encrypt provides free, automated certificates. Certbot is a popular tool to obtain and renew them.

1.  **Install Certbot:** Follow the instructions on the [Certbot website](https://certbot.eff.org/) for your operating system and web server (if you're using a reverse proxy like Nginx or Apache).
2.  **Obtain a Certificate:** Run Certbot to obtain a certificate for your domain.
    ```bash
    # Example for Nginx
    sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
    ```
    This will automatically configure Nginx and place the certificates (usually in `/etc/letsencrypt/live/yourdomain.com/`).

3.  **Configure adminEditor:**
    *   **Option A: With a Reverse Proxy (Recommended)**
        If you are using a reverse proxy like Nginx or Apache, the proxy will handle SSL termination. You would run adminEditor on HTTP (e.g., port 8081) and configure the proxy to serve HTTPS.

        *Nginx Example Snippet:*
        ```nginx
        server {
            listen 443 ssl;
            server_name yourdomain.com www.yourdomain.com;

            ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
            ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
            include /etc/letsencrypt/options-ssl-nginx.conf;
            ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

            location / {
                proxy_pass http://localhost:8081; # Point to adminEditor's HTTP port
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
            }
        }

        server {
            listen 80;
            server_name yourdomain.com www.yourdomain.com;
            return 301 https://$host$request_uri;
        }
        ```
        In this case, you don't need to configure `certFile` and `keyFile` in adminEditor. Set `APP_ENV=production`.

    *   **Option B: Direct HTTPS with adminEditor**
        If you are not using a reverse proxy, you can configure adminEditor to use the Let's Encrypt certificates directly.

        1.  Ensure the application has read access to the certificate and key files.
        2.  Set the `APP_ENV` to `production`.
            ```bash
            export APP_ENV=production
            ```
        3.  Configure the certificate and key paths via environment variables or your `config.prod.yaml`:
            ```yaml
            server:
              port: 80 # Optional: for HTTP to HTTPS redirect
              httpsPort: 443
              certFile: "/etc/letsencrypt/live/yourdomain.com/fullchain.pem"
              keyFile: "/etc/letsencrypt/live/yourdomain.com/privkey.pem"
              redirectHTTPToHTTPS: true
            ```
            Or via environment variables:
            ```bash
            export SERVER_PORT=80
            export SERVER_HTTPSPORT=443
            export SERVER_CERTFILE="/etc/letsencrypt/live/yourdomain.com/fullchain.pem"
            export SERVER_KEYFILE="/etc/letsencrypt/live/yourdomain.com/privkey.pem"
            export SERVER_REDIRECTHTTPTOHTTPS=true
            ```
        4.  Run the application. You might need `sudo` to bind to port 443.
            ```bash
            sudo go run .
            ```

### Using Other Certificate Authorities

If you are using certificates from another CA, the process is similar to using Let's Encrypt without Certbot's automation:

1.  Place your certificate and private key files in a secure location on your server.
2.  Ensure the application has read access to these files.
3.  Set `APP_ENV=production`.
4.  Configure the `server.certFile` and `server.keyFile` settings in your `config.prod.yaml` or via environment variables to point to your certificate files.
5.  Run the application.

## Configuration Options

HTTPS behavior is controlled by several configuration options, which can be set in YAML configuration files or as environment variables.

| YAML Path | Environment Variable | Description | Default |
| :--- | :--- | :--- | :--- |
| `server.httpsPort` | `SERVER_HTTPSPORT` | The port for the HTTPS server to listen on. | `8443` |
| `server.certFile` | `SERVER_CERTFILE` | Path to the TLS certificate file. | `"cert.pem"` |
| `server.keyFile` | `SERVER_KEYFILE` | Path to the TLS private key file. | `"key.pem"` |
| `server.redirectHTTPToHTTPS` | `SERVER_REDIRECTHTTPTOHTTPS`| If `true`, starts an HTTP server that redirects all traffic to HTTPS. | `true` |

## Security Considerations

*   **File Permissions:** Ensure your private key files (e.g., `key.pem`) have restrictive permissions (e.g., `600`).
    ```bash
    chmod 600 key.pem
    ```
*   **Certificate Renewal:** Automate the renewal of your production certificates (e.g., using Certbot's renewal timers or cron jobs) to avoid service interruptions.
*   **HSTS:** The application includes HTTP Strict Transport Security (HSTS) headers when serving over HTTPS. This tells browsers to only communicate with your site over HTTPS, enhancing security.
*   **Reverse Proxy:** Using a reverse proxy like Nginx or Apache in front of adminEditor is a common and recommended practice for production. It can handle SSL termination, load balancing, and other web server tasks more efficiently.