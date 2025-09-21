---
lang: de-DE
title: "Teil 2: Workflow des d.o. Ebook-Creators - Drafting, Rewriting und Expansion"
description: "Der komplette Agenten-Workflow für die Ebook-Erstellung von der ersten Idee zum erweiterten Kapitel"
date: 2025-09-13T08:30:00Z
tags:
  - AI
  - Ebook
  - Workflow
  - Automation
  - Roo Code
  - Agenten
author: d.o.
layout: docs
thumbnail:
  url: /img/blog/workflow-ai-ebook-creator.png
  author: Dominik Oswald
categories:
  - Developer Tools
slug: workflow-ai-ebook-creator
aliases: /de/do-ebook-creator-workflow/workflow-ai-ebook-creator
---

{{< alert color="info" >}}
**Fortsetzung von:** [Teil 1: Setup](/de/blog/do-ebook-creator-workflow/setup-ai-ebook-creator)  
**Repository:** [ebook-roo-code-creator @ Codeberg](https://codeberg.org/d-oit/ebook-roo-code-creator)
{{< /alert >}}

## Der Agents-Workflow im Überblick

Der d.o. Ebook-Creator verwendet spezialisierte Agenten-Modi für jede Phase der Buchentwicklung. Jeder Agent hat eine klare Rolle und arbeitet mit den anderen zusammen, um qualitativ hochwertige Inhalte zu produzieren.

### Agenten nach Phase:

- **Core-Agenten:** ebook-writer (kreativer Fluss), ebook-rewriter (Stilverbesserungen)
- **QA-Agenten:** Multi-Pass (automatisiert + Schwarm); ganzheitliche Überprüfung vor final/
- **Koordination:** /handoff, /log, /review Befehle; ebook-research-coordinator für MCP

## Workflow-Schaubild: Visueller Ablauf

{{< image src="/img/blog/do-ebook-creator-workflow-overview.png" caption="Anklicken für die Gesamtansicht - Workflow-Schaubild: Visueller Ablauf" class="rounded lightbox" >}}

### Textbasierte Übersicht

Falls das Diagramm nicht rendert, hier der Ablauf als einfache Schritte:

1. **Idee & Planung**  
   📝 Definieren Sie das Buch-Thema und erstellen Sie eine Gliederung (Outline). Nutzen Sie den Agenten "ebook-architect", um Recherche-Ideen zu sammeln.

2. **Recherche**  
   🔍 Suchen Sie Fakten und Inspiration mit Tools wie Tavily (für Web-Suchen) oder Context7 (für Dokumentation). Speichern Sie alles in Ordnern wie `research/`.

3. **Erster Entwurf (Drafting)**  
   ✍️ Schreiben Sie das Kapitel mit "ebook-writer". Halten Sie es kurz (bis 2000 Wörter) und kreativ – der Agent folgt Ihrer Outline.

4. **Überarbeitung (Rewriting)**  
   🔄 Übergabe an "ebook-rewriter": Verbessern Sie Stil, Dialoge und Spannung. Der Agent macht den Text flüssiger und ansprechender.

5. **Erweiterung (Expansion)**  
   📈 Mit "ebook-expander" fügen Sie recherchierte Details hinzu, um auf die Ziel-Länge (z. B. 4000 Wörter) zu kommen.

6. **Qualitätsprüfung (Gate)**  
   ✅ Testen Sie mit "/review" auf Logik, Grammatik und Kohärenz. Bei Problemen: Zurück zur Überarbeitung. Erfolg? Speichern und nächstes Kapitel!

## Schritt-für-Schritt Workflow

### 1. Planung & Recherche

Bevor das Schreiben beginnt, wird die Grundlage gelegt:

```bash
# Wechsle in den ebook-architect Modus für die Planung
/switch-mode ebook-architect

# Erstelle SPARC-Outline für das Buch
/create-sparc-outline title:"Der Lärm der Gier" theme:"Gier vs. Resilienz, AI-Ethik in Gesundheit"

# Recherchiere themenrelevante Inhalte
/research type:medical query:"Muskelschwäche Therapien" tools:tavily depth:advanced output:file
/research type:sdg query:"Nachhaltige Unternehmensführung" tools:context7 output:file
```

Die Recherche-Ergebnisse werden automatisch in `research/medical/` und `research/sdg/` gespeichert und für spätere Integration verwendet.

### 2. Drafting-Phase

Die eigentliche Erstellung der Kapitel:

```bash
# Wechsle in den ebook-writer Modus
/switch-mode ebook-writer

# Generiere das erste Kapitel (max. 2000 Wörter pro Session)
/generate-chapter number:1 title:"Der Lärm der Gier" outline:assets/sparc-outline.md

# Protokolliere den Fortschritt
/log activity:draft agent:ebook-writer file:kapitel-1.md status:completed word_count:1850
```

Das Kapitel wird in `book/drafts/kapitel-1.md` gespeichert. Der ebook-writer fokussiert auf kreativen Fluss und hält sich an die SPARC-Vorgaben.

### 3. Rewriting & Expansion

Verbesserung und Erweiterung der Inhalte:

```bash
# Übergabe an den Rewriter für Stilverbesserungen
/handoff from:ebook-writer to:ebook-rewriter chapter:kapitel-1.md notes:"Engagement und Lesbarkeit verbessern"

# Wechsle in den ebook-rewriter Modus
/switch-mode ebook-rewriter

# Verbessere den Schreibstil
/rewrite-chapter input:book/drafts/kapitel-1.md output:book/rewritten/kapitel-1.md focus:"Dialoge, Spannung, Charakterentwicklung"

# Expansion mit recherchierten Inhalten
/switch-mode ebook-expander
/expand-chapter input:book/rewritten/kapitel-1.md output:book/expanded/kapitel-1.md research:research/medical/SDG_research.md target_words:4000
```

Der Rewriter verbessert den Schreibstil, während der Expander recherchierte Inhalte integriert und die Kapitel auf die Zielwortzahl erweitert.

## Best Practices für den Workflow

### Einzelkapitel-Fokus

Konzentrieren Sie sich immer auf ein Kapitel zur Zeit, um die Qualität zu erhalten. Parallele Agenten sind auf 10 begrenzt; verwenden Sie ebook-workflow-coordinator für Übergaben.

### Forschung-Integration

Verwenden Sie [SDG-Ziel] Platzhalter im Text, die später automatisch mit recherchierten Inhalten gefüllt werden:

```markdown
Lukas kämpfte mit seiner Muskelschwäche [SDG-Goal: Gesundheit und Wohlergehen], während die Bagger unerbittlich lärmten.
```

### Kommando-Referenz

**Essentielle Befehle:**

- `/handoff from:[agent] to:[agent] chapter:[file]` - Übergabe zwischen Agenten
- `/log activity:[type] agent:[name] file:[path]` - Protokollierung
- `/review type:[logic/grammar/spell] file:[path]` - Qualitätsprüfung
- `/research type:[sdg/medical/technical] query:[text]` - Recherche

### Beispiel aus Kapitel 1

Aus "Der Lärm der Gier" - Lukas, ein Hacker mit Muskelschwäche, kämpft gegen Baulärm von gierigen Entwicklern, was zu Cyber-Rache führt. Themen: Gier vs. Resilienz, AI-Ethik in Gesundheit.

## Nächste Schritte

Im [Teil 3: QA & Publikation](/de/blog/do-ebook-creator-workflow/qa-publishing-ai-ebook-creator) behandeln wir die Qualitätssicherung, Automatisierung und finale Publikation der Ebooks.

*Artikel-Genese: Dieser Beitrag wurde mit .roomodes, rode-digitaler-co-autor, rode-blog-generator und menschlichem Copy-Editing von Silke Buchta erstellt. AI unterstützte bei Recherche, Codebase-Analyse und Struktur; redaktionelle Feinabstimmung wurde manuell vorgenommen.*
