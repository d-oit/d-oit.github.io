---
title: "MS SQL: Date Format"
description: "Microsoft SQL Server date Format"
date: 2024-05-17T10:54:33.643Z
tags: ["SQL","Software Development"]
---


**Date without time**

`CONVERT(varchar, GETDATE(), 112)`

**Date with time**

`CONVERT(varchar, GETDATE(), 112) + CONVERT(varchar, GETDATE(), 108)`

or

`CONVERT(varchar, GETDATE(), 112) + CONVERT(VARCHAR, DATEPART(hh, GetDate())) + CONVERT(VARCHAR, DATEPART(mi, GetDate()))`
