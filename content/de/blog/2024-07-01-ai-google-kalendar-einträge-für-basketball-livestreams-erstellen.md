---
title: Google Kalender Einträge aus AI Prompt
description: Basketball Livestreams Google Kalender Einträge erstellen und auf Website darstellen.
date: 2024-07-01T12:21:11.753Z
thumbnail:
    url: /img/blog/BasketLivestreams.jpg
    author: d.o. (Copilot Designer)
tags:
    - AI Prompt
    - Basketball
categories:
    - Software development
slug: google-kalender-eintrage-aus-ai-prompt
---

Für mich selbst habe ich meinen **google calendar** um einen *BasketballLive* Kalender erweitert, um dort Livestreams zu verwalten, die ich gerne sehen möchte. 

Warum **google calendar**? 

Ich wollte einfach nicht nochmal einen Kalender installieren. Dieser funktioniert in jedem gängigen Browser, Android und ist einfach zu verwalten.

Die Seite ist hier zu finden:

{{< link "/de/blog/kostenlose-basketball-live-streams/" >}}Kalender Live streams{{< /link >}}

## Kalender

Es gibt auf jeden Fall schönere Darstellungen / Kalender. Letztlich steht die Benachrichtigung und Einfachheit im Vordergrund. 

Normalerweise trage ich diese einfach manuell ein, falls eine Übertragung finde die mich interessiert. 

Für die Automatisierung habe ich bereits einiges getestet und probiert. 
Aktuell funktionieren bei der Automatisierung einige Punkte noch nicht sauber, daher erst mal in der aktuellen Form:

## Beispiel magentasport

1. Aufruf magentasport im Lesemodus
2. Übertragungen raus suchen und in die Zwischenablage kopieren
3. Bing Copilot Chat eine ics Datei erstellen:

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

*Wunsch*: Klasse wäre wenn Google Gemini direkt mit Google Calendar verknüpft werden könnte. Ist ja der gleiche Google Account. Dies ist aber nicht möglich. Ebenso werden in Gemini keine korrekte Zeitzone erstellt. 
4. ics Datei in google Kalender importieren 

### Erweiterungen

Alternative ist Anbindung an den google calendar per API für jeden einzelnen Termin oder einen alternativen Kalender. 
Machbar ist einiges... mal sehen was draus wird {{< fas fa-tv>}} {{< fas fa-basketball>}} 