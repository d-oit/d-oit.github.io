---
title: Embed Google Calendar responsive
description: How to embed Google Calendar on your website
date: 2024-07-02T08:59:06.664Z
tags:
    - Website
    - Google Calendar
categories:
    - Software Development
slug: embed-google-calendar-responsive
---
## Why embed Google Calendar on my website?
I like to watch basketball games. Sometime I found interesting matches and insert them into my google calendar. 

## Embed Google Calendar

For an easy way to embed Google Calendar responsive i found the following way better than like ChatGPT & Co. on the Stack Overflow website. 
The only way that i found to make it nice is to invert the iframe to make it darker. 


```<style>
/* CSS for responsive iFrame for calendar*/
@media (min-width: 550px) {
  .responsive-iframe-container {padding-bottom: 75%;}
}
@media (max-width: 550px) {
  .responsive-iframe-container {padding-bottom: 150%;}
}
.responsive-iframe-container {
  position: relative;
  padding-top: 0;
  height: 0;
  overflow: hidden;
}
.responsive-iframe-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
iframe{
   filter: invert(.9) saturate(0.5) hue-rotate(145deg);
}
</style>

<div class="responsive-iframe-container">
  <iframe title="BasketCalendar" src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FBerlin&bgcolor=%23ffffff&title=Kostenlose%20Livestreams%20-%20Basketball%20-&mode=AGENDA&src=ZjhhMTRjNDAzN2Q5YWI0MTFmOTNmMTllZTM2OTIxOGYwZWQ1NGJlN2MyZDg4ZGVhZjA5ZDZiNzZmYmU3MmU3ZkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23D81B60" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>
</div>```

[Responsive]: https://stackoverflow.com/questions/39006765/how-do-you-properly-wrap-google-calendar-inside-div-and-make-it-responsive
[Style nicer]:https://stackoverflow.com/questions/49306347/how-to-customize-google-calendar-with-css
