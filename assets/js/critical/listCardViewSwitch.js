if (window.location.href.includes('/sites/')) {
  (() => {
    'use strict'

    function changeView () {
      const listView = document.getElementById('listView')
      const cardView = document.getElementById('cardView')
      if (listView.classList.contains('d-none')) {
        listView.classList.remove('d-none')
        cardView.classList.add('d-none')
        window.sessionStorage.setItem('toggleViewSitemap', 'list')
      } else {
        listView.classList.add('d-none')
        cardView.classList.remove('d-none')
        window.sessionStorage.setItem('toggleViewSitemap', 'card')
      }
    }

    window.addEventListener('DOMContentLoaded', () => {
      const toogleView = document.getElementById('toggleView')
      if (toogleView != null) {
        if (window.sessionStorage.getItem('toggleViewSitemap') === 'card') {
          changeView()
        }

        toogleView.addEventListener('click', function () {
          changeView()
        })

        const searchBox = document.getElementById('searchBoxInlinePage')
        if (searchBox != null) {
          searchBox.addEventListener('input', function () {
            const filter = this.value.toLowerCase()
            const items = document.querySelectorAll('[data-search-content]')
            items.forEach(function (item) {
              const text = item.textContent.toLowerCase()
              if (text.includes(filter)) {
                item.classList.remove('d-none')
              } else {
                item.classList.add('d-none')
              }
            })
          })
        }
      }
    })
  })()
}
