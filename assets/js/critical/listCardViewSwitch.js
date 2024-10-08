if (window.location.href.includes("/sites/")) {
  (() => {
    "use strict";

    function changeView() {
      var listView = document.getElementById("listView");
      var cardView = document.getElementById("cardView");
      if (listView.classList.contains("d-none")) {
        listView.classList.remove("d-none");
        cardView.classList.add("d-none");
        sessionStorage.setItem("toggleViewSitemap", "list");
      } else {
        listView.classList.add("d-none");
        cardView.classList.remove("d-none");
        sessionStorage.setItem("toggleViewSitemap", "card");
      }
    }

    window.addEventListener("DOMContentLoaded", () => {
      var toogleView = document.getElementById("toggleView");
      if (toogleView != null) {
        if(sessionStorage.getItem("toggleViewSitemap") == "card") {
          changeView();
        }
        
        toogleView.addEventListener("click", function () {
          changeView();
        });

        var searchBox = document.getElementById("searchBoxInlinePage");
        if (searchBox != null) {          
          searchBox.addEventListener("input", function () {
            var filter = this.value.toLowerCase();
            var items = document.querySelectorAll('[data-search-content]');            
            items.forEach(function (item) {
              var text = item.textContent.toLowerCase();
              if (text.includes(filter)) {
                item.classList.remove('d-none');
              } else {
                item.classList.add('d-none');
              }
            });
          });
        }
      }
    });
  })();
}
