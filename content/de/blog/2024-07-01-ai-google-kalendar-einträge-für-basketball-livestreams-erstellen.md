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

Für mich selbst habe ich meinen **google calendar** um einen *BasketballLive* Kalender erweitert, um dort Livestreams zu verwalten, die ich gerne sehen möchte. 

Warum **google calendar**?

Ich wollte einfach nicht nochmal einen Kalender installieren. Dieser funktioniert in jedem gängigen Browser, Android und ist einfach zu verwalten.

Die Seite ist hier zu finden:

{{< link "übersicht-kostenlose-basketball-live-streams/" >}}Übersicht Live streams{{< /link >}}

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

[Website](https://streams2cal.netlify.app/)
[Github](https://github.com/d-oit/basketball-streams-to-calendar-ai-prompt)
