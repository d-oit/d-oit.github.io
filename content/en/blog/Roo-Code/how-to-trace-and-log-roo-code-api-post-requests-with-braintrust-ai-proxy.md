---
title: "Trace API POST Requests: Roo Code + Braintrust AI Guide"
description: Learn how to configure Roo Code with Braintrust AI Proxy for enhanced API request tracing, caching, and OpenTelemetry monitoring - a step-by-step implementation guide.
date: 2025-05-19T09:55:00Z
tags:
   - AI
   - Roo Code
   - VSCode
   - API
categories:
   - Software Development
thumbnail:
   url: /img/blog/how-to-trace-and-log-roo-code-api-post-requests-with-braintrust-ai-proxy.jpg
   author: d.o. (flux)
lang: en
slug: trace-api-post-requests-roo-code-braintrust-ai-guide
aliases: /en/roo-code/trace-api-post-requests-roo-code-braintrust-ai-guide
---

Here’s how to configure **Roo Code**’s UI to route all your OpenAI–compatible requests through the Braintrust AI Proxy—complete with transparent caching, built-in tracing, and full OpenTelemetry support—without writing a single line of code. By simply adjusting the **API Provider**, **Base URL**, and **Custom Headers** fields in your Roo Code settings panel (as shown in your screenshots), you unlock:

* **Cache modes** (`auto`, `always`, `never`) that let you reuse deterministic outputs when `temperature=0`
* **Tracing headers** (`x-bt-parent: project_id:<YOUR_PROJECT_ID>`) that generate root spans in Braintrust’s monitoring dashboard
* **OpenTelemetry export** via OTLP endpoints, compatible with any observability platform (including Traceloop’s OpenLLMetry)

## Configuring Roo Code’s UI

1. **API Provider**

   * Select **OpenAI Compatible** from the dropdown. This tells Roo Code to treat the endpoint exactly like the OpenAI API, so you can continue using the same SDK calls internally.

2. **Base URL**: https://api.braintrust.dev/v1/proxy

   * This single endpoint proxies across multiple model providers while adding caching and observability. [List of supported models and providers](https://www.braintrust.dev/docs/guides/proxy?utm_source=chatgpt.com#list-of-supported-models-and-providers)

3. **OpenAI API Key**

   * Paste your **Braintrust** API key here.
   * Whenever you include tracing headers, Braintrust uses this key to authenticate and associate spans with your project.

   {{< image class="rounded lightbox" src="/img/blog/RooCodeBraintrustTraceCacheConfiguration.png" caption="Click the image to enlarge and view the full configuration: Insert the Braintrust proxy endpoint into Roo Code's Base URL field. Add the Braintrust-specific headers to enable tracing and caching." >}}

4. **Custom Headers**

   * Click **+** to add headers exactly as shown in your UI:

     * `x-bt-use-cache` = `auto`
     * `x-bt-parent` = `project_id:<YOUR_PROJECT_ID>`
   * These instruct the proxy to cache deterministic calls and to start a new trace under your Braintrust project.

   {{< image class="rounded lightbox" src="/img/blog/BraintrustProjectId.png" caption="Get project id in braintrust web ui." >}}

5. **Enable Streaming** (optional)

   * Check **Enable streaming** if you want to stream partial responses back to Roo Code’s editor.

6. **Other toggles**

   * Leave **Use Azure** and **Enable R1 parameters** unchecked unless explicitly needed by your custom provider.

---

## How Caching Works

Braintrust supports three cache modes set via `x-bt-use-cache`:

* **`auto`**: caches only when `temperature=0` or a deterministic `seed` is provided (the default mode)
* **`always`**: caches every supported request (e.g. `/chat/completions`, `/completions`, `/embeddings`) regardless of randomness settings
* **`never`**: bypasses cache entirely—useful for debugging or non-deterministic experiments

> **Pro tip:** To get a cache hit, set **Temperature** to **0** in your Roo Code run configuration. This makes the output deterministic and eligible for replay.

---

## How Tracing Works

Every request that includes `x-bt-parent` will emit a root span into Braintrust’s tracing backend:

* **Header**: `x-bt-parent: project_id:<YOUR_PROJECT_ID>`
* **Key**: your **Braintrust API Key** in the **OpenAI API Key** field
* **Outcome**: each API call is logged as an LLM span under your project, visible in the Braintrust dashboard

This gives you full visibility into prompt inputs, response tokens, timings, and cache hits—all without modifying any application code.


{{< image class="rounded lightbox" src="/img/blog/BraintrustRooCodeChatTrace.png" caption="Braintrust chat trace" >}}

## Further Reading

* **Braintrust AI Proxy Guide** (caching, headers, endpoints) {{< link "https://github.com/braintrustdata/braintrust-proxy" >}}Braintrust AI proxy{{< /link >}}
* **Traceloop OpenLLMetry** (semantic conventions for LLM) {{< link "https://github.com/traceloop/openllmetry" >}}Traceloop OpenLLMetry{{< /link >}}
