---
title: Uninstall "Mobile devices" in Windows 11
description: "If you don't need Phone Link in Windows 11 this is the easiest way to uninstall the app."
date: 2024-05-21T15:32:38.601Z
tags: ["Windows 11"]
thumbnail:
  url: img/blog/mobiledevicesWindows11.jpg
  author: d.o.
---

With the **Phone Link** app on your Windows 11 linked to your iPhone or Android phone. 
If you don't need it this is the easist way for me to unistall the app.

Run the following PowerShell code with Admin rights:

```ps
get-appxpackage -allusers *crossdevice* | remove-appxpackage
```