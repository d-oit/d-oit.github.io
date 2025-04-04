/**
 * This script handles the mode customization for the Hugo / Hinode website.
 * GDPR compliance: User click on the save button after selected a mode.
 * It provides a dark mode, light mode, and auto mode based on the user's preference.
 * The selected theme is saved with an icon in the localStorage for persistence across sessions.
 *
 * @author d.o.it - Dominik Oswald
 * @version 1.0.0
 */
{{- if site.Params.main.enableDarkMode -}}

(() => {
  'use strict'

  // Retrieve the theme from localStorage, default to 'auto'
  let selectedTheme = localStorage.getItem('themeMode') || 'auto';

  // Define the SVG paths for the theme icons
  const themeIcons = {
      light: '<path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>',
      dark: '<path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z"/>',
      auto: '<path d="M8 15A7 7 0 1 0 8 1v14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"/>'
  };

  // Function to retrieve the theme preferred by the client, defaults to light
  function getPreferredTheme() {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // Function to update the theme display with the selected theme icon
  function updateThemeDisplay(theme) {
      const currentThemeIcon = document.getElementById('currentThemeIcon');
      currentThemeIcon.innerHTML = themeIcons[theme];
  }

  // Function to select and apply the theme
  function selectTheme(theme) {
      updateThemeDisplay(theme);
      const options = document.querySelectorAll('.theme-option');
      options.forEach(option => {
          if (option.dataset.theme === theme) {
              option.classList.add('active');
              option.querySelector('.save-icon').classList.replace('d-none', 'd-inline-block');
          } else {
              option.classList.remove('active');
              option.querySelector('.save-icon').classList.replace('d-inline-block', 'd-none');
          }
      });
      setTheme(theme);
  }

  // Function to apply the requested theme
  function setTheme(theme) {
    if (theme === 'auto') {
      document.documentElement.setAttribute('data-bs-theme', (getPreferredTheme()))
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme)
    }
  }

  // Function to save the selected theme and show a toast notification
  function saveAndToastTheme(theme) {
    setTheme(theme);
    // Only save to the localStorage after the user clicks on the save button
    localStorage.setItem('themeMode', theme);

    // Show toast from navbar-mode.html
    var myToastEl = document.getElementById('liveToastSaveThemMode')
    var toast = bootstrap.Toast.getOrCreateInstance(myToastEl) 
    toast.show();
  }

  // Function to handle the click event on the theme mode options
  function onClickThemeMode(element) {
    const theme = element.getAttribute('data-theme');
    selectTheme(theme);
  }

  // Function to handle the click event on the save theme mode button
  function onClickSaveThemeMode(element) {
    const theme = element.getAttribute('data-theme');
    saveAndToastTheme(theme);
  }

  // Event listener to handle the change in the user's preferred color scheme
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (storedTheme !== 'light' || storedTheme !== 'dark') {
        selectTheme(getPreferredTheme())
    }
  })

  // Event listener to handle the DOMContentLoaded event
  window.addEventListener('DOMContentLoaded', () => {
      // selectedTheme -> the theme from localStorage
      selectTheme(selectedTheme);

      const options = document.querySelectorAll('.theme-option');
      options.forEach(option => {
          option.addEventListener('click', (e) => {
              const theme = option.dataset.theme;
              if (e.target.classList.contains('save-icon')) {
                  saveAndToastTheme(theme);
              } else {
                  selectTheme(theme);
                  e.stopPropagation();
              }
          });
      });
  })

})()
{{- end -}} 