---
title: "MS SQL: Date Format"
description: Microsoft SQL Server date Format
date: 2024-05-17T10:54:33.643Z
thumbnail:
  url: img/blog/SQLDateTime.jpg
  origin: Copilot Designer
tags:
  - SQL
  - Software Development
slug: ms-sql-date-format
---
**Date without time**

`CONVERT(varchar, GETDATE(), 112)`

**Date with time**

`CONVERT(varchar, GETDATE(), 112) + CONVERT(varchar, GETDATE(), 108)`

or

`CONVERT(varchar, GETDATE(), 112) + CONVERT(VARCHAR, DATEPART(hh, GetDate())) + CONVERT(VARCHAR, DATEPART(mi, GetDate()))`


More information about DateTime: 
https://learn.microsoft.com/en-us/sql/t-sql/functions/date-and-time-data-types-and-functions-transact-sql?view=sql-server-ver16