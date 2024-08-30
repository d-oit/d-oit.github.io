{{ if .Site.Params.main.showBackToTopButton }}

(() => {
  'use strict'
	
   // Scroll to Top Function
   function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Show/Hide Button on Scroll
  window.onscroll = function() {
    var scrollToTopBtn = document.getElementById("scrollToTopBtn");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      scrollToTopBtn.style.display = "block";
    } else {
      scrollToTopBtn.style.display = "none";
    }
  };

})()

{{ end }}   