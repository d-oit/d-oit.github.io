---
title: "Fix Docker Desktop High CPU on Windows 11 (WSL 2)"
description: "A comprehensive guide to resolving high CPU usage in Docker Desktop when using WSL 2 on Windows 11, based on a GitHub gist and community research."
date: 2025-09-29T14:00:00+02:00
expiryDate: 2025-10-10T14:00:00+02:00
draft: false
tags: ["docker", "wsl", "windows-11", "performance", "cpu-usage"]
categories: ["Development", "Troubleshooting"]
slug: fix-docker-desktop-high-cpu-usage-wsl-windows-11
thumbnail:
   url: /img/blog/2025-09-29-fix-docker-desktop-high-cpu-usage-wsl-windows-11.png
   author: d.o.
---

## Introduction

If you've been experiencing high CPU usage (often 100%) on Windows 11 when running Docker Desktop with WSL 2 integration enabled, you're not alone. This persistent issue has plagued many developers using Docker for containerized development. Recently, I came across a simple yet effective solution shared in a GitHub gist that provides an immediate fix.

## The Problem

When Docker Desktop is running with WSL 2 integration enabled, you might notice the `vmmem.exe` process consuming excessive CPU resources. This process manages the virtual machine memory for WSL 2, and when it goes haywire, it can make your system sluggish, cause fan noise, and drain battery life.

The issue is particularly prevalent after system hibernation, updates, or when containers are started/stopped frequently.

## The Gist Solution

A straightforward gist on GitHub ([d-oit/4cc0c57fcafaadda4ce2723244f23a38](https://gist.github.com/d-oit/4cc0c57fcafaadda4ce2723244f23a38)) provides the simplest solution: **disable WSL integration in Docker Desktop**.

### How to Disable WSL Integration

1. Open Docker Desktop
2. Go to Settings → Resources → WSL Integration
3. Uncheck "Enable integration with my default WSL distro"
4. Apply and restart Docker Desktop
5. Enable integration with additional distros: Ubuntu

This immediately resolves the high CPU usage by preventing Docker from running within the WSL environment.

## Understanding Why This Works

Docker Desktop's WSL 2 integration allows seamless file sharing and performance benefits, but it can introduce instability. When disabled, Docker runs in its own virtual machine, avoiding conflicts with WSL processes that cause the CPU spikes.

## Alternative Solutions (If You Need WSL Integration)

If you prefer to keep WSL integration enabled, here are additional fixes from community research:

### 1. Limit WSL Memory and Processors

Create or edit `%USERPROFILE%\.wslconfig`:

```ini
[wsl2]
memory=4GB
processors=2
swap=0
```

### 2. Disable Automatic Updates

In Docker Desktop Settings → General, uncheck "Automatically check for updates".

### 3. Update WSL

Run `wsl --update` to ensure you have the latest WSL version with bug fixes.

### 4. Shutdown WSL When Not in Use

Use `wsl --shutdown` to reset the WSL environment.

### 5. Switch to Hyper-V Backend

**Important**: This option is only available on Windows 11/10 Pro, Enterprise, or Education editions. Windows Home users cannot use Hyper-V backend without a registry modification.

#### Step-by-Step Instructions:

1. **Check Windows Edition Requirements**:
   - Open Settings → System → About
   - Verify you have Windows 11/10 Pro, Enterprise, or Education
   - If you're on Home edition, use the registry hack below

2. **For Windows Pro/Enterprise/Education**:
   - Open Docker Desktop
   - Go to Settings → General
   - Uncheck "Use the WSL 2 based engine"
   - Check "Use Hyper-V backend" (if available)
   - Click "Apply & Restart"

3. **For Windows Home Edition (Registry Hack)**:

   ```powershell
   REG ADD "HKEY_LOCAL_MACHINE\software\Microsoft\Windows NT\CurrentVersion" /v EditionId /T REG_EXPAND_SZ /d Professional /F
   ```

   After running this command:
   - Quit Docker Desktop completely (check Task Manager)
   - Restart Docker Desktop
   - The Hyper-V option should now be available

4. **Alternative: Command Line Installation**:

   ```bash
   "Docker Desktop Installer.exe" install --backend=hyper-v
   ```

5. **Verify the Switch**:
   - Open Docker Desktop Settings → General
   - Confirm Hyper-V backend is selected
   - Run `docker info` in terminal (should show hyperv)

#### Performance Comparison:

- **WSL 2 Advantages**: Better file system performance, seamless integration with Windows tools, generally faster container startup
- **Hyper-V Advantages**: More stable for certain workloads, better isolation, proven technology
- **Trade-offs**: Hyper-V may use more system resources and has slower file sharing compared to WSL 2

#### Troubleshooting:

If you encounter issues after switching:

1. Ensure Hyper-V is enabled in Windows Features (search "Turn Windows features on or off")
2. Enable virtualization in BIOS/UEFI settings
3. Restart your computer after making changes
4. Check that your processor supports virtualization (most modern CPUs do)

## Conclusion

The gist's solution of disabling WSL integration provides the most reliable fix for high CPU usage. While alternative methods exist, they often require ongoing maintenance or compromise functionality.

If you're experiencing this issue, try disabling WSL integration first - it's the quickest path to a stable Docker environment on Windows 11.

## References

- Original Gist: [d-oit/4cc0c57fcafaadda4ce2723244f23a38](https://gist.github.com/d-oit/4cc0c57fcafaadda4ce2723244f23a38)
- Docker Desktop WSL 2 Documentation: [docs.docker.com/desktop/features/wsl](https://docs.docker.com/desktop/features/wsl/)
- Microsoft WSL Configuration: [learn.microsoft.com/en-us/windows/wsl/wsl-config](https://learn.microsoft.com/en-us/windows/wsl/wsl-config)
- Community Issue Thread: [github.com/docker/for-win/issues/12266](https://github.com/docker/for-win/issues/12266)

