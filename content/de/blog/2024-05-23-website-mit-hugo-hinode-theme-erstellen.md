---
title: Statische Website erstellen
description: Website mit Hugo Hinode Theme erstellen
slug: statische-website-erstellen
date: 2024-05-23T14:21:58.426Z
preview: ""
draft: true
tags:
  - Hugo
  - Website
  - Hinode
thumbnail:
  url: /img/logo_var.svg#logo
  author: Mark Dumay
  authorURL: https://gethinode.com/docs/about/credits/?menu=about
  origin: null
  originURL: null
keywords:
  - website
---

## Blog Wiederbelebung 

Den bisherigen Blog habe ich seit ein paar Jahren vernachlässigt. Aktuell ist es wieder an der Zeit diesem neues Leben einzuverleiben. 

Das ist mein Setup zum Schreiben. Wichtig war mir die offline Funktionalität, Mehrsprachigkeit, einfache Verwendung von github pages mit actions Funktionen. 
Und vor allem Performance :performing_arts:

Der Blog wird im english sprachigen Teil eher Entwickler/Technik lastig. Das Setup ist durch meinen Hintergrund im IT Bereich zu Stande gekommen. 

### Hugo 

Grundlage vom *Hinode* Theme ist **Hugo**. Eines der am weitesten verbreitetsten Generatoren von statischen Website. Lokal wird dabei mit einem Editor der Inhalt erstellt. Hugo als Generator erzeugt daraufhin html Dateien welche der Browser anzeigt. 

Infos zu Hugo hier zu finden: https://gohugo.io/ oder https://de.wikipedia.org/wiki/Hugo_(Software)

## Lokale Installation

Los geht es mit der lokalen Installation. In der Beschreibung wird Windows verwendet, unterstützt werden natürlich auch andere Umgebungen.

Vorgehensweise ist in der Dokumentation des **Hinode Hugo Theme** ausführlich beschrieben: https://gethinode.com/docs/getting-started/introduction/

1. Hugo Installation >> https://gohugo.io/getting-started/quick-start/#prerequisites
2. Git als Versionsverwaltung >> https://git-scm.com/downloads (Dateien werden auf github oder gitlab hochgeladen und als pages / website angezeigt)
3. Visual Studio Code >> https://code.visualstudio.com/Download
4. Visual Studio Code Erweiterungen
    - Front Matter CMS 
    - German - Code Spell Checker
    - Font Awesome Auto-complete & Preview
    Aktueller Stand als PowerShell Installation Gist >> https://gist.github.com/d-oit/d3496a25f7de86f4c45d339a31040405
    Ermittlung 

    *Voraussetzung*: Command Line Interface (CLI) >> https://code.visualstudio.com/docs/editor/command-line

    {{< image src="img/blog/VisualStudioCodeWorkspace.png" >}}




