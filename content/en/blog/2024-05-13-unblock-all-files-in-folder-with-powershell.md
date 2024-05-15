---
title: Unblock all files in folder with PowerShell
description: Unblocks files that were downloaded from the Internet with PowerShell
date: 2024-05-13
tags: ["PowerShell", "Windows"]
---

Unblocks files that were downloaded from the internet with PowerShell in Windows:

```
dir "C:\Users\$Env:UserName\Downloads" | Unblock-File
```

[Unblock-File PowerShell API Referenz](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/unblock-file?view=powershell-7.4&viewFallbackFrom=powershell-6)
