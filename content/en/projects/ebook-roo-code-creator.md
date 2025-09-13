---
title: "d.o. Ebook-Creator: AI-Powered Ebook Creation Toolkit"
description: "Multi-agent AI toolkit for ebook creation using Roo Code"
date: 2025-09-12T10:06:00.000Z
tags:
  - Hugo
  - AI
  - Ebook
  - Automation
  - Roo Code
author: d.o.
layout: docs
thumbnail:
  url: img/project-ebook-roo-code-creator.png
  origin: Gemini 2.5 Flash Image (Nano Banana)
  author: d.o.
excludeToc: false
lang: en-US
slug: do-ebook-roo-code-creator
categories:
  - Developer Tools
---

{{< alert color="info" >}}
**Repository:** [ebook-roo-code-creator @ Codeberg](https://codeberg.org/d-oit/ebook-roo-code-creator)  
**Wiki:** [Project Wiki & Docs](https://codeberg.org/d-oit/ebook-roo-code-creator/wiki)  
**License:** MIT  
**Demo Book:** "Der Lärm der Gier" – A 40,000-word German novel exploring corporate greed, hacking, and personal health struggles.
{{< /alert >}}

## Project Overview

The d.o. Ebook-Creator with AI is a demonstration toolkit showcasing multi-agent AI for ebook development. It builds "Der Lärm der Gier" from original content by Dominik Oswald, expanded via LLM APIs into a full novel. Core tools: Roo Code (VS Code extension for agent modes) and OpenCode CLI (terminal automation). The system ensures narrative consistency, quality gates (error rate <5%), and traceability through logs.

Feasibility: Ideal for authors with VS Code; setup costs low (API ~$0.01-0.05 per page - or use free models), benefits high (3-5x faster QA via automation). Limitations: LLM hallucinations require human review; scalable to non-fiction with custom modes.

## Key Features

- **Modular Agent Workflows**: Specialized modes for drafting (ebook-writer, max 2,000 words/session), rewriting (ebook-rewriter for flow/clarity), expansion (ebook-expander to 40,000 words), and review (ebook-reviewer with multi-pass checks).
- **Quality Assurance**: ebook-spellchecker, ebook-grammar-checker, ebook-logic-checker; ebook-analysis-swarm uses RYAN/FLASH/SOCRATES personas for multi-perspective evaluation. Chapters pass 95% quality gates before finalization.
- **Research Integration**: MCP tools (Tavily for web search, Context7 for docs) via /research commands; caches SDG/medical/technical data (e.g., 30-day retention for SDG queries).
- **Logging & Metrics**: Detailed logs in subfolders (grammar/, logic/, workflow/); tracks word count, reading level, error rates. Auto-archive after 30 days.
- **Automation Scripts**: Python utilities for batch processing, performance monitoring, and log consolidation (see Quickstart).
- **Security**: Path sanitization, safe YAML loading, JSON schema validation in configs/scripts.
- **Project Structure**:
  ```
  book/                 # Content stages
  ├── drafts/           # Initial chapters (kapitel-{N}.md)
  ├── rewritten/        # Improved versions
  ├── final/            # Publication-ready
  └── assets/           # Research, diagrams, SPARC specs
  logs/                 # Agent outputs
  ├── grammar/          # Grammar fixes
  ├── spellcheck/       # Spelling logs
  ├── logic/            # Consistency checks
  ├── review/           # Quality assessments
  ├── analysis/         # Swarm reports
  └── workflow/         # Process tracking
  research/             # Sourced materials
  ├── sdg/              # Sustainable Development Goals
  ├── medical/          # Health research (e.g., myasthenia-like conditions)
  └── technical/        # AI/ethical docs
  scripts/              # Utilities (config-validator.py, workflow-automation.py)
  config/               # ebook-config.yaml (agents, metrics, MCP settings)
  .roo/                 # Agent rules and modes
  ```

Sample from Kapitel 1 ("Der Lärm der Gier"): Lukas, a hacker with muscle weakness, battles construction noise from greedy developers, leading to cyber-revenge. Themes: Greed vs. resilience, AI ethics in health.

## Quickstart

### Prerequisites
- VS Code (or Cursor/VSCodium)
- LLM API key (Anthropic Claude recommended; OpenRouter for cost-free options)
- Python 3.8+ (pip install PyYAML psutil for scripts)

### Roo Code Setup (Primary)
1. Install Roo Code: VS Code Extensions → Search "Roo Code" ([Marketplace](https://marketplace.visualstudio.com/items?itemName=RooVeterinaryInc.roo-cline)).
2. Configure: Add API key/model in settings (OpenRouter or other).
3. Load Project: Clone repo, open in VS Code; run /init for auto-analysis (generates AGENTS.md).

### OpenCode CLI Install (Optional)
```
curl -fsSL https://opencode.ai/install | bash
opencode auth login
cd /path/to/project
opencode /init
```

### Configuration & Validation
Edit `config/ebook-config.yaml` for custom settings (e.g., target_word_count: 40000, quality.metrics.track_error_rate: true).
```
python scripts/config-validator.py config/ebook-config.yaml --verbose
python scripts/config-validator.py --save-schema config/schema.json
```

### Sample Workflow
Follow phases from HOW-TO-CREATE-BOOKS.md:

1. **Planning/Research**:
   - Switch to ebook-architect mode: Create SPARC outline.
   - `/research type:medical query:"muscle weakness therapies" tools:tavily depth:advanced output:file` → Saves to research/medical/.

2. **Drafting**:
   - ebook-writer mode: Generate single chapter (e.g., kapitel-1.md in book/drafts/).
   - `/log activity:draft agent:ebook-writer file:kapitel-1.md status:completed`.

3. **Rewriting & Expansion**:
   - `/handoff from:ebook-writer to:ebook-rewriter chapter:kapitel-1.md notes:"Enhance engagement"`.
   - ebook-expander: Add depth/research; save to book/rewritten/.

4. **QA**:
   - Automated: ebook-grammar-checker, ebook-logic-checker → Logs in respective folders.
   - Swarm: ebook-analysis-swarm for narrative review.
   - `/review type:logic file:book/rewritten/kapitel-1.md priority:high`.

5. **Automation**:
   - Batch: `python scripts/workflow-automation.py --batch-rewrite` (processes multiple chapters).
   - Metrics: `python scripts/performance-monitor.py --report --days 7` (tracks execution time).
   - Logs: `python scripts/log-consolidator.py --consolidate --days 7 --format markdown`.

6. **Publication**:
   - ebook-publication-formatter: Format finals, generate TOC.
   - Move to book/final/; validate with quality gates.

Parallel agents limited to 10; use ebook-workflow-coordinator for handoffs.

## Agent Workflows & Best Practices

Agents per phase:
- **Core**: ebook-writer (creative flow), ebook-rewriter (style improvements).
- **QA**: Multi-pass (automated + swarm); holistic review before final/.
- **Coordination**: /handoff, /log, /review commands; ebook-research-coordinator for MCP.

Best Practices:
- Single-chapter focus to maintain quality.
- Integrate research with [SDG-Goal] placeholders.
- Weekly log reviews; quarterly process improvements.
- Custom modes via create-mode agent.

## Troubleshooting

- **Agent Mode Issues**: Verify .roomodes; reinstall Roo Code.
- **MCP Failures**: Check API keys/rate limits; enable caching in config.
- **Validation Errors**: Run config-validator.py; ensure directory permissions.
- **Workflow Gaps**: Use workflow-automation.py --validate; resume from checkpoints.
- **Quality Fails**: Revert to drafts/; swarm analysis for root causes.

For recovery: Auto-resume enabled; checkpoint every 30 min.

## Feasibility & Extensions

High feasibility for solo creators: Automates 70% of editing/QA, reducing time from weeks to days. Cost-benefit: ROI via reusable workflows; extend to English/non-fiction by adjusting config.language. Future: Integrate more MCP tools for multimedia.

*Article genesis: This post was created using .roomodes, rode-digitaler-co-autor, rode-blog-generator, and human copy-editing by Silke Buchta. AI assisted with research, codebase analysis, and structure; editorial fine-tuning was handled manually.*
