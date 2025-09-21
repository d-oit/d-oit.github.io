---
author: d.o.
title: "Übersicht: AI-gestützter Ebook-Creator Workflow"
description: Komplette Übersicht zur dreiteiligen Serie über Setup, Workflow und QA/Publikation des d.o. Ebook-Creator Toolkits
date: 2025-09-16
lang: de-DE
tags:
   - AI
   - Ebook
   - Automation
   - Roo Code
   - Workflow
   - Tutorial
categories:
   - Developer Tools
thumbnail:
   url: /img/blog/ubersicht-ai-gestutzter-ebook-creator-workflow.png
   author: Gemini 2.5 Flash Image
slug: ubersicht-ai-gestutzter-ebook-creator-workflow
---

{{< alert color="info" >}}
**Repository:** [ebook-roo-code-creator @ Codeberg](https://codeberg.org/d-oit/ebook-roo-code-creator)  
**Wiki:** [Projekt-Wiki & Dokumentation](https://codeberg.org/d-oit/ebook-roo-code-creator/wiki)  
**Lizenz:** MIT  
**Demo-Buch:** "Der Grüne Hort: Hackerin gegen Konzern-Gier" – Ein 40.000 Wörter umfassender deutscher Roman
{{< /alert >}}

## Über diese Serie

Diese dreiteilige Serie führt Sie durch den kompletten Workflow des d.o. Ebook-Creators - einem Multi-Agents-Toolkit für AI-gestützte Ebook-Erstellung mit Roo Code und OpenCode CLI (angefangen noch nicht fertig aktuell).

Die Idee dazu hatte ich schon länger. Einige Anfänge Bücher, die nie zu Ende geschrieben worden sind. Gleichzeitig kam mit openrouter/sonoma-sky-alpha und openrouter/sonoma-dusk-alpha 2 kostenlose 2M-Context-Modelle die Möglichkeit, die Idee kostenlos umzusetzen und zu testen. Da das Buch, das nur für die Testerstellung hergestellt wurde, ziemlich unsinnig in Teilen sein wird – gerade der Code ist ziemlich unsinnig. Mir ging es um den grundsätzlichen Workflow und etwas zu haben, das leicht zu demonstrieren und zu erklären ist. Angepasst an OpenCode / Claude Code / andere oder komplett eine eigene Anwendung daraus zu erstellen, ist dann viel einfacher und hat durch die Parallel-Sessions oder Swarm auch gleich mehr Optimierungsmöglichkeiten.

**Sonoma AI**: All prompts and completions for this model are logged by the provider and may be used to improve the model.

Falls jemand Interesse daran haben sollte, gerne melden :-)

## Serie-Übersicht

1. **[Setup & Einrichtung](/de/blog/do-ebook-creator-workflow/setup-ai-ebook-creator)**  
   - Projekt-Überblick und Struktur
   - Voraussetzungen und Installation
   - Roo Code und OpenCode CLI Setup
   - Konfiguration und Validierung

2. **[Workflow & Agenten](/de/blog/do-ebook-creator-workflow/workflow-ai-ebook-creator)**  
   - Planung und Recherche mit MCP-Tools
   - Drafting-Phase mit ebook-writer
   - Rewriting und Expansion
   - Best Practices und Kommando-Referenz

3. **[QA & Publikation](/de/blog/do-ebook-creator-workflow/qa-publishing-ai-ebook-creator)**  
   - Automatisierte Qualitätssicherung
   - Schwarm-Analyse mit multi-perspektivischen Bewertungen
   - Batch-Verarbeitung und Automatisierung
   - Finale Publikation in EPUB, MOBI, PDF

## Key Features

- **Multi-Agenten System:** Spezialisierte Modi für jede Workflow-Phase
- **Qualitäts-Gates:** 95% Erfolgsrate vor Finalisierung
- **Automatisierung:** 70% weniger manuelle Arbeit
- **Research Integration:** MCP-Tools für Tavily und Context7
- **Logging & Metrics:** Detaillierte Nachverfolgbarkeit

## Verwendete Technologien

- **Roo Code:** VS Code Erweiterung für Agenten-Modi
- **OpenCode CLI:** Terminal-Automatisierung
- **LLM APIs:** Anthropic Claude, OpenRouter Modelle
- **Python Skripte:** Workflow-Automatisierung und Validierung
- **Pandoc:** Ebook-Format-Konvertierung

## Zielgruppe

- **Autoren und Content-Creator**, die VS Code verwenden
- **Technik-affine Schriftsteller**, die Automatisierung schätzen
- **Solo-Creatoren**, die Produktionszeit reduzieren wollen
- **Entwickler**, die AI-gestützte Workflows erkunden möchten
