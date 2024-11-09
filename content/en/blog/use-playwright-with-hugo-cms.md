---
lang: en
title: Use Playwright with Hugo
slug: use-playwright-with-hugo-cms
description: Playwright testing with Hugo local and with GitHub action
date: 2024-11-04
tags: [Hugo ,Website,Playwright,GitHub]
categories: [Website]
thumbnail:
    url: /img/blog/doitHugoPlaywright.jpg
    author: d.o.
---

Testing is a crucial part of any website's development process, especially when using a static site generator like Hugo.
One excellent tool for automating tests on websites is Playwright, which provides a robust framework for end-to-end testing.
Integrating Playwright with Hugo allows developers to test various aspects of the site across multiple browsers and devices, ensuring that the website behaves as expected.

## Prerequisites

1. Node.js: Ensure you have Node.js installed, as Playwright runs on Node.

2. Hugo: Install Hugo to generate your static site.

3. Install [Playwright](https://playwright.dev/docs/intro#installing-playwright):

    ```bash
    npm init playwright@latest
    ```

4. Environment File: For flexible configuration, set up a .env file with a variable BASE_URL_TESTING, which specifies the URL of your site for testing.

## Setting up playwright.config.js

The playwright.config.js file is where you configure test directories, base URLs, and browser settings.  
Create / update the **playwright.config.js** in your main directory.

{{< file full="true" path="./playwright.config.js" id="playwright-config-js" show="false" options="linenos=table,hl_lines=10 23 44-48" >}}

- **baseURL**: Dynamically set the base URL from the .env file. This allows for testing different environments by simply changing the environment variable. Default: **http://localhost:1313**
- **Projects**: Defines multiple browser configurations (Chrome, Firefox, Safari, and Edge), enabling tests to run across various browsers.
- **Retries and Workers**: Customizes retries and workers for CI environments to enhance reliability and performance.

This setup provides flexibility, enabling you to test the website across multiple browsers while keeping configuration changes manageable.
Define tests in the **tests** folder of your hugo repository.

## Example Test: showCustom404.spec.js

Testing for custom error pages (like a 404 page) is essential, as it ensures users get a user-friendly response when navigating to a non-existent page.

{{< file full="true" path="./tests/tests-custom404/showCustom404.spec.js" id="showCustom404-spec-js" show="false" options="linenos=table,hl_lines=5" >}}

### Explanation of showCustom404.spec.js

1. Navigating to a Non-existent Page: The test navigates to a non-existent URL (**/en/fdaffa**), where we expect to see the custom 404 page.

2. Checking for the 404 Indicator: The code looks for an element with the ID #fa-face-frown, which signifies that the 404 page has loaded. If this element is found, the test passes this check.

3. Verifying normal page behavior: The test then navigates **back to the homepage (/)**. Here, it verifies that the 404 indicator is absent, confirming that the 404 component does not mistakenly appear on valid pages.

## Running the Tests

To execute the tests, simply use the following command. Run local the Hugo Server before running the tests.

```bash
npx playwright test
```

This command runs all tests in the tests directory.

If you want to run the test with a running Hugo server use:

`REUSE_SERVER=true`

in your **.env** file.

The HTML reporter specified in the configuration (**reporter: 'html',**) will generate a detailed report in a browser, which helps in visualizing and debugging test results. Default dictionary: **playwright-report**

Playwright automatically creates a **.gitignore** file to exclude unnecessary files from being tracked in your repository.
Ensure for:

- /test-results/
- /playwright-report/
- /blob-report/
- /playwright/.cache/

## GitHub action

Define under in your github repo under **/settings/variables/actions** the **repository variable**:

**BASE_URL_TESTING**: https://d-oit.github.io

{{< file full="true" path="./.github/workflows/playwright.yml" id="showCustom404-spec-js" show="false" >}}

### Jest

I was trying to use Jest with Hugo but was not satisfied with the results. The current setup with Hugo is the easiest way for me at the moment.

## Generate a starting point for all websites pages

As a starting point you could automatically generate a few test cases. I was testing this with the Mistral API and use the sitemap.xml to generate a test case for all pages.

**Requirements:** Get the free Mistral API, create a .env in the .py file directory

### .env file

```env
MISTRAL_API_KEY=your_api_key
```

### .py file

```python
# Fetch sitemap from URL
sitemap_url = "https://d-oit.github.io/en/sitemap.xml"
```

{{< refLink ref="https://gist.githubusercontent.com/d-oit/faa9c5286be29aae477cb7555c7be6ff/raw/" text="Start - Admin Editor" showButton="true" >}}

[GitHub gist](https://gist.githubusercontent.com/d-oit/faa9c5286be29aae477cb7555c7be6ff/raw/)

### Other resources

- [Testing my website for visual regressions with Playwright snapshot tests](https://aarol.dev/posts/playwright-snapshot-testing/)
- [Playwright Test generator](https://playwright.dev/docs/codegen)
