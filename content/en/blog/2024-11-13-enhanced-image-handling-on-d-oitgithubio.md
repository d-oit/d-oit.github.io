---
title: Enhanced Image Handling 
description: "Enhanced image handling for Hugo / Hinode Theme: Improved scaling, optimized load times, and new 'auto' aspect ratio for efficient, responsive visuals."
date: 2024-11-13
draft: false
tags:
  - Hinode Theme
  - Hugo
  - Blog
thumbnail:
  url: /img/doitPlaceholder.jpg
  author: d.o.it (Flux)
category:
  - Website
lang: "en"
---

**Date**: November 13, 2024  
**Commit**: [5b685f8](https://github.com/d-oit/d-oit.github.io/commit/5b685f8306eda43043d1e10ada8cf72d952a5321)  
**Contributor**: d-oit  

## Overview

The latest update focuses on improving image handling within the d-oit.github.io site, offering increased flexibility in image scaling and optimizing page load times. The addition of an `auto` aspect ratio option and conditional image resizing brings new efficiency and responsiveness to site visuals.

## Key Changes

1. **Aspect Ratio Flexibility**:
   - An `auto` option was added in `image.yml` for images, allowing them to retain their native aspect ratio by default. This change adapts better to different screen sizes without requiring specific aspect ratios.

   _Hint_: The `auto` option was already added in `image.yml` but was not used in the layout code.

    ```yml
    - ratio: auto
      dimensions:
      - 150
      - 300
      - 450
      - 576
      - 768
      - 992
      - 1200
      - 1400
      - 2800   
    ```

2. **Conditional Resizing with Hugo’s Image.Resize**:
   - Hugo’s `Image.Resize` function now runs only if an image width is defined in `image.yml`, avoiding unnecessary resizing and saving processing time.

3. **Streamlined Image Management**:
   - With configuration adjustments centralized in `image.yml`, developers now have a simpler and more maintainable approach for image handling, reducing the need for repetitive coding changes.

## List of Modified Files

- **`config/image.yml`**:

  - Added `auto` as an option for the aspect ratio, allowing images to maintain original proportions unless specified otherwise.

- **`layouts/_default/baseof.html`**:

  - Adjusted image resizing logic to apply Hugo's `Image.Resize` conditionally, depending on specified parameters in `image.yml`.

- **config/_default/params.toml**:

    ```toml
    [thumbnails]
        useRatio = true
        ratio = "auto"
        class = "rounded lightbox"  
    ```

    **useRatio**: bool, default true

    **ratio**: string, defined in the ****image.yml****

    **class** = string, classList thumbnail image: **"rounded lightbox"** ("rounded" is the current default in the Hinode layout)

This changes also include the using of a lightbox:
        - addEventListener click for img with the class `lightbox` **\assets\js\critical\functional\lightbox-script.js**

- **assets/scss/theme/theme.scss**: customize the `.lightbox`... styles for your theme.

## Benefits of These Changes

These updates aim to:

- Improve responsiveness across different devices by allowing images to adjust naturally.
- Enhance site performance by minimizing image resizing overhead.
- Simplify image configuration, making future adjustments easier and more efficient.

For full technical details, refer to the [commit on GitHub](https://github.com/d-oit/d-oit.github.io/commit/5b685f8306eda43043d1e10ada8cf72d952a5321).

### ToDos

- [ ] Testing the performance and dimensions of the images
- [ ] Create Playwright tests
- [ ] Create a photo gallery
- [ ] Lightbox: Params for default class "lightbox" for images
- [ ] Create a new carousel or try to use it with the existing carousel
- [ ] Create a Hinode PR for the changes (with or without the lightbox, own module?)
- [ ] Keyboard navigation for lightbox, full accessibility

### History

#### 2024-11-20: Add zoom in and out buttons to the lightbox.js / theme.scss

- **config/_default/params.toml**:

    ```toml
    [lightbox]
      enableZoom = true
      enableRotate = false  
    ```

#### 2024-11-22: Add previous, next button

- disable Params: .Site.Params.**lightbox.disableSliderButtons**

{{< button icon="fab fa-blogger" href="/en/playwright/generate-playwright-tests-sitemap-mistral-ai" >}}Showcase image slider with prev,next buttons{{< /button >}}
