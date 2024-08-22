---
lang: "en-US"
title: "comdirect Rest API Sample"
description: "Doit.Comdirect.Rest.Api: C# .NET Rest API for comdirect BackgroundService sample"
date: 2024-08-21T14:56:31.284Z
layout: docs
thumbnail:
  url: img/doitComdirectRestAPISample.jpg
  origin: Copilot Designer
  author: d.o.
tags:
  - API
  - Banking
  - C#
  - Rest
  - comdirect
slug: comdirect-rest-api-sample
---

{{< fullscreenAndPrintButton >}}

{{< button color="dark" cue=false order="last" icon="fab github" tooltip="Source Code on github" href="https://github.com/d-oit/Doit.Comdirect.Rest.Api" >}}
    Source Code
{{< /button >}}

Visual Studio XML documentation Markdown syntax created with:
https://github.com/lijunle/Vsxmd

<a name='T-ConsoleSample-ComdirectApiHostedService'></a>
## ComdirectApiHostedService `type`

##### Namespace

ConsoleSample

<a name='M-ConsoleSample-ComdirectApiHostedService-AuthFlow-Comdirect-Rest-Api-AuthClient,Comdirect-Rest-Api-ComdirectOAuthToken-'></a>
### AuthFlow(authClient,token) `method`

##### Summary

Performs the secondary authentication flow for the Comdirect API.
This method is responsible for obtaining a valid access token and refresh token,
and then saving the session details for future use.

##### Returns

An asynchronous Task that completes when the secondary authentication flow is completed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| authClient | [Comdirect.Rest.Api.AuthClient](#T-Comdirect-Rest-Api-AuthClient 'Comdirect.Rest.Api.AuthClient') | An instance of the AuthClient class, which provides methods for interacting with the Comdirect authentication API. |
| token | [Comdirect.Rest.Api.ComdirectOAuthToken](#T-Comdirect-Rest-Api-ComdirectOAuthToken 'Comdirect.Rest.Api.ComdirectOAuthToken') | The ComdirectOAuthToken object containing the access token obtained during the initial authentication flow. |

<a name='M-ConsoleSample-ComdirectApiHostedService-CheckReuseTan-Microsoft-Extensions-Configuration-IConfiguration-'></a>
### CheckReuseTan() `method`

##### Summary

Checks if the saved TAN (Transaction Authentication Number) can be reused based on the session validity.

##### Returns

Returns true if the saved TAN can be reused, false otherwise.

##### Parameters

This method has no parameters.

<a name='M-ConsoleSample-ComdirectApiHostedService-ComdirectSession'></a>
### ComdirectSession() `method`

##### Summary

Initializes a new instance of the [AuthClient](#T-Comdirect-Rest-Api-AuthClient 'Comdirect.Rest.Api.AuthClient') class for interacting with the Comdirect authentication API.
This method handles the authentication flow, including obtaining a valid access token and refresh token.
If a saved TAN can be reused, it will be used to refresh the session. Otherwise, the user will be prompted to enter a TAN.

##### Returns

An asynchronous Task that returns an instance of the [AuthClient](#T-Comdirect-Rest-Api-AuthClient 'Comdirect.Rest.Api.AuthClient') class, representing the authenticated client.

##### Parameters

This method has no parameters.

<a name='M-ConsoleSample-ComdirectApiHostedService-GetComdirecAccountBalances-Comdirect-Rest-Api-AuthClient-'></a>
### GetComdirecAccountBalances(client) `method`

##### Summary

Retrieves and displays the account balances for all Comdirect banking accounts.

##### Returns

An asynchronous Task that completes when the account balances have been retrieved and displayed.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| client | [Comdirect.Rest.Api.AuthClient](#T-Comdirect-Rest-Api-AuthClient 'Comdirect.Rest.Api.AuthClient') | An instance of the AuthClient class for interacting with the Comdirect authentication API. |

<a name='M-ConsoleSample-ComdirectApiHostedService-RefreshTan-Comdirect-Rest-Api-AuthClient-'></a>
### RefreshTan(authClient) `method`

##### Summary

Refreshes the TAN (Transaction Authentication Number) session using the saved values.

##### Returns

An asynchronous Task that completes when the TAN session refresh is completed.
If the refresh token flow fails, an exception is thrown.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| authClient | [Comdirect.Rest.Api.AuthClient](#T-Comdirect-Rest-Api-AuthClient 'Comdirect.Rest.Api.AuthClient') | An instance of the AuthClient class for interacting with the Comdirect authentication API. |

<a name='M-ConsoleSample-ComdirectApiHostedService-SaveSessionApplication-Comdirect-Rest-Api-AuthClient,Comdirect-Rest-Api-ComdirectOAuthToken-'></a>
### SaveSessionApplication(authClient,token) `method`

##### Summary

Saves the session details for future use by updating the application's settings.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| authClient | [Comdirect.Rest.Api.AuthClient](#T-Comdirect-Rest-Api-AuthClient 'Comdirect.Rest.Api.AuthClient') | An instance of the AuthClient class, which provides methods for interacting with the Comdirect authentication API. |
| token | [Comdirect.Rest.Api.ComdirectOAuthToken](#T-Comdirect-Rest-Api-ComdirectOAuthToken 'Comdirect.Rest.Api.ComdirectOAuthToken') | The ComdirectOAuthToken object containing the access token obtained during the initial authentication flow. |
