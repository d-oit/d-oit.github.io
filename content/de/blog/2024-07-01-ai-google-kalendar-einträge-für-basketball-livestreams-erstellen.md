---
lang: de
title: Google Kalender Einträge aus AI Prompt
description: Basketball Livestreams Google Kalendereinträge erstellen und auf Website darstellen.
date: 2024-07-01T12:21:11.753Z
thumbnail:
    url: /img/blog/BasketGoogleCalendar.png
    author: d.o. (Copilot Designer)
tags:
    - AI Prompt
    - Basketball
categories:
    - Software Development
slug: google-kalender-eintrage-aus-ai-prompt
includeToc: false
---

> [!NOTE]  
> Aus nicht ganz klaren Datenschutzgründen (fonts werden vom Server geladen) habe ich mich dagegen entschieden den Google Calendar auf der Website einzubetten. Als Alternative werden die Daten vom Google Calendar als Markdown Tabelle angezeigt.

# Google Calendar

Für mich selbst habe ich meinen **google calendar** um einen *BasketballLive* Kalender erweitert, um dort Livestreams zu verwalten, die ich gerne sehen möchte.

Warum **google calendar**?

Ich wollte einfach nicht nochmal einen Kalender installieren. Dieser funktioniert in jedem gängigen Browser, Android und ist einfach zu verwalten.

Die Seite ist hier zu finden:

{{< button icon="fa-solid fa-table-list" order="first" href="/de/blog/free-basketball-live-streams" >}}Übersicht Live streams{{< /button >}}

{{< button icon="fa-solid fa-calendar-day" order="first" href="https://calendar.google.com/calendar/ical/f8a14c4037d9ab411f93f19ee369218f0ed54be7c2d88deaf09d6b76fbe72e7f%40group.calendar.google.com/public/basic.ics" >}}iCal public address{{< /button >}}


## Kalender

Es gibt auf jeden Fall schönere Darstellungen / Kalender. Letztlich steht die Benachrichtigung und Einfachheit im Vordergrund.

Normalerweise trage ich diese einfach manuell ein, falls ich eine Übertragung finde, die mich interessiert.

Für die Automatisierung habe ich bereits einiges getestet und probiert. Der Aufwand sollte dabei gering bleiben. Wenn man es schön(er) haben möchte; artet es in mehr Zeitaufwand und Test aus.

Aktuell funktionieren bei der Automatisierung einige Punkte noch nicht sauber, daher erst mal in der aktuellen Form:

## Beispiel magentasport

1. Aufruf magentasport im Lesemodus
2. Übertragungen heraussuchen und in die Zwischenablage kopieren
3. Bing Copilot Chat eine ics Datei erstellen:

**Beispiel magentasport - ics Datei**

```"Erstelle eine ics in deutscher Zeitzone für die nachfolgenden magentasport.de Livestreams Termine mit einer Dauer von 1,5 stunden:
Deutschland
Frankreich
Deutschland
Frankreich
Sa 6. Jul 15:30  | 
Testspiele Herren
....
...."
```

Das Ergebnis ist ein ics Datei. 

**Beispiel DBB Olympia 2024 - Link erzeugen**

Die Termine sind aufgespielt auf der [DBB Website](https://www.basketball-bund.de/bunter-tv-sommer-fuer-dbb-olympiateams/) zu finden.

Copilot Chat:

```
Erstelle google calendar url events links (example https://github.com/InteractionDesignFoundation/add-event-to-calendar-docs/blob/main/services/google.md)  für die nachfolgenden Livestreams mit einer Dauer von 1,5 Stunden in deutscher Zeitzone. Der Titel soll mit "Olympia 2024: " beginnen. 
In der der Beschreibung den Livestream mit einfügen: 
DBB Herren - Olympia 2024
Livestream: https://www.sportschau.de/olympia
Ort: Lille

Herren (Lille)
Samstag, 27. Juli 2024
13.30 Uhr: Deutschland – Japan

Dienstag, 30. Juli 2024
21.00 Uhr: Deutschland – Brasilien

Freitag, 02. August 2024
21.00 Uhr: Deutschland – Frankreich
```

Als Ergebnis kommt jeweils ein Link heraus; der in einem Browser mit angemeldetem google Calendar Account ausgeführt werden kann. Der Termin wird hierbei manuell angelegt:

```
https://www.google.com/calendar/render?action=TEMPLATE&text=Olympia+2024%3A+Deutschland+%E2%80%93+Japan&dates=20240727T113000Z/20240727T130000Z&details=DBB+Herren+-+Olympia+2024%0ALivestream%3A+https%3A%2F%2Fwww.sportschau.de%2Folympia&location=Lille
```

***Wunsch***: Klasse wäre, wenn Google *Gemini* direkt mit Google Calendar verknüpft werden könnte. Ist ja der gleiche Google Account. Dies ist aber nicht möglich. Ebenso werden in Gemini keine korrekte Zeitzone erstellt.

4. ics Datei in google Kalender importieren

### Erweiterungen

Alternative ist Anbindung an den google calendar per API für jeden einzelnen Termin oder einen alternativen Kalender.
Machbar ist einiges ... mal sehen was draus wird {{< fas fa-tv>}} {{< fas fa-basketball>}}

## Prompt 2 Google Calendar

Mit Hilfe von **GPTengineer** war die Erstellung einer WebApp leichter. Nachdem die GPTengineer BETA aktuell in aller Mund ist hat es sich angeboten diese auszutesten.
Die Google Gemini API verfügt aktuell über eine kostenlose Stufe. Ebenso wollte ich diese auch bei Gelegenheit testen.

Das Ergebnis ist eine WebApp die google Calendar Einträge erzeugt aus einem Text der die Daten der Übertagungen enthält. Ebenso besteht die Möglichkeit den Prompt anzupassen falls notwendig. Das nervige bei solchen Projekten ist das Suchen, Erstellen, Testen der APIs. 
Hier hilft aktuell **perplexity** für den Start der notwendigen Prompts.

 {{< image src="img/doitPrompt2Cal.png" caption="d.o.it Prompt2GCal" >}}

{{< button href="https://streams2cal.netlify.app/" >}}WebApp{{< /button >}}

{{< button icon="fab github" order="first" href="https://github.com/d-oit/basketball-streams-to-calendar-ai-prompt/" >}}Source Code{{< /button >}}

## Darstellung im Blog

Damit iCal Google Calendar Einträge auf der Website angezeigt werden können wird über eine GitHub Action per Python script die Google Calendar Einträge eine JSON Datei erstellt.

### Python GitHub Action

{{< file full="false" path="update_basket_calendar_json.py" id="file-collapse-py-script" show="false" >}}

### Json

{{< file full="false" path="./assets/free_basket_calendar.json" id="file-basket-json" show="false" >}}

### Hugo Template Anzeige

json Datei einlesen und Felder in html tags darstellen mit entsprechenden Hugo Template Parametern

```
 $jsonURL := "free_basket_calendar.json"
 $json := resources.Get $jsonURL 
 if $json 
 $data := transform.Unmarshal $json.Content
 range $index, $item := $data 
```
