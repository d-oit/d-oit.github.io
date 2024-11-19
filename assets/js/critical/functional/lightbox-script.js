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

      // Set initial zoom level to 1x
      let zoomLevel = 1

      // Create the floating div for buttons
      const buttonContainer = document.createElement('div')
      buttonContainer.classList.add('button-container')

      // Create the zoom in button
      const zoomInButton = document.createElement('span')
      zoomInButton.classList.add('zoom-in-button')
      zoomInButton.innerHTML = '<i class="fas fa-search-plus"></i>'

      // Create the zoom out button
      const zoomOutButton = document.createElement('span')
      zoomOutButton.classList.add('zoom-out-button')
      zoomOutButton.innerHTML = '<i class="fas fa-search-minus"></i>'

      // Create the close button
      const closeButton = document.createElement('span')
      closeButton.classList.add('close-button')
      closeButton.innerHTML = '<i class="fas fa-times"></i>'

      // Append buttons to the button container
      buttonContainer.appendChild(zoomInButton)
      buttonContainer.appendChild(zoomOutButton)
      buttonContainer.appendChild(closeButton)

      // Append the image and button container to the lightbox
      lightbox.appendChild(lightboxImage)
      lightbox.appendChild(buttonContainer)

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

      // Add click event listener to the zoom in button
      zoomInButton.addEventListener('click', () => {
        if (zoomLevel < 3) {
          zoomLevel += 0.1
          lightboxImage.style.transform = `scale(${zoomLevel})`
        }
      })

      // Add click event listener to the zoom out button
      zoomOutButton.addEventListener('click', () => {
        if (zoomLevel > 0.5) {
          zoomLevel -= 0.1
          lightboxImage.style.transform = `scale(${zoomLevel})`
        }
      })

      // Add keyboard navigation for arrow keys
      document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
          // Logic for navigating to the next image
        } else if (event.key === 'ArrowLeft') {
          // Logic for navigating to the previous image
        }
      })
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
