{{ if in .Permalink "/about/" }}

(() => {
  'use strict'
  
  window.addEventListener('DOMContentLoaded', () => {
    var toogleView = document.getElementById('toggleView');
    if(toogleView != null) {
      toogleView.addEventListener('click', function() {
        var listView = document.getElementById('listView');
        var cardView = document.getElementById('cardView');
        if (listView.classList.contains('d-none')) {
          listView.classList.remove('d-none');
          cardView.classList.add('d-none');
        } else {
          listView.classList.add('d-none');
          cardView.classList.remove('d-none');
        }
      });

      var searchBox = document.getElementById('searchBoxInlinePage');
      if(searchBox != null) {
        searchBox.addEventListener('input', function() {
          var filter = this.value.toLowerCase();
          var listItems = document.querySelectorAll('#listView li');

          listItems.forEach(function(item) {
              var text = item.textContent.toLowerCase();
              if (text.includes(filter)) {
                  item.style.display = '';
              } else {
                  item.style.display = 'none';
              }
          });
        });
      }
    }
  });

})();

{{ end }}