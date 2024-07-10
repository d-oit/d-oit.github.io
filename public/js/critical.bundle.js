/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2022 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

(() => {
  'use strict'

  const supportedThemes = ['auto', 'dark', 'light'];

  // retrieves the currently stored theme from local storage (cookie)
  const storedTheme = localStorage.getItem('theme')

  // retrieves the theme preferred by the client, defaults to light
  function getPreferredTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // retrieves the current theme, either from local storage or client's preferences
  function getTheme() {
    if (storedTheme) {
      return storedTheme
    } else {
      const preference = getPreferredTheme()
      localStorage.setItem('theme', preference)
      return preference
    }
  }

  // applies and stores requested theme
  function setTheme(theme) {
    if (!supportedThemes.includes(theme)) {
      theme = 'auto'
    }
    localStorage.setItem('theme', theme)

    if (theme === 'auto') {
      document.documentElement.setAttribute('data-bs-theme', (getPreferredTheme()))
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme)
    }

    document.querySelectorAll('.navbar-mode-selector').forEach(chk => {
      chk.checked = (document.documentElement.getAttribute('data-bs-theme') === 'light')
    })
  }

  // alternates the currently active theme
  function toggleTheme() {
    const target = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark'
    setTheme(target)
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (storedTheme !== 'light' || storedTheme !== 'dark') {
      setTheme(getPreferredTheme())
    }
  })

  window.addEventListener('DOMContentLoaded', () => {
    setTheme(getTheme())
    const light = (document.documentElement.getAttribute('data-bs-theme') === 'light')

    document.querySelectorAll('.ball').forEach(ball => {
      ball.classList.add('notransition');
    })
    
    document.querySelectorAll('.navbar-mode-selector').forEach(chk => {
      chk.checked = light
      chk.addEventListener('change', function () {
        toggleTheme()
      })
    })

    document.querySelectorAll('.ball').forEach(ball => {
      ball.offsetHeight; // flush css changes
      ball.classList.remove('notransition');
    })
  })

  window.addEventListener('load', () => {
    const light = (document.documentElement.getAttribute('data-bs-theme') === 'light')
    document.querySelectorAll('.navbar-mode-selector').forEach(chk => {
      chk.checked = light
    })
  });  
})();(() => {
  'use strict'

  const defaultContentLanguage = 'en';
  
  // Function to set the selected language in localStorage
  function setLanguage(language) {
    localStorage.setItem("selectedLanguage", language)
  }

  // Function to get the selected language from localStorage
  function getLanguage() {
    return localStorage.getItem("selectedLanguage")
  }

  function removeDefaultLanguage() {
    localStorage.removeItem("selectedLanguage")
  }

  // Function to apply the selected language to the website
  function applyLanguage(language, href ) {
    if (document.documentElement.lang != language) {
      document.documentElement.lang = language
      if(window.location.pathname != href) {
        window.location.href = window.location.origin + '/' + language + '/'
      } else {
        window.location.href = window.Location.origin + href
      }
    }
  }

  // Event listener for language selection
  document.addEventListener("DOMContentLoaded", () => {
    const languageItems = document.querySelectorAll(
      "#language-selector .dropdown-item"
    )

    if (languageItems.length > 0) {
      // Apply the stored language on page load
      const storedLanguage = getLanguage()
      if (storedLanguage) {
        languageItems.forEach(item => {
          if (item.getAttribute("hreflang") == storedLanguage) {
            item.classList.add("active")
            applyLanguage(storedLanguage, item.getAttribute("href"))
          }
          else {
            item.classList.remove("active")
          }
        })
      }

      // Update the language when the user selects a new one
      languageItems.forEach(item => {
        item.addEventListener("click", event => {
          event.preventDefault()
          const selectedLanguage =
              item.getAttribute("hreflang") 

          if (selectedLanguage) {
            setLanguage(selectedLanguage)
            window.location.href = window.location.origin + item.getAttribute("href")
            languageItems.forEach(i => i.classList.remove("active"))
            item.classList.add("active")
          }
        })
      })
    }
  })
})()