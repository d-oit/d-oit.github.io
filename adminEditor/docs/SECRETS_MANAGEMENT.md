# Secure Secrets Management Guide

This guide explains how to securely manage secrets for the adminEditor application, covering both development and production environments.

## Overview

Secrets are sensitive pieces of information, such as API keys, database credentials, and encryption keys. The adminEditor application uses `IMAGEPIG_API_KEY` as an example of a secret. It's crucial to handle secrets with care to prevent unauthorized access and security breaches.

This application prioritizes environment variables for secret management, which is a widely accepted best practice.

## How the Application Loads Secrets

The application loads secrets in the following order of precedence (highest to lowest):

1.  **System Environment Variables:** The application first checks for secrets set as environment variables in the operating system. This is the **recommended and most secure method** for production.
2.  **Configuration Files (`config.yaml`, `config.prod.yaml`):** If an environment variable is not found, the application will look for the secret in the loaded configuration files.
3.  **`.env` File (Development Only):** For convenience in development, if `APP_ENV` is set to `development` (or not set), the application will attempt to load secrets from a `.env` file in the project root. **This method is strongly discouraged in production.**

### Example: `IMAGEPIG_API_KEY`

The `IMAGEPIG_API_KEY` is used to authenticate with the ImagePig API for image generation.

*   **Production (Recommended):**
    Set the `IMAGEPIG_API_KEY` as a system environment variable.
    ```bash
    export IMAGEPIG_API_KEY="your_actual_api_key_here"
    ```
    Then run the application. It will automatically pick up the key.

*   **Development (Convenient):**
    1.  Create a file named `.env` in the root of the `adminEditor` directory.
    2.  Add your secret to this file:
        ```
        IMAGEPIG_API_KEY=X
        ```
        (Replace `X` with your actual development API key).
    3.  Ensure `.env` is added to your `.gitignore` to prevent accidentally committing secrets to version control.
        ```
        # .gitignore
        .env
        cert.pem
        key.pem
        ```
    4.  Run the application. It will load the key from the `.env` file.

## Production Best Practices

For production environments, relying on `.env` files or storing secrets in configuration files is insecure. Use a dedicated secrets management system.

### 1. Environment Variables

This is the simplest method for many production deployments, especially when using container orchestration platforms like Kubernetes or Docker Swarm.

*   **How it works:** Secrets are injected into the application's environment at runtime.
*   **Pros:**
    *   Simple to implement.
    *   Widely supported by deployment platforms.
    *   Keeps secrets out of the codebase.
*   **Cons:**
    *   Secrets might be visible in plain text in the hosting environment's configuration UI or logs if not handled carefully.
    *   Access control is managed at the OS or container level.
*   **Implementation:**
    *   **Docker:** Use the `--env` flag or an `env_file`.
        ```bash
        docker run --env IMAGEPIG_API_KEY="your_key" your-image
        ```
    *   **Kubernetes:** Use Kubernetes Secrets and mount them as environment variables in your Pod/Deployment definition.
        ```yaml
        # Kubernetes Secret
        apiVersion: v1
        kind: Secret
        metadata:
          name: imagepig-secret
        type: Opaque
        stringData:
          IMAGEPIG_API_KEY: "your_actual_api_key_here"
        ---
        # Kubernetes Deployment (excerpt)
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: admin-editor
        spec:
          template:
            spec:
              containers:
              - name: admin-editor
                image: your-image
                env:
                - name: IMAGEPIG_API_KEY
                  valueFrom:
                    secretKeyRef:
                      name: imagepig-secret
                      key: IMAGEPIG_API_KEY
        ```

### 2. HashiCorp Vault

Vault is a popular tool for secrets management, encryption as a service, and privileged access management.

*   **How it works:** The application authenticates with Vault using a method like AppRole or Kubernetes Auth, then fetches secrets dynamically at runtime or startup.
*   **Pros:**
    *   Centralized secrets management.
    *   Fine-grained access control and auditing.
    *   Dynamic secrets (secrets that are automatically created and have a limited lifetime).
    *   Encryption as a service.
*   **Cons:**
    *   More complex to set up and maintain.
    *   Introduces another critical service to manage.
*   **Implementation (Conceptual):**
    1.  Set up a Vault server.
    2.  Store your `IMAGEPIG_API_KEY` in Vault.
    3.  Modify the application to use a Vault client library to fetch the secret at startup. This would involve adding a new dependency and initialization logic in `main.go` or `config.go`.

### 3. AWS Secrets Manager / Google Cloud Secret Manager / Azure Key Vault

Major cloud providers offer their own secrets management services.

*   **How it works:** Similar to Vault, you store secrets in the cloud service, and the application fetches them using the cloud provider's SDK, typically leveraging IAM roles for authentication.
*   **Pros:**
    *   Managed service (less operational overhead).
    *   Integrates well with other cloud services (IAM, logging, monitoring).
    *   High availability and durability.
*   **Cons:**
    *   Vendor lock-in.
    *   Can incur costs.
    *   Requires cloud-specific SDKs and authentication setup.
*   **Implementation (Conceptual for AWS):**
    1.  Store the secret in AWS Secrets Manager.
    2.  Grant the EC2 instance or ECS task an IAM role with permission to read the secret.
    3.  Use the AWS SDK for Go to fetch the secret value in your application.

### 4. Kubernetes Secrets

As mentioned in the environment variables section, Kubernetes provides a native way to manage secrets.

*   **How it works:** Secrets are stored as Kubernetes objects and can be mounted as files in a volume or injected as environment variables.
*   **Pros:**
    *   Native to Kubernetes.
    *   Base64 encoded (not encrypted by default, but can be integrated with KMS for encryption-at-rest).
    *   Decoupled from Pod definitions.
*   **Cons:**
    *   Base64 is not encryption; anyone with access to the Kubernetes API can decode them unless additional encryption is enabled.
    *   Management can be cumbersome for a large number of secrets without additional tooling.

## Development Best Practices

While `.env` files are convenient for development, follow these guidelines to maintain good security hygiene:

1.  **Always `.gitignore` `.env`:** Ensure `.env` is in your `.gitignore` file to prevent committing secrets to your repository.
    ```
    # .gitignore
    .env
    *.pem
    *.key
    ```
2.  **Use Placeholder Values in Example Files:** The `example.env` file should contain placeholder values or instructions, not real secrets.
    ```
    # example.env
    # Copy this file to .env and replace with your actual values
    IMAGEPIG_API_KEY=YOUR_IMAGEPIG_API_KEY_HERE
    ```
3.  **Limit Access:** Restrict read/write permissions to the `.env` file to only the necessary developer accounts.
4.  **Communicate Clearly:** Inform your team that `.env` files are for local development only and should never be used in production.

## Summary of Recommendations

| Environment | Recommended Method | Why? |
| :--- | :--- | :--- |
| **Production** | **Cloud Secrets Manager (e.g., AWS SM, GCP SM, Azure KV) or HashiCorp Vault** | Offers the highest level of security with features like encryption-at-rest, fine-grained access control, auditing, and dynamic secrets. |
| **Production (Simpler Setups)** | **System Environment Variables (via Kubernetes/Docker)** | Easier to implement than dedicated secrets managers. Keeps secrets out of code. Suitable for less complex deployments. |
| **Development** | **`.env` file (with `.gitignore`)** | Convenient for local development. Allows developers to manage their own local secret values without affecting others. |

By following these practices, you can ensure that your application's secrets are managed securely throughout the development and deployment lifecycle.