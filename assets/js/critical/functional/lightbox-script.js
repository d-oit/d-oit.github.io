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
      zoomInButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/></svg>'

      // Create the zoom out button
      const zoomOutButton = document.createElement('span')
      zoomOutButton.classList.add('zoom-out-button')
      zoomOutButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/></svg>'

      // Create the close button
      const closeButton = document.createElement('span')
      closeButton.classList.add('close-button')
      closeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/></svg>'

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
