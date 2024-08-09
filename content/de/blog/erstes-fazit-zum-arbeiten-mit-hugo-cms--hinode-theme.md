---
lang: de
title: Fazit zum Arbeiten mit Hugo CMS
description: Erstes Fazit nach einigen Blogartikel mit Hugo CMS (Hinode Theme)
date: 2024-07-29T13:38:36.132Z
tags:
  - Hugo CMS
  - Hinode
  - Website
thumbnail:
  url: /img/blog/1_Fazit_Hugo_CMS_Hinode_Theme_Website.png
  author: d.o. (Copilot Designer)
slug: fazit-zum-arbeiten-mit-hugo-cms
draft: false
categories:
  - Website
---

{{< button icon="fab fa-blogger" href="/de/blog/statische-website-erstellen/" >}}Neustart mit Hugo CMS des Blogs{{< /button >}}

## Hugo CMS und Hinode Theme: Erste Eindrücke

Die Einrichtung und die ersten Blogartikel waren schnell erstellt. Die Markdown Syntax und Visual Studio Code zum Erstellen der Artikel waren bekannt.

Im Detail ging es dann los mit verschiedenen Konfiguration und speziellen Hinode Markdown Shortcodes. Dazu ist einiges gut in den Hugo CMS und Hinode Docs erklärt. Leider auch vieles historisch oder Hinode verwendet Einrichtungen anders als Hugo CMS. Feedback gibt es aber immer schnell und im Code kann dann github eingesehen werden.
Die Programmierung der Erweiterung ist in js in Verbindung mit GO / Hugo CMS Variablen ist ein wenig gewöhnungsbedürftig.

Hier ein Beispiel der erstellen JavaScript Datei zum Laden und Speichern der ausgewählten Sprache. Dies wurde bisher noch nicht vom Hinode CMS unterstützt. 

{{< file lang="js" full=false show=false path="assets/js/critical/languageSelector.js" id="file-collapse-1" >}}

### Erklärung 

(vor allem für mich selbst :smile:)

**{{- if site.Params.main.enableLanguageSelectionStorage -}}**

**enableLanguageSelectionStorage** = Einstellung in der **params.toml** Hugo Einstellungsdatei. 
Der Code wird nur verwendet wenn die String Variable "true" ist.

{{**-** Minus Zeichen = string variable


## Frontend

Ein gutes Frontend für die Bearbeitung im Browser wie bei Hexo, Wordpress oder anderen CMS ist leider nicht so einfach einzurichten oder auch zu bekommen. Was mir gefallen hat, ist CloudCannon. Das ist aber aktuell preislich nicht bezahlbar. Alle anderen Frontend von der offiziellen Liste https://gohugo.io/tools/front-ends/ waren nicht so das Gelbe vom Ei.
Wichtig ist für mich beim Frontend das dieses ähnliche wie bei Wordpress von anderen Anwendern verwendet werden kann die, nicht so technisch versiert sind. Der Editor sollte einfach zu erweitern und zu verändern sein. Ebenso sollte ein Workflow für die Freigabe mit der entsprechenden Nachverfolgung bei Änderungen geben sein. Das Ganze wie gesagt für Nicht-technisch versierte Personen.

*Liste zum Durcharbeiten von aktiven Open source Projekten:*

- Publii.exe -> Offline Editor für MacOs, Windows, Linux
- https://vrite.io -> Web: WYSIWYG editor with built-in Markdown and keyboard shortcuts
- https://keystatic.com -> Web: Live edit content on GitHub or your local file system

## Erste Änderung am Theme

Beim Testen des Themes ist mir aufgefallen, dass einige Konfigurationen gefehlt hatten für die jeweilige Sprache. Da die Sourcen bei github zur Einsicht vorligen konnte dies auch angepasst werden. Was nicht funktioniert hat ist die Speicherung der Auswahl der Sprache im Browser auf der Website. Beim nächsten Mal laden wird die definierte Standardsprache verwendet. Letztlich kann sich der Anwender merken und ein Bookmark mit der jeweiligen Sprache setzten. Wäre aber schön, wenn dies funktionieren würde. 

Ein erster Prototype ware schnell erstellt. Nach einigen Tests und dem bisher unbekannten CMS konnte in Abstimmung mit dem Entwickler vom Theme ein funktionierendes JavaScript File erstellt werden.

Das war ein erstes Fazit. Weitere folgen...