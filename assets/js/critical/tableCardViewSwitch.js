if (window.location.href.includes("/free-basketball-live-streams/")) {
  (() => {
    "use strict";

    function changeView() {
      var listView = document.getElementById("table-view");
      var cardView = document.getElementById("card-view");
      if (listView.classList.contains("d-none")) {
        listView.classList.remove("d-none");
        cardView.classList.add("d-none");
        sessionStorage.setItem("toggleViewBasketStreamsView", "table");
      } else {
        listView.classList.add("d-none");
        cardView.classList.remove("d-none");
        sessionStorage.setItem("toggleViewBasketStreamsView", "card");
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
