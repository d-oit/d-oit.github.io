---
title: 'Frontend Editor Hugo - Go Backend Introduction'
slug: frontend-editor-hugo-go-doc-introduction
url: /en/blog/frontend-editor-hugo-go-doc-introduction
date: 2024-11-08T18:34:04Z
tags: [Hugo,Website,Go,Web,Hinode]
categories: [Software Development]
thumbnail:
  url: /img/blog/frontend-editor-hugo-go-doc.png
draft: false
---

## Backend

The backend with the HTTP API is defined for now all in the main.go file in the adminEditor folder.  

1. Structures:

   - **Tag**: Represents a tag with a name and count.

   - **Category**: Represents a category with a name and count.

   - **ShortcodeData**: Represents the data for a shortcode.

   - **ShortcodeFunc**: Represents a function for rendering a shortcode.

   - **Shortcodes**: Represents a map of shortcode names to their corresponding functions.

   - **ServerConfig**: Represents the configuration for the server, including image resizing options and asset folder paths.

   {{< file full="true" path="./adminEditor/main.go" lang="golang" id="adminEditor-main-go" show="false" >}}

2. Functions:

   - **main**: The entry point of the program. It sets up the server routes, initializes the server configuration, and starts the server.

   - **initShortcodes**: Initializes the shortcodes map with the provided shortcode functions.

   - **handleCreatePost**: Handles the creation of a new blog post. It extracts the necessary data from the request, generates the markdown content, saves the file, updates the tags and categories, and returns the filename.

   - **handleUploadMediaFolder**: Handles the uploading of a media folder. It extracts the files from the request, generates unique filenames, saves the files in the media folder, and returns the filenames.

   - **handleUploadMedia**: Handles the uploading of a single media file. It extracts the file from the request, generates a unique filename, saves the file in the media folder, and returns the filename.

   - **handleDeleteMedia**: Handles the deletion of a media file. It extracts the filename from the request, checks if the file exists, deletes the file, and returns a success status.
   - processMediaFile: Processes a media file by resizing it and saving it in the asset folder. It returns the new filename.

   - **createSlug**: Creates a URL-friendly slug from a given title.

   - **generateMarkdownContent**: Generates the markdown content for a blog post based on the provided data.

   - **updateTagsAndCategories**: Updates the tags and categories data files with new entries.

   - **getAllTags**: Retrieves all tags from the tags data file.

   - **getAllCategories**: Retrieves all categories from the categories data file.

   - **resizeImage**: Resizes an image using the provided dimensions and resampling method.

### d.o.it Hugo / Hinode Theme Admin Editor

{{< refLink ref="try-out-create-a-frontend-editor-for-hugo--hinode-theme-with-go.md" lang="en" text="Start - Admin Editor" showButton="true" color="info" >}}
