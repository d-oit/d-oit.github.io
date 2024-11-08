---
title: 'Try out: Frontend Editor for Hugo / Hinode Theme with Go'
slug: try-out-create-a-frontend-editor-for-hugo-hinode-theme-with-go
date: 2024-11-08T18:34:04Z
tags: [Hugo,Website,Go,Web,Hinode]
categories: [Software Development]
thumbnail:
  url: /img/blog/try-out-create-a-frontend-editor-for-hugo-hinode-theme-with-go.png
draft: true
---

After check out a few frontend editors for Hugo like TinaCMS and others i decided to create one for myself. At the moment I use VS Code with FrontMatter and missing same feature.
Especially for other user who are not using VS Code.

Also I would like to learn a few more things with Go, so give it a go...

*The AdminEditor is WIP and not production ready yet.*

## What I need for editing

- Internal links to other markdown files, also in different language sub folder (en, de)
- Link and edit images
- Spelling (cSpell for VS Code is great)
- Grammar (LTeX for VS Code does not always work)
- Simple Edit and customize the text
- Unique categories and tags
- Translations
- Workflow for edit and release
- Connection to other api / scripts
- Use Browser Add-In for editing
- Add same AI logic and other stuff

## First impression

{{< carousel ratio="16x9" class="col-sm-12 col-lg-8 mx-auto" >}}
  {{< img src="img/blog/adminEditor/doitAdminEditorNewPost1.png" caption="Create post title" >}}
  {{< img src="img/blog/adminEditor//doitAdminEditorNewPost2.png" caption="Thumbnail Url or copy and convert image to Hugo folder" >}}
  {{< img src="img/blog/adminEditor//doitAdminEditorNewPost3.png" caption="Category and Tags" >}}
{{< /carousel >}}

## Go Backend

Let's start with the Go backend:

{{< refLink ref="frontend-editor-hugo-go-doc1.md.md" lang="en" text="Start - Go Backend" showButton="true" color="info" >}}
