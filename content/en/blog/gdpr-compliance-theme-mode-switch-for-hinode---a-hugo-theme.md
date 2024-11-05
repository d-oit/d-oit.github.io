---
title: GDPR compliance theme mode switch for Hinode - A Hugo Theme
slug: gdpr-compliance-theme-mode-switch-for-hinode-a-hugo-theme
description: GDPR compliance theme mode switch for Hinode - A Hugo theme with save icon and toast message for an implicit save mode
date: 2024-10-22
tags: [Hugo,Website,GDPR]
categories: [Website]
thumbnail: 
  url: /img/blog/LightDarkModeThumbnail.jpg
  author: d.o. (Copilot Designer)
---

After a discussion about "is the current theme mode switch GDPR compliance" without cookie consent, I developed a new mode switch with a save icon and a toast message to prevent the using of a cookie consent... which I personally do not like it and try to prevent on this personal blog.

![navbar-mode define](/img/blog/ThemeModeWithSaveOption.png)
{class="rounded" wrapper="w-50"}

## HTML Theme Toggle Interface

Create a **navbar-mode.html** file provides the user interface for switching between light, dark and auto mode with a save icon.

{{< file full="true" show="false" path="./layouts/partials/navbar-mode.html" id="file-collapse-1" >}}

Define is in the **navbar.html**:

![navbar-mode define](/img/blog/navbarDefineNavbar-mode.png)
{class="rounded"}

## JavaScript

Override the existing Hinode **color.js** file with the new code.

* This script handles the mode customization for the Hugo / Hinode website.
* GDPR compliance: User click on the save button after selected a mode.
* It provides a dark mode, light mode, and auto mode based on the user's preference.
* The selected theme is saved with an icon in the localStorage for persistence across sessions.

{{< file full="true" show="false" path="./assets/js/critical/color.js" id="file-collapse-2" >}}
