---
lang: en
title: Xiaomi Gallery App used unnecessary space on Android phone
description: "Xiaomi phone had no space - the Xiaomi Gallery app is the problem. Read the solution."
date: 2024-07-19T19:44:09.645Z
tags:
    - Xiaomi
    - Android
categories:
    - Android
slug: xiaomi-gallery-app-unnecessary-space-android-phone
thumbnail:
    url: /img/blog/Xiaomi_gallery_app_size.jpg
    author: d.o. (Copilot Designer)
---
# Excessive Space Usage by Xiaomi Gallery App on Android Phones

{{< persona thumbnail="/img/blog/Xiaomi_gallery_app_size.jpg" title="Gallery App used too much space" color="warning" >}}
My Xiaomi smartphone showed that i had not enough space left this days. I was surprised that after a disk cleanup most of the used space was the same. 
After investigation of the used storage in the settings I realized the Xiaomi Gallery-App had a size for ofter 40 GB. But I only had around 1 GB of videos and photos left on the phone.
{{< /persona >}}

# Solution
**Important**: Back up all important videos and photos first.

After searching the with the help of Copilot I discovered the easiest way to fix was to uninstall the updates of the app. Therefore press the Gallery App Icon and call App-Info. [^1] [^2]

If this is not working the next step is to  delete the following folder content:

```
- internal storage/Android/data/com.miui.gallery/files/gallery_disk_cache/full_size
- internal storage/Android/data/com.miui.gallery/files/gallery_disk_cache/small_size 
```

## Background
Inside the folders are all thumbnails ever recorded or saved on the device. The app do not remove the thumbnails after you delete a photo. 

### Reference
[^1]: Reddit  
https://www.reddit.com/r/PocoPhones/comments/me6wd9/comment/iq8ggph/
[^2]: Blog https://www.gearrice.com/update/how-to-free-up-space-on-your-xiaomi-quickly-and-efficiently-with-this-trick/