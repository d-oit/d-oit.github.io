(() => {
  'use strict'

  window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('toggleView').addEventListener('click', function() {
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
  })

})()  