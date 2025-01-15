---
title: "Cline Testen: Mistral AI API Kostenlos Nutzen"
description: Mistral AI API kostenlos mit Cline verwenden – Schritt-für-Schritt-Anleitung zur Integration und Fehlerbehebung.
date: 2025-01-15T16:52:33.612Z
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
lang: de
slug: cline-testen-mistral-ai-api-kostenlos-nutzen
---

## Erklärung: Was ist Cline und Roo Cline für Visual Studio Code?

**Cline** ist ein vielseitiges Tool, das die nahtlose Integration verschiedener KI-Modelle und APIs ermöglicht.

**Roo Cline** ist eine erweiterte oder spezialisierte Version von Cline, die oft für spezifische Anwendungsfälle oder erweiterte Funktionen angepasst ist. Es kann zusätzliche Features, Optimierungen oder Integrationen enthalten, die auf fortgeschrittene oder spezielle Anforderungen zugeschnitten sind.

## So verwenden Sie die Mistral API mit Cline oder einem Cline fork

Wenn Sie Cline kostenlos ausprobieren möchten, ist die kostenlose Mistral API mit **mistral-large-latest** oder **codestral-latest** ein guter Ausgangspunkt. Leider gibt es keine direkte Möglichkeit, die Mistral API in Cline zu verwenden. Indem Sie jedoch diese klaren, Schritt-für-Schritt-Anweisungen befolgen, können Sie eine reibungslose Integration sicherstellen.

## Schritt 1: Kostenlosen Mistral API-Schlüssel erstellen

- **Quelle**: Erstellen des eigenen kostenlosen Mistral API-Schlüssel über die [Mistral AI-Konsole](https://console.mistral.ai/).

## Schritt 2: Zugriff auf die Cline-Provider-Einstellungen

- Navigieren Sie zum Abschnitt **Provider-Einstellungen** in Cline, wie im Konfigurationsbild gezeigt.
- Verwenden Sie das Bild als Leitfaden, um das Einstellungsmenü zu finden.

## Schritt 3: Geben Sie den API-Schlüssel ein

- **Feld**: Suchen Sie das Feld **"API-Schlüssel"** in den Provider-Einstellungen.
- **Eingabe**: Fügen Sie Ihren Mistral API-Schlüssel in dieses Feld ein. **Wichtig**: Verwenden Sie immer den Mistral API-Schlüssel, nicht den Codestral API-Schlüssel.
- **Zusätzliche Einstellungen**: Stellen Sie sicher, dass alle erforderlichen Felder, wie z. B. der API-Endpunkt, korrekt auf **https://api.braintrust.dev/v1/proxy** gesetzt sind.

## Schritt 4: Wählen Sie das richtige Modell aus

- **Modellauswahl**:
  - Für Codestral: Geben Sie **codestral-latest** ein.
  - Für Mistral: Geben Sie **mistral-large-latest** ein.

## Schritt 5: Testen Sie die Integration

- **Test**: Geben Sie eine einfache Eingabeaufforderung ein, um zu überprüfen, ob die KI korrekt antwortet. Erstellen Sie beispielsweise eine `test.md`-Datei mit dem aktuellen Datum.

## Schritt 6: Beheben häufiger Probleme

- **Häufige Fehler**:
  - **Ungültiger API-Schlüssel**: Überprüfen Sie die Richtigkeit des Schlüssels und achten Sie auf Tippfehler.
  - **Modell nicht gefunden**: Stellen Sie sicher, dass der Modellname korrekt eingegeben wurde.
- **Sicherheit**: Bewahren Sie Ihre API-Schlüssel sicher auf und teilen Sie sie nicht öffentlich.
