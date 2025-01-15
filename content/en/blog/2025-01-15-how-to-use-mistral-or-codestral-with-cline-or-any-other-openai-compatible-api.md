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

If you want to try out cline for free it is a good starting point to use the free Mistral API with **mistral-large-latest** or **codestral-latest**. Unfortunately there is no direct way to to use Mistral API in cline.

Follow these clear, step-by-step instructions to ensure a seamless integration.

## Step 1: Obtain a Free Mistral API Key

- **Source**: Acquire your free Mistral API key from the Mistral AI console.

### Step 2: Access Cline Provider Settings

- Navigate to the Provider Settings section in Cline, as shown in the configuration image.
- Use the image as a guide to locate the settings panel.

## Step 3: Enter the API Key

- **Field**: Locate the "API Key" field within the Provider Settings.
- **Input**: Paste your Mistral API key into this field. Important: use always the Mistral API key. Not the codestral api key.
- **Additional Settings**: Ensure any required fields, such as the API endpoint, are correctly set to **https://api.braintrust.dev/v1/proxy**

## Step 4: Select the Correct Model

- **Model Selection**:
  - For Codestral: Enter **codestral-latest**
  - For Mistral: Enter **mistral-large-latest**

### Step 6: Test the Integration

- **Testing**: Enter a simple prompt to verify that the AI responds correctly, e.g. create a test.md file with the current date.

### Step 7: Troubleshooting Common Issues

- **Common Errors**:
  - **Invalid API Key**: Verify the key's correctness and check for any typos.
  - **Model Not Found**: Ensure the model name is accurately entered.
- **Security**: Keep your API keys secure and avoid sharing them publicly.
