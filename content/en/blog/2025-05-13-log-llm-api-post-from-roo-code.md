---
title: Log LLM API Post from Roo Code
description: Explore efficient logging techniques for LLM API interactions with Roo Code's implementation guide
date: 2025-05-13T20:14:30.871Z
preview: ""
draft: false
tags:
  - VSCode
  - API
categories:
  - Software Development
thumbnail:
  url: /img/blog/rooCodeProxyVScodeHTTPpost.png
  author: d.o.it
lang: en
keywords:
  - Postman
  - Proxy
  - Roo Code
  - VSCode
  - Log
---

## 1. Capturing with Postman’s Built-In Proxy

Postman Desktop includes a simple “HTTP proxy” you can enable in seconds.

- Open Settings → Proxy
- Under Capture traffic click Start Proxy Session
- Default port is 5559 (you can edit it with the little pencil icon)
- Configure your client or system to use `http://localhost:5559`
- All HTTP/S traffic from your machine will now flow through Postman—every request appears in the History pane

> **Tip:** You don’t need to do anything special in Postman’s request builder––just hit Send and the proxy log shows the full exchange.

[Postman Docs](https://learning.postman.com/docs/sending-requests/capturing-request-data/capturing-http-requests/)

## 2. Pointing Postman at an External Proxy

If you already run a corporate or custom proxy (e.g. Fiddler, Charles, mitmproxy), Postman can forward through it:

- In Settings → Proxy, toggle Use Custom Proxy
- Fill in your proxy’s host, port, and (if needed) credentials
- Save & restart Postman

> Now Postman sends all its traffic through your external proxy—ideal if you want to aggregate logs in one place.

[Postman Docs](https://learning.postman.com/docs/sending-requests/capturing-request-data/capturing-http-requests/)

## 3. Capturing with mitmproxy

When you need more power—filter rules, scripting, advanced TLS features—mitmproxy is the go-to:

- **Install:**
  ```bash
  pip install mitmproxy
  ```

- **Launch:**
  ```bash
  mitmproxy --mode regular --listen-port 8987
  ```

- **Trust the CA:**
  Follow the prompts to install mitmproxy’s root cert into your OS or browser

- **Inspect:**
  Use the console UI (mitmproxy) or dump to a file (`mitmdump -w logfile.mitm`)

> By default you’ll see timestamp, method, URL, headers, and body

[Mitmproxy Documentation](https://docs.mitmproxy.org/stable/)

## 4. Feeding VS Code Through Your Proxy

Once your proxy is up, you want every developer tool to obey it—including VS Code’s built-in HTTP client or any extension that does REST calls. Simply:

```bash
code --proxy-server="http://localhost:8987/"
```

> This tells VS Code to route its network stack through your mitmproxy (or Postman proxy) on port 8987. You’ll immediately start seeing VS Code–originated POSTs, GETs, etc., in your proxy UI.

## 5. Digging Into Your Logs

With traffic streaming, look for:

- **Last empty chunk:** often a sign of incomplete streaming or unclosed request body. Check the Roo Code [API Proviver](https://github.com/RooVetGit/Roo-Code/tree/main/src/api/providers) or [transform](https://github.com/RooVetGit/Roo-Code/tree/main/src/api/transform) app code of the used API.
- **Repeated requests:** infinite-loop retries if your client auto-retries on certain status codes
- **Unexpected headers:** missing Content-Type or malformed Authorization tokens
- **Timing gaps:** long pauses suggesting server delays or network hiccups

> Because you have full visibility, you can trace “which call caused that 500” down to the exact JSON payload and headers.

![image](https://gist.github.com/user-attachments/assets/a1871e1d-940b-4538-bbc5-435ec5105f4d)

## Reference

[GitHub gist](https://gist.github.com/d-oit/722505d57e1cecc3667655930c3b72f4)
