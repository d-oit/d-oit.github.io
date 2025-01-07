---
title: "Winget Not Recognized After Windows Update"
date: 2025-01-01T10:54:33.643Z
thumbnail:
  url: img/blog/windows-winget-not-recognized.png
  origin: Copilot Designer
tags:
  - WinGet
  - Windows
slug: winget-not-recognized-windows-update    
---

## Fixing Winget Not Recognized After Windows Update

If you're experiencing issues with Winget not being recognized after a Windows update, you can try reinstalling it using a PowerShell script from PSGallery. This method has worked for me on both Windows 10 and Windows 11.

### Reinstall Winget Using PowerShell

Follow these steps to reinstall Winget:

1. **Open PowerShell as Administrator**:
   - Right-click on the Start menu and select "Windows PowerShell (Admin)" or "Windows Terminal (Admin)".

2. **Run the Following Commands**:
   Copy and paste the commands below into the PowerShell window, pressing Enter after each line:

   ```powershell
   Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Force
   Set-PSRepository -Name 'PSGallery' -InstallationPolicy Trusted
   Install-Script -Name winget-install -Force
   winget-install.ps1 -Force
   ```

### Source

This solution is based on the issue reported on the official Winget GitHub page: [Winget GitHub Issue #3832](https://github.com/microsoft/winget-cli/issues/3832).
