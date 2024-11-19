(() => {
  'use strict'

  window.addEventListener('DOMContentLoaded', () => {
    // Get all the lightbox-icon elements
    const lightboxIcons = document.querySelectorAll('.lightbox-icon')
    const images = document.querySelectorAll('img.lightbox')

    // Function to create and show the lightbox
    function showLightbox (img) {
      // Create the lightbox element
      const lightbox = document.createElement('div')
      lightbox.classList.add('lightbox-container')

      // Create the image element
      let lightboxImage = document.createElement('img')
      lightboxImage = img.cloneNode(true)
      lightboxImage.className = ''
      lightboxImage.classList.add('lightbox-image')
      lightboxImage.classList.add('rounded')

      // Create the close button
      const closeButton = document.createElement('button')
      closeButton.classList.add('close-button')
      closeButton.innerHTML = '❌'

      // Create the next button
      const nextButton = document.createElement('button')
      nextButton.classList.add('next-button')
      nextButton.innerHTML = '➡️'

      // Create the floating toolbar
      const toolbar = document.createElement('div')
      toolbar.classList.add('floating-toolbar')

      // Create zoom in button
      const zoomInButton = document.createElement('button')
      zoomInButton.classList.add('zoom-in-button')
      zoomInButton.innerHTML = '+'

      // Create zoom out button
      const zoomOutButton = document.createElement('button')
      zoomOutButton.classList.add('zoom-out-button')
      zoomOutButton.innerHTML = '-'

      // Append buttons to the toolbar
      toolbar.appendChild(zoomInButton)
      toolbar.appendChild(zoomOutButton)

      // Append the image, close button, next button, and toolbar to the lightbox
      lightbox.appendChild(lightboxImage)
      lightbox.appendChild(closeButton)
      lightbox.appendChild(nextButton)
      lightbox.appendChild(toolbar)

      // Add the lightbox to the body
      document.body.appendChild(lightbox)

      // Add click event listener to the close button
      closeButton.addEventListener('click', () => {
        document.body.removeChild(lightbox)
      })

      // Add click event listener to the lightbox to close it when clicked outside the image
      lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
          document.body.removeChild(lightbox)
        }
      })

      // Add event listeners for zoom buttons
      zoomInButton.addEventListener('click', () => {
        zoomIn(lightboxImage)
      })

      zoomOutButton.addEventListener('click', () => {
        zoomOut(lightboxImage)
      })

      // Add event listener for next button
      nextButton.addEventListener('click', () => {
        showNextImage(lightboxImage)
      })
    }

    // Function to zoom in the image
    function zoomIn (img) {
      const currentWidth = img.clientWidth
      img.style.width = currentWidth * 1.2 + 'px'
    }

    // Function to zoom out the image
    function zoomOut (img) {
      const currentWidth = img.clientWidth
      img.style.width = currentWidth * 0.8 + 'px'
    }

    // Function to show the next image in the lightbox
    function showNextImage (currentImg) {
      const images = document.querySelectorAll('img.lightbox')
      let currentIndex = Array.from(images).indexOf(currentImg)
      let nextIndex = (currentIndex + 1) % images.length
      let nextImg = images[nextIndex]
      showLightbox(nextImg)
    }

    // Add click event listener to each lightbox icon
    lightboxIcons.forEach(icon => {
      icon.addEventListener('click', (event) => {
        // Find the image associated with the icon
        const img = icon.closest('.image-wrapper').querySelector('img')
        if (img) {
          showLightbox(img)
        }
        event.stopPropagation() // Prevent the click from propagating to other elements
      })
    })

    // Add click event listener to each image (if needed)
    images.forEach(img => {
      img.addEventListener('click', () => {
        showLightbox(img)
      })
    })
  })
})()
