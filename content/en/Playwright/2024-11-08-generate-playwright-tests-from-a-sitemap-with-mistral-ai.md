---
title: Generate Playwright Tests from a Sitemap with Mistral AI
description: "Try out: Python Script for generating Playwright Tests from a Sitemap with Mistral AI"
date: 2024-11-20T19:06:43.137Z
tags:
  - Hugo
  - Testing
  - AI
  - Mistral
  - Playwright
  - Website
categories:
  - Software Development
thumbnail:
  url: /img/blog/generate-playwright-tests-sitemap-mistral-ai.jpg
  author: d.o.it
lang: en
slug: /en/blog/generate-playwright-tests-sitemap-mistral-ai
aliases: /en/playwright/generate-playwright-tests-sitemap-mistral-ai
---

## Automating Playwright Tests from a Sitemap with Mistral AI

In this blog post, we'll explore how to automate the generation of Playwright tests for web pages listed in a sitemap using the free Mistral API. This process involves fetching the sitemap, extracting URLs, and using Mistral AI to generate test scripts for each URL.

This is primarily a testing with the Mistral AI library for myself.

## Script Overview

**Requirement:** Get the Mistral API Key and create **.env**:

```env
MISTRAL_API_KEY=your_actual_api_key
```

```py
# Fetch sitemap from URL
sitemap_url = "https://d-oit.github.io/en/sitemap.xml"
```

The script uses the requests library to fetch the sitemap from the specified URL.
For each URL, the script sends a prompt to Mistral AI to generate a Playwright test script.

As result the script returns the test code with markdown formatting. As an easy way we remove the markdown code formatting and have as result a .js file for using with Playwright.

{{< file full="true" path="./tests/generatePlaywrightTest.py" id="generatePlaywrightTest-py" show="false"options="linenos=table,hl_lines=8 18" >}}

```bash
pip install requests python-dotenv mistralai lxml
```

- **requests**: for fetching the sitemap content over HTTP.
- **python-dotenv**: for loading environment variables from a .env file.
- **mistralai**: to interact with the Mistral API for generating code.
- **lxml**: provides the ET (ElementTree) API for parsing XML data (you can also use xml.etree.ElementTree if lxml is unavailable).

### Generated Playwright .js file

As a quick workaround for now we replace the markdown code formatting:

{{< mark color="warning" >}}\```javascript{{< /mark >}}
const { test, expect } = require('@playwright/test');

test.describe('Blog Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://d-oit.github.io/en/blog/licenses-nuget-packages-net-core-solution/');
  });
...
...
{{< mark color="warning" >}}\```{{< /mark >}}

## Conclusion

This script automates the generation of Playwright tests for web pages listed in a sitemap using Mistral AI.

By leveraging AI, you can quickly create comprehensive test scripts for your web applications, ensuring better coverage and reliability.

Most of the tests are not really useful. But it shows the possibility of creating automated tests.
