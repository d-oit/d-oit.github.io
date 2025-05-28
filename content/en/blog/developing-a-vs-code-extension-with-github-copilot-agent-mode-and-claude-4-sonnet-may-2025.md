---
title: Developing a VS Code Extension with GitHub Copilot Agent Mode and Claude 4 Sonnet (May 2025)
slug: developing-code-extension-github-copilot-agent-mode-claude-4-sonnet-2025
description: This guide outlines the development of my tryout with a Visual Studio Code extension leveraging GitHub Copilot’s Agent Mode and Claude 4 Sonnet (May 2025). It covers the integration process, common challenges like branch naming and managing AI-generated files, and practical advice on handling large diffs. Additionally, it details how I use Roo Code’s chat interface with a custom judge role to validate AI-generated code changes. The guide also notes current limitations around context window visibility in Copilot and shares considerations for maintaining a stable CI pipeline.
date: 2025-05-27
tags:
  - GitHub Copilot
  - GitHub
  - Git
  - Roo Code
  - AI
  - VSCode
categories:
  - Software Development
thumbnail:
  url: /img/blog/do-vscode-lm-api-explorer-banner.png
  author: d.o.
draft: false
---

## Overview

This guide outlines the development of my tryout with a Visual Studio Code (VS Code) extension that integrates GitHub Copilot's Agent Mode using Claude 4 Sonnet (as of May 2025). It documents the integration process, shares practical lessons learned, and highlights strategies for managing AI-generated content and maintaining a clean development workflow.

## Prerequisites

* **VS Code** (version 1.90 or later) with the Language Model API enabled.
* **GitHub Copilot** subscription (Pro or Enterprise).
* **GitHub Copilot Chat** extension installed and signed in.
* Familiarity with VS Code extension development using TypeScript.

## Setting Up the Extension

This project represents the final result of integrating Claude 4 Sonnet into a GitHub Copilot Agent Mode extension and does not require cloning for setup demonstration. If you're building a similar extension from scratch, refer to the code structure and implementation details in the [public repository](https://github.com/d-oit/do-vscode-lm-api-explorer).

To inspect or run the final version locally:

1. **Install Dependencies and Compile**:

   ```bash
   npm install
   npm run compile
   ```

2. **Launch in Extension Development Host**:
   Press `F5` in VS Code to start the extension in a new Extension Development Host window.

## Integrating GitHub Copilot Agent Mode with Claude 4 Sonnet

GitHub Copilot now supports multiple AI models, including Claude 4 Sonnet, which is integrated directly within Copilot. This means you don't need a separate API key to use Claude 4 Sonnet in your extension.

To enable Claude 4 Sonnet:

1. **Activate Copilot Chat**:

   * Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
   * Select `GitHub Copilot: Chat`.

2. **Choose Claude 4 Sonnet as the Model**:

   * In the chat interface, select Claude 4 Sonnet from the model picker.[GitHub](https://docs.github.com/en/copilot/using-github-copilot/ai-models/using-claude-in-github-copilot)

*Note*: Claude 4 Sonnet is available to all paid GitHub Copilot plans after enabled.

## Handling Common Issues

### 1. Git Branch Naming

By default, the cloned repository uses `master` as the main branch. To align with modern conventions:

```bash
git branch -m master main
git fetch origin
git branch --set-upstream-to=origin/main main
```

### 2. Unwanted `.md` File Generation

Claude 4 Sonnet tends to generate `.md` files for various outputs, which can clutter your workspace. To manage this:

* Implement a cleanup script that removes outdated `.md` files not matching the current codebase.
* Run this script as part of your build or deployment process to maintain a clean workspace.

### 3. Managing Large Diffs

When applying diffs suggested by AI models:

* **Reliable Diff Application**: Writing changes to files and applying diffs works reliably with minimal issues in this setup. Performance is generally stable and fast, especially when files are properly split into smaller modules rather than large monolithic ones.
* **Split Large Files**: Break down large files into smaller modules to prevent timeouts or memory issues.
* **Incremental Application**: Apply diffs incrementally across modules to ensure stability and reduce errors.

## AI as a Judge (Diff Validation)

To assess the quality of AI-generated changes:

* **Use Roo Code**: Utilize [Roo Code](https://docs.roocode.com/features/custom-modes) in its **chat interface**, paired with a custom mode configuration and Gemini 2.5 Pro/Flash as the backing model. The `.roomodes` used in this project are tailored for tasks such as additional validation, Git operations, and technical consulting. You can review the configuration here: [roomodes file](https://github.com/d-oit/do-vscode-lm-api-explorer/blob/main/.roomodes).

This enables high-level, context-aware evaluation of your implementation without needing to paste diffs or use any CLI tools. For more, see [Roo Code Chat usage](https://docs.roocode.com/basic-usage/the-chat-interface).

## Limitations and Known Issues

### 1. Context Window Visibility

GitHub Copilot does not currently expose information about the context window size or token usage during interactions. This lack of transparency makes it difficult to manage prompt size, debug unexpected truncations, or optimize for longer code generation tasks.

### 2. Rate Limits and High Load Conditions

Claude 4 Sonnet on GitHub Copilot may become temporarily unavailable under high load, particularly during peak usage times. While most operations work smoothly, occasional delays or fallback to other models may occur. Best practice for me: wait, do not change to another model. Try again with retry or chat with "continue".

### 3. System Prompt Design (Hint)

Although GitHub does not publicly document the system prompt structure, those interested in how GitHub Copilot might structure its system prompts can refer to this Postman trace capture: [example gist](https://gist.github.com/d-oit/231f6f949cad9ea8d1804ee047581ca6).

## Continuous Integration (CI) Considerations

The existing CI pipeline may encounter issues due to:

* **Branch Naming**: Ensure your CI configuration references the correct branch (`main` instead of `master`).
* **Copilot Chat Dependency**: End-to-end (E2E) tests that depend on GitHub Copilot Chat integration are challenging to automate and remain on the TODO list for future implementation.

## Conclusion

I'm genuinely impressed by the current state of GitHub Copilot's agent mode, especially when paired with Claude Sonnet 4. The improvements in functionalities like "apply diff" and codebase search are substantial compared to earlier versions this year. However, it's important to note that this enhanced experience is available without limitations only until June 4, 2025.

Previously, using Claude Sonnet 3.7 within GitHub Copilot presented challenges, including frequent rate limiting and inconsistent performance. These issues often hindered productivity and made the development process less efficient.

With the introduction of Claude Sonnet 4, many of these problems have been addressed. The model offers a more reliable and efficient coding assistant experience, making it a valuable tool for developers.
