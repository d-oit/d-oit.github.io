---
title: Get licenses from used NuGet packages for your .NET Core Solution
description: "How to get a txt or Excel file for all licence of used Nuget package in your .NET Core Solution"
date: 2024-05-17T11:06:48.903Z
tags: [".NET","licence", "Visual Studio","Software Development"]
---

**ToDo**: Get all licenses from used NuGet Packages in the Visual Studio Solution. Create a licence text file or Excel file with all found license and save all licence as a separate Text File.

**Let’s try…**

Best solution so far: jump to [Solution 5](#solution5) or [Solution 6](#solution6)

## Solution 1: Get-Package

- Open Visual Studio .NET Core Solution
- Open Package Manager Console and execute:

```ps 
Get-Package | Select-Object Id,LicenseUrl
```


**Output Result (Nuget Package Name, License Url):**

xunit.runner.visualstudio                               https://raw.githubusercontent.com/xunit/xunit/master/license.txt                       
NSubstitute                                             https://github.com/nsubstitute/NSubstitute/raw/master/LICENSE.txt         
Good… but the direct reference project NuGet package. Need also the Licence of all dlls.

## Solution 2: PowerShell: Save license as text file ##

Try out with the PowerShell script. Save the code as DownloadNugetLicense.ps1 in the VS solution director.

Run the PowerShell Script with ./DownloadNugetLicense.ps1 in the Visual Studio Package Manager Console.

**PowerShell Code:**

```ps
Split-Path -parent $dte.Solution.FileName | cd; New-Item -ItemType Directory -Force -Path ".\licenses";
@( Get-Project -All | ? { $_.ProjectName } | % {
    Get-Package -ProjectName $_.ProjectName | ? { $_.LicenseUrl }
} ) | Sort-Object Id -Unique | % {
    $pkg = $_;
    Try {
        if ($pkg.Id -notlike 'microsoft*' -and $pkg.LicenseUrl.StartsWith('http')) {
            Write-Host ("Download license for nuget package " + $pkg.Id + " from " + $pkg.LicenseUrl);
            #Write-Host (ConvertTo-Json ($pkg));

            $licenseUrl = $pkg.LicenseUrl
            if ($licenseUrl.contains('github.com')) {
                $licenseUrl = $licenseUrl.replace("/blob/", "/raw/")
            }

            $extension = ".txt"
            if ($licenseUrl.EndsWith(".md")) {
                $extension = ".md"
            }

            (New-Object System.Net.WebClient).DownloadFile($licenseUrl, (Join-Path (pwd) 'licenses\') + $pkg.Id + $extension);
        }
    }
    Catch [system.exception] {
        Write-Host ("Could not download license for " + $pkg.Id)
    }
}
```

## Solution 3: PowerShell: All license in package manager output

Not perfect - I also need the licencse for the used Dlls inside any NuGet Package.

---------------------
NuGet Package License
---------------------
Id      |      LicenseUrl  |    License
---------------------
Abp.AspNetCore; https://github.com/aspnetboilerplate/aspnetboilerplate/blob/master/LICENSE; The MIT License (MIT)
Abp.AspNetCore.SignalR; https://github.com/aspnetboilerplate/aspnetboilerplate/blob/master/LICENSE; The MIT License (MIT)
Abp.AutoMapper; https://github.com/aspnetboilerplate/aspnetboilerplate/blob/master/LICENSE; The MIT License (MIT)
Abp.Castle.Log4Net; https://github.com/aspnetboilerplate/aspnetboilerplate/blob/master/LICENSE; The MIT License (MIT)
Abp.HangFire; https://github.com/aspnetboilerplate/aspnetboilerplate/blob/master/LICENSE; The MIT License (MIT)
Abp.RedisCache; https://github.com/aspnetboilerplate/aspnetboilerplate/blob/master/LICENSE; The MIT License (MIT)
Abp.TestBase; https://github.com/aspnetboilerplate/aspnetboilerplate/blob/master/LICENSE; The MIT License (MIT)
Abp.ZeroCore; https://github.com/aspnetboilerplate/aspnetboilerplate/blob/master/LICENSE; The MIT License (MIT)
Abp.ZeroCore.EntityFrameworkCore; https://github.com/aspnetboilerplate/aspnetboilerplate/blob/master/LICENSE; The MIT License (MIT)
AspNet.Security.OpenIdConnect.Server; http://www.apache.org/licenses/LICENSE-2.0.html; <!DOCTYPE html>
Castle.Core; http://www.apache.org/licenses/LICENSE-2.0.html; <!DOCTYPE html>

**PowerShell Code**
```ps
Write-Host("---------------------");
Write-Host("NuGet Package License");
Write-Host("---------------------");
Write-Host("Id      |      LicenseUrl  |    License"); 
Write-Host("---------------------");
@( Get-Project -All | ? { $_.ProjectName } | % {
    Get-Package -ProjectName $_.ProjectName | ? { $_.LicenseUrl }
} ) | Sort-Object Id -Unique | % {
    $pkg = $_;
    $file = 
    Try {
        if ($pkg.Id -notlike 'microsoft*' -and $pkg.LicenseUrl.StartsWith('http')) {

            $licenseUrl = $pkg.LicenseUrl
            if ($licenseUrl.contains('github.com')) {
                $licenseUrl = $licenseUrl.replace("/blob/", "/raw/")
            }

            $extension = ".txt"
            if ($licenseUrl.EndsWith(".md")) {
                $extension = ".md"
            }

            $filePath = (Join-Path (pwd) 'licenses\') + $pkg.Id + $extension;

            $textLicence = Get-Content $filePath | Select-Object -First 1
            Write-Host($pkg.Id + "; " + $_.LicenseUrl + "; " + $textLicence);
        }
    }
    Catch [system.exception] {
    Write-Host ($error[0].Exception);
        Write-Host ("Could not read license for " + $pkg.Id)
    }
}
```

## Solution 4: Visual Studio Tool >> Package Licenses

Visual Studio **2017** Extension:
List license of all NuGet packages inside the ‘packages’ folder of any Visual Studio solution. Refer license from the Nuget Project-Url / License-Url in the package metadata. Download license and license text from GitHub, spdx.org.

[Visual Studio Marketplace: Package Licenses](https://marketplace.visualstudio.com/items?itemName=jz5.PackageLicenses)


**Package Folder**

Package Folder not exist for the solution?

**NuGet.Config**

Create Nuget.Config for the Visual Studio solution:


```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
<config>
    <add key="globalPackagesFolder" value=".\packages" />
</config>
</configuration>
```

![Visual Studio Screenshot](/img/blog/list_package_licenses.jpg)


## Solution 5: Custom package licenses command line {#solution5}

Create your own license file output (Excel or TEXT) with the following .NET Core Console Project:

https://github.com/do-it-ger/DoitPackagesLicenses

## Solution 6: .NET Nuget License Utility {#solution6}

A .net core tool to print the licenses of a project. This tool support .NET Core and .NET Standard Projects.

https://github.com/tomchavakis/nuget-license