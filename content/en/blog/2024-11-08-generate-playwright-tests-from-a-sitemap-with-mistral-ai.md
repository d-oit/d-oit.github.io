---
title: Generate Playwright Tests from a Sitemap with Mistral AI
description: "Try out: Python Script for generating Playwright Tests from a Sitemap with Mistral AI"
date: 2024-11-14T19:06:43.137Z
preview: ""
draft: true
tags: []
categories: []
thumbnail:
  url: ""
  author: ""
  origin: ""
lang: ""
---

## Automating Playwright Tests from a Sitemap with Mistral AI

In this blog post, we'll explore how to automate the generation of Playwright tests for web pages listed in a sitemap using Mistral AI. This process involves fetching the sitemap, extracting URLs, and using Mistral AI to generate test scripts for each URL.

This is primarily a testing with the Mistral AI library for myself.

## Script Overview

**Requirement:** Get the Mistral API Key and create .env with the MISTRAL_API_KEY

The script uses the requests library to fetch the sitemap from the specified URL.
For each URL, the script sends a prompt to Mistral AI to generate a Playwright test script.

As result the script returns the test code with markdown formatting. As an easy way we remove the markdown code formatting and have as result a .js file for using with Playwright.

### Generated Playwright .js file

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

This script automates the generation of Playwright tests for web pages listed in a sitemap using Mistral AI. By leveraging AI, you can quickly create comprehensive test scripts for your web applications, ensuring better coverage and reliability.
Most of the tests are not really useful. But it shows the possibility of creating automated tests.
