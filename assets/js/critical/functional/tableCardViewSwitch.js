if (window.location.href.includes('/free-basketball-live-streams/')) {
  (() => {
    'use strict'

    function changeView () {
      const listView = document.getElementById('table-view')
      const cardView = document.getElementById('card-view')
      if (listView.classList.contains('d-none')) {
        listView.classList.remove('d-none')
        cardView.classList.add('d-none')
        window.sessionStorage.setItem('toggleViewBasketStreamsView', 'table')
      } else {
        listView.classList.add('d-none')
        cardView.classList.remove('d-none')
        window.sessionStorage.setItem('toggleViewBasketStreamsView', 'card')
      }
    }

    function filterItems () {
      const filter = document
        .getElementById('searchBoxInlinePage')
        .value.toLowerCase()
      // TODO const leagueFilter = document.getElementById('leagueFilter').value.toLowerCase()
      const dateFilter = document
        .getElementById('basketDateFilterInput')
        .value.toLowerCase()

      if (window.sessionStorage.getItem('toggleViewBasketStreamsView') === 'table') {
        const queries = []

        if (filter) {
          queries.push({
            terms: [filter] // Search term

          })
        }

        if (dateFilter) {
          queries.push({
            terms: [dateFilter],
            columns: [] // Assuming date is in first column, adjust index if needed
          })
        }

        const simpleDataTable = document.getElementById('free-basket-streams-table')
        if (simpleDataTable) {
          console.log('Applying queries:', queries)
          const table = window.dt
          table.multiSearch(queries)
          console.log(table)
        }
        return
      }

      const items = document.querySelectorAll('[data-search-content]')
      items.forEach(function (item) {
        const text = item.textContent.toLowerCase()
        // TODO  const league = item.getAttribute('data-league').toLowerCase()
        const date = item.getAttribute('data-date').toLowerCase()
        if (text.includes(filter) && date.includes(dateFilter)) {
          item.classList.remove('d-none')
        } else {
          item.classList.add('d-none')
        }
      })
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

        const dateFilter = document.getElementById('basketDateFilterInput')
        const searchBox = document.getElementById('searchBoxInlinePage')
        const leagueFilter = document.getElementById('leagueFilter')
        const clearFilterButton = document.getElementById('clearFilterButton')
        if (clearFilterButton != null) {
          clearFilterButton.addEventListener('click', function () {
            dateFilter.value = null
            searchBox.value = null
            filterItems()
          })
        }
        if (searchBox != null || dateFilter != null || leagueFilter != null) {
          searchBox.addEventListener('input', filterItems)
          if (leagueFilter != null) {
            leagueFilter.addEventListener('change', filterItems)
          }
          dateFilter.addEventListener('input', filterItems)
        }
      }
    })
  })()
}
