---
title: d.o.it - ebook-roo-code-creator: AI-Powered Ebook Creation Toolkit
description: Multi-agent AI ebook creator toolkit with Roo Code and OpenCode—automate writing, editing, QA, and content workflows.
date: 2025-09-13T10:06:00.000Z
tags:
- Hugo
- AI
- Ebook
- Automation
- Documentation
author: d.o.
layout: docs
excludeToc: false
lang: en-US
slug: project-ebook-roo-code-creator
categories:
- Developer Tools
draft: true
---

{{< badge text="d.o. AI Ebook Multi-Agent" type="tip" />}}

{{< blocks/cover
  title="ebook-roo-code-creator"
  image="img/projects/ebook-roo-code-creator/cover.jpg"
  color="primary"
  height="min"
  >}}
AI-powered ebook coder for collaborative, automated content workflows via Roo Code and OpenCode.  
Create, manage, and refine ebooks with modular agents in a VS Code-centric environment.
{{< /blocks/cover >}}

{{< blocks/lead >}}
A sample project and best-practice workflow for harnessing AI-enabled, multi-agent orchestration—optimized for book writing, editing, management, and QA with end-to-end VS Code and CLI integration.
{{< /blocks/lead >}}

{{< img src="img/projects/ebook-roo-code-creator/editor-ai-sample.jpg" title="Editor AI in action" caption="AI orchestrating ebook content in the VS Code editor" >}}

{{< alert color="info" >}}
**Repository:** [ebook-roo-code-creator @ Codeberg](https://codeberg.org/d-oit/ebook-roo-code-creator)  
**Wiki:** [Project Wiki & Docs](https://codeberg.org/d-oit/ebook-roo-code-creator/wiki)
**License:** MIT  
{{< /alert >}}

## Key Features

- Modular agent workflows for drafting, rewriting, and review
- VS Code: Roo Code extension with integrated feedback loop
- OpenCode CLI: Terminal-first agent workflows
- Includes real-world ebook sample ("Der Lärm der Gier" in German)
- Logging for grammar, logic, spellchecking, and automation
- Organized project structure for content, logs, research, and agent config

## Quickstart

### Prerequisites
- VS Code or compatible editor (Cursor, VSCodium)
- API key for LLM agent providers

### Roo Code Setup
1. Install the **Roo Code** extension in VS Code
2. Add your provider API key via extension settings
3. Set a supported model (Anthropic Claude, OpenRouter, etc.)

### OpenCode CLI Install
```
curl -fsSL https://opencode.ai/install | bash
```
Configure OpenCode:
```
opencode auth login
cd /path/to/project
opencode /init
```

### Collaborative Workflow Example
- Use Roo Code or OpenCode CLI to activate agents
- Agents assist with writing, editing, QA, and feedback in real time
- Folder structure keeps drafts, logs, and research separate for optimal workflow


