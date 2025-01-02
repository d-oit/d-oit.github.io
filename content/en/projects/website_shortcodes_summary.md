---
lang: en-US
title: Used Hugo Shortcodes Summary
description: "Overview created Hugo shortcodes for this website"
date: 2025-01-01T14:56:31.284Z
layout: docs
thumbnail:
  url: img/doitplaceholder.jpg
  origin: Copilot Designer
  author: d.o.
tags:
  - Hugo
categories:
  - Website
---

## basketCalendar.html

- **Description**: Embeds a responsive Google Calendar iframe.
- **Details**: The CSS styles ensure the iframe is responsive and adjusts its size based on the screen width. The iframe itself embeds a Google Calendar with a specific source URL.
- **Usage**:

  ```hugo
  {{< basketCalendar >}}
  ```

## basketCalendarJsonTable.html

- **Description**: Displays a table of basketball calendar events fetched from a JSON file.
- **Details**: Includes filters for searching and date filtering, and provides both card and table views for the events.
- **Usage**:

  ```hugo
  {{< basketCalendarJsonTable >}}
  ```

## fullscreenAndPrintButton.html

- **Description**: Adds a fullscreen toggle button and a print button to the page.
- **Details**: The fullscreen button is currently commented out, but the print button is active and triggers the browser's print functionality when clicked.
- **Usage**:

  ```hugo
  {{< fullscreenAndPrintButton >}}
  ```

## ghcode.html

- **Description**: Embeds and renders markdown content from a remote resource.
- **Details**: Fetches the content from the specified URL and renders it as markdown.
- **Usage**:

  ```hugo
  {{< ghcode "https://example.com/file.md" >}}
  ```

## ghcodeHtml.html

- **Description**: Embeds and renders HTML content from a remote resource.
- **Details**: Fetches the content from the specified URL and renders it as HTML with syntax highlighting.
- **Usage**:

  ```hugo
  {{< ghcodeHtml "https://example.com/file.html" >}}
  ```

## ics-table.html

- **Description**: Displays a table of events from an ICS (iCalendar) file.
- **Details**: Fetches the ICS content from a remote URL, parses the events, and displays them in a table with columns for date, summary, and location.
- **Usage**:

  ```hugo
  {{< ics-table url="https://example.com/calendar.ics" >}}
  ```

## include.html

- **Description**: Includes the contents of another file within the current page.
- **Details**: Reads the specified file, removes any front matter, and renders the content as safe HTML.
- **Usage**:

  ```hugo
  {{< include "path/to/file.md" >}}
  ```

## languageCode.html

- **Description**: Displays the current site language.
- **Details**: Outputs the language code of the site.
- **Usage**:

  ```hugo
  {{< languageCode >}}
  ```

## redirectToProject.html

- **Description**: Redirects the user to the projects page in English.
- **Details**: Removes any selected language from local storage and performs the redirection.
- **Usage**:

  ```hugo
  {{< redirectToProject >}}
  ```

## refLink.html

- **Description**: Creates a reference link or button.
- **Details**: Supports both internal and external links, and can display the link as a button or a regular link based on the provided parameters.
- **Usage**:

  ```hugo
  {{< refLink ref="https://example.com" text="Example Link" >}}
  ```

## removeDefaultLanguage.html

- **Description**: Removes the selected language from local storage.
- **Details**: Useful for resetting the language preference.
- **Usage**:

  ```hugo
  {{< removeDefaultLanguage >}}
  ```

## sitemap.html

- **Description**: Displays a sitemap of all pages on the site.
- **Details**: Provides both list and card views for the pages, with a search input to filter the results.
- **Usage**:

  ```hugo
  {{< sitemap >}}
