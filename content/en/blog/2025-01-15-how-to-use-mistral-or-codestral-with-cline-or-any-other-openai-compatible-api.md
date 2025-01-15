---
title: Use mistral or codestral API with cline
description: Learn to integrate Mistral or Codestral API with Cline and other OpenAI-compatible APIs for seamless AI functionality - completely free.
date: 2025-01-15T16:12:04.290Z
tags:
- Cline
- Codestral
- Mistral
- Roo Cline
- braintrust
categories:
- AI Tool
thumbnail:
url: images/blog/cline_codestral.png
lang: en
slug: mistral-codestral-api-cline
---

## Explanation: What is Cline and Roo Cline for Visual Studio Code?

**Cline** is a versatile tool designed to facilitate seamless integration with various AI models and APIs, enabling users to leverage advanced AI capabilities in their workflows. It provides a user-friendly interface for configuring and managing API keys, selecting models, and testing integrations.

**Roo Cline** is an extended or specialized version of Cline, often tailored for specific use cases or enhanced functionalities. It may include additional features, optimizations, or integrations that cater to more advanced or niche requirements.

## How to Use Mistral API with Cline or Cline fork

If you want to try out Cline for free, it is a good starting point to use the free Mistral API with **mistral-large-latest** or **codestral-latest**. Unfortunately, there is no direct way to use the Mistral API in Cline. However, by following these clear, step-by-step instructions, you can ensure a seamless integration.

## Step 1: Obtain a Free Mistral API Key

- **Source**: Acquire your free Mistral API key from the [Mistral AI console](https://console.mistral.ai/).

## Step 2: Access Cline Provider Settings

- Navigate to the **Provider Settings** section in Cline, as shown in the configuration image.
- Use the image as a guide to locate the settings panel.

## Step 3: Enter the API Key

- **Field**: Locate the **"API Key"** field within the Provider Settings.
- **Input**: Paste your Mistral API key into this field. **Important**: Always use the Mistral API key, not the Codestral API key.
- **Additional Settings**: Ensure any required fields, such as the API endpoint, are correctly set to **https://api.braintrust.dev/v1/proxy**.

## Step 4: Select the Correct Model

- **Model Selection**:
  - For Codestral: Enter **codestral-latest**.
  - For Mistral: Enter **mistral-large-latest**.

## Step 5: Test the Integration

- **Testing**: Enter a simple prompt to verify that the AI responds correctly. For example, create a `test.md` file with the current date.

## Step 6: Troubleshooting Common Issues

- **Common Errors**:
  - **Invalid API Key**: Verify the key's correctness and check for any typos.
  - **Model Not Found**: Ensure the model name is accurately entered.
- **Security**: Keep your API keys secure and avoid sharing them publicly.
