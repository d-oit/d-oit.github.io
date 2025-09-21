---
lang: de-DE
title: "Teil 1: Setup der AI-gestützte Ebook-Erstellung"
description: Einrichtung des Multi-Agenten-Toolkits für Ebook-Erstellung mit Roo Code
date: 2025-09-14T09:30:00Z
tags:
  - Hugo
  - AI
  - Ebook
  - Automation
  - Roo Code
  - Setup
author: d.o.
layout: docs
thumbnail:
  url: /img/blog/setup-ai-ebook-creator.png
  author: Gemini 2.5 Flash Image
categories:
  - Developer Tools
slug: setup-ai-ebook-creator
aliases: /de/do-ebook-creator-workflow/setup-ai-ebook-creator
---

{{< alert color="info" >}}
**Repository:** [ebook-roo-code-creator @ Codeberg](https://codeberg.org/d-oit/ebook-roo-code-creator)  
**Wiki:** [Projekt-Wiki & Dokumentation](https://codeberg.org/d-oit/ebook-roo-code-creator/wiki)  
**Lizenz:** MIT  
**Demo-Buch:** "Der Grüne Hort: Hackerin gegen Konzern-Gier" – Ein 27872 Wörter umfassender deutscher Roman über Unternehmensgier, Hacking und persönliche Gesundheitskämpfe. Basierend auf SDGs – die 17 Nachhaltigkeitsziele der UN zum Veranschaulichen von Recherche, Code Überprüfung im Buch, Buchzusammenstellung, Grammatik und Logik Ablauf.
{{< /alert >}}

## Projekt-Überblick

Der d.o. Ebook-Creator mit AI ist ein Demonstrations-Toolkit, das Multi-Agenten-KI für die Ebook-Entwicklung zeigt. Es erstellt "Der Grüne Hort: Hackerin gegen Konzern-Gier" aus Originalinhalten von Dominik Oswald, erweitert durch LLM-APIs zu einem vollständigen Roman. Kernwerkzeuge sind Roo Code (VS Code-Erweiterung für Agenten-Modi) und OpenCode CLI (Terminal-Automatisierung). Das System gewährleistet narrative Konsistenz, Qualitätskontrollen (Fehlerrate <5%) und Nachverfolgbare durch Logs.

**Machbarkeit:** Ideal für Autoren, die VS Code verwenden; Einrichtungskosten sind niedrig (API ~$0,01-0,05 pro Seite – oder kostenlose Modelle nutzen), mit hohem Nutzen (3-5x schnellere QA durch Automatisierung). **Einschränkungen:** LLM-Halluzinationen erfordern menschliche Überprüfung; skalierbar für Sachbücher mit benutzerdefinierten Modi.

Hinweis: Mit Roo Code ist es leider nicht so einfach mit Nicht-Claude Modellen komplett flüssig zu arbeiten. Das aktuell Project mit Roo Code ist nur ein Proof of Concept (Machbarkeitsnachweis).

## Projekt-Struktur

```bash
book/                 # Inhalts-Stadien
├── drafts/           # Initiale Kapitel (kapitel-{N}.md)
├── rewritten/        # Verbesserte Versionen
├── final/            # Publikationsreif
└── assets/           # Recherche, Diagramme, SPARC-Spezifikationen
logs/                 # Agenten-Ausgaben
├── grammar/          # Grammatik-Korrekturen
├── spellcheck/       # Rechtschreibungs-Logs
├── logic/            # Konsistenz-Prüfungen
├── review/           # Qualitätsbewertungen
├── analysis/         # Schwarm-Berichte
└── workflow/         # Prozessverfolgung
research/             # Bezogene Materialien
├── sdg/              # Nachhaltige Entwicklungsziele
├── medical/          # Gesundheitsrecherche (z.B. myasthenie-ähnliche Zustände)
└── technical/        # AI/ethische Dokumente
scripts/              # Utilities (config-validator.py, workflow-automation.py)
config/               # ebook-config.yaml (Agenten, Metriken, MCP-Einstellungen)
.roo/                 # Agenten-Regeln und Modi
```

## Quickstart

### Voraussetzungen

- **VS Code** (oder Cursor/VSCodium)
- **LLM API-Schlüssel** (Anthropic Claude empfohlen; OpenRouter für kostenlose Optionen)
- **Python 3.8+** (installiere PyYAML und psutil via pip für Skripte)

### Roo Code Setup (Primär)

1. **Installiere Roo Code**: VS Code Extensions → Suche "Roo Code" ([Marketplace](https://marketplace.visualstudio.com/items?itemName=RooVeterinaryInc.roo-cline)).
2. **Konfiguriere**: Füge API-Schlüssel/Modell in den Einstellungen hinzu (OpenRouter oder andere).
3. **Lade Projekt**: Klone das Repo, öffne in VS Code; führe `/init` für automatische Analyse aus (erzeugt AGENTS.md).

### OpenCode CLI Install (Optional)

```bash
curl -fsSL https://opencode.ai/install | bash
opencode auth login
cd /pfad/zum/projekt
opencode /init
```

### Konfiguration & Validierung

Bearbeite `config/ebook-config.yaml`, um benutzerdefinierte Einstellungen zu konfigurieren (z.B. `target_word_count: 40000`, `quality.metrics.track_error_rate: true`).

```bash
python scripts/config-validator.py config/ebook-config.yaml --verbose
python scripts/config-validator.py --save-schema config/schema.json
```

## Verwendete LLM APIs

Das Projekt unterstützt verschiedene LLM-APIs für Agenten-Operationen, wurde aber mit folgenden spezifischen Modellen entwickelt:

| Modell | Anbieter | Zweck |
|--------|----------|-------|
| openrouter/sonoma-dusk-alpha * | OpenRouter | Fortgeschrittenes Denken und Analyse-Aufgaben |
| openrouter/sonoma-sky-alpha * | OpenRouter | Kreatives Schreiben und Inhaltsgenerierung |
| zai-org/GLM-4.5-Air | Zai.org | Allgemeine AI-Aufgaben und Code-Analyse |
| openrouter/R1 | OpenRouter | Denken / AI-Code / Schwarm-Analyse |

- Kostenlose Testmodelle mit 2 Millionen Kontext-Fenster. Das gesamte Projekt war ursprünglich ein Test für diese Modelle und entwickelte sich zu diesem Projekt.

## Nächste Schritte

Im [Teil 2: Workflow](/de/blog/do-ebook-creator-workflow/workflow-ai-ebook-creator) gehen wir auf den eigentlichen Workflow ein: Drafting, Rewriting und Expansion der Kapitel mit den verschiedenen Agenten-Modi.

*Artikel-Genese: Dieser Beitrag wurde mit .roomodes, rode-digitaler-co-autor, rode-blog-generator und menschlichem Copy-Editing von Silke Buchta erstellt. AI unterstützte bei Recherche, Codebase-Analyse und Struktur; redaktionelle Feinabstimmung wurde manuell vorgenommen.*
