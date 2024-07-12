---
lang: en
title: Uninstall "Mobile devices" / Phone Link in Windows 
description: If you don't need Phone Link / YourPhone in Windows this is the easiest way to uninstall the app.
date: 2024-05-21T15:32:38.601Z
tags:
  - Windows
thumbnail:
  url: img/blog/mobiledevicesWindows11.jpg
  author: d.o.
slug: uninstall-phone-link-windows
---



With the **Phone Link** app on your Windows linked to your iPhone or Android phone. 
If you don't need it this is the easiest way for me to uninstall the app.

## Windows 11 Phone Link uninstall

Run the following PowerShell code with Admin rights:

```ps
get-appxpackage -allusers *crossdevice* | remove-appxpackage
```

## Windows 10 Phone Link / YourPhone uninstall

Run the following PowerShell 5x (old version) code with Admin rights:

```ps
Get-AppxPackage Microsoft.YourPhone -AllUsers | Remove-AppxPackage
```