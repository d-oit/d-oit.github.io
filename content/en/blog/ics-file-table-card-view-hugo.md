---
lang: en
title: Using ics file for website content 
description: Using ics file with basketball livestreams as website content.
date: 2024-07-01T12:21:11.753Z
thumbnail:
    url: /img/blog/BasketGoogleCalendar.png
    author: d.o. (Copilot Designer)
tags:
    - Hugo
    - Basketball
    - Software Development
    - GitHub
categories:
    - Website
slug: ics-file-hugo
includeToc: false
draft: true
---

> [! NOTE]  
> For not entirely clear data protection reasons (fonts are loaded from the server), I decided against embedding the Google Calendar on the website. As an alternative, the data from Google Calendar is displayed as a Markdown table or card view.

## Presentation on the website

So that iCal Google Calendar entries can be displayed on the website, a JSON file is created via a GitHub action using Python script for the Google Calendar entries.

### Python GitHub Action

{{< file full="true" path="./.github/workflows/update_free_basket_calendar.yml" id="update_free_basket_calendar" show="false"options="linenos=table,hl_lines=37" >}}

Changes are written to the GitHub repository via [git-auto-commit-action](https://github.com/stefanzweifel/git-auto-commit-action). The changes are delivered via reusable hugo GitHub action.

{{< file full="false" path="update_basket_calendar_json.py" id="file-collapse-py-script" show="false" >}}

### Json

{{< file full="false" path="./assets/free_basket_calendar.json" id="file-basket-json" show="false" >}}

### Hugo template display

Read json file and display fields in HTML tags with corresponding Hugo template parameters like this:

```go
 $jsonURL := "free_basket_calendar.json"
 $json := resources. Get $jsonURL 
 if $json 
 $data := transform. Unmarshal $json. Content
 range $index, $item := $data 
```

### Result content page

{{< refLink ref="free-basketball-live-streams.md" lang="en" text="Free Basketball live stream page" showButton="true" color="info" >}}
