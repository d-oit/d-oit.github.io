---
lang: de-DE
title: Statische Website erstellen
description: Website mit Hugo Hinode Theme erstellen
slug: statische-website-erstellen
date: 2024-05-23T14:21:58.426Z
tags:
  - Hinode Theme
  - Hugo
  - Blog
thumbnail:
  url: /img/blog/VisualStudioCodeWorkspace.png
  author: Dominik Oswald
category:
- Website
draft: false
---

## Blog Wiederbelebung

Den bisherigen Blog habe ich seit ein paar Jahren vernachlässigt. Aktuell ist es wieder an der Zeit diesem neues Leben einzuverleiben.

Das ist mein Setup zum Schreiben. Wichtig war mir die offline Funktionalität, Online Bearbeitung durch [GitHub Codespaces](https://github.com/features/codespaces) (gleiche Erweiterungen verwendbar wie offline / auf dem Desktop),  Mehrsprachigkeit, einfache Verwendung von github pages mit actions Funktionen.
Und vor allem Performance :performing_arts:

Der Blog wird im english sprachigen Teil eher Entwickler/Technik lastig. Das Setup ist durch meinen Hintergrund im IT Bereich zu Stande gekommen.

### Hugo

Grundlage vom *Hinode* Theme ist **Hugo**. Eines der am weitesten verbreitetsten Generatoren von statischen Website. Lokal wird dabei mit einem Editor der Inhalt erstellt. Hugo als Generator erzeugt daraufhin html Dateien welche der Browser anzeigt.

Infos zu Hugo sind hier zu finden: https://gohugo.io/ oder https://de.wikipedia.org/wiki/Hugo_(Software)

## Lokale Installation

Los geht es mit der, lokalen Installation. In der Beschreibung wird Windows verwendet, unterstützt werden natürlich auch andere Umgebungen.

Vorgehensweise ist in der Dokumentation des **Hinode Hugo Theme** ausführlich beschrieben: https://gethinode.com/docs/getting-started/introduction/

1. Hugo Installation >> https://gohugo.io/getting-started/quick-start/#prerequisites

    - Meine Installation / Update führe ich per winget durch:
      `winget install Hugo.Hugo.Extended`

2. Git als Versionsverwaltung >> https://git-scm.com/downloads (Dateien werden auf github oder gitlab hochgeladen und als pages / website angezeigt)

    - Git unter Windows kann per Terminal / Command line mit Admin Rechten per `git update-git-for-windows` aktualisiert werden
    - Optional: Git Graph extension for Visual Studio Code für eine zusätzliche Anzeige >> https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph

3. Visual Studio Code >> https://code.visualstudio.com/Download

    3.1. Visual Studio Code Erweiterungen

    - Front Matter CMS

    - German - Code Spell Checker

    - Font Awesome Gallery

    - LTeX – LanguageTool grammar/spell checking

  Aktueller Stand als PowerShell Installation Gist >> https://gist.github.com/d-oit/d3496a25f7de86f4c45d339a31040405
  Ermittlung
  
    *Voraussetzung*: Command Line Interface (CLI) >> https://code.visualstudio.com/docs/editor/command-line

4. Alternativer open source Markdown Editor ist für mich **Marktext** https://www.marktext.cc/

  Nach der Installation kann lokal per `hugo server` Terminal Befehl der lokale Hugo Webserver gestartet werden. Dieser prüft auch automatisch ob z.B. eine Bilddatei fehlt für die Anzeige in der Webansicht.

### Windows 11 Developer Powershell

Windows 11 Powershell script für die Installation eines english-US Sprachpaket inklusive notwendiger Tools für die Webentwicklung.

https://gist.github.com/d-oit/bd3aa6854a13de8c203f9710649e18eb

### Hugo Module aktualisieren

Hugo verwendet die Datei **go.mod**, um zu ermitteln, welche Version von vom Hugo eine Website verwendet.

Alle Module aktualisieren per Terminal / Command Line:

`hugo mod get -u`

oder per

`npm run build`

## Website veröffentlichen

Der aktuelle Stand wird per git Versionsverwaltung auf **github** gestellt und per **Actions** als fertige html Seite (github pages) auf den öffentlichen Ordner gestellt.

Das Ergebnis sind statische html Dateien ohne große Leistungsprobleme: https://pagespeed.web.dev/analysis/https-d-oit-github-io/tvgpcmjj5b?form_factor=desktop

Damit kann ohne großen Aufwand die Veröffentlichung erfolgen sobald eine Internetverbindung besteht.
