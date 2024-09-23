// console.log('{{ .Page.RelPermalink   }}');
// console.log('{{ .Page.Permalink   }}');

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
    }
  })

})()  

{{ end -}}