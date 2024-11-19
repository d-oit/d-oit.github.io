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
      const closeButton = document.createElement('span')
      closeButton.classList.add('close-button')
      closeButton.innerHTML = '&times;'

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

      // Create rotate left button
      const rotateLeftButton = document.createElement('button')
      rotateLeftButton.classList.add('rotate-left-button')
      rotateLeftButton.innerHTML = '⟲'

      // Create rotate right button
      const rotateRightButton = document.createElement('button')
      rotateRightButton.classList.add('rotate-right-button')
      rotateRightButton.innerHTML = '⟳'

      // Append buttons to the toolbar
      toolbar.appendChild(zoomInButton)
      toolbar.appendChild(zoomOutButton)
      toolbar.appendChild(rotateLeftButton)
      toolbar.appendChild(rotateRightButton)

      // Append the image, close button, and toolbar to the lightbox
      lightbox.appendChild(lightboxImage)
      lightbox.appendChild(closeButton)
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

      // Add event listeners for zoom and rotate buttons
      zoomInButton.addEventListener('click', () => {
        zoomIn(lightboxImage)
      })

      zoomOutButton.addEventListener('click', () => {
        zoomOut(lightboxImage)
      })

      rotateLeftButton.addEventListener('click', () => {
        rotateLeft(lightboxImage)
      })

      rotateRightButton.addEventListener('click', () => {
        rotateRight(lightboxImage)
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

    // Function to rotate the image left
    function rotateLeft (img) {
      const currentRotation = getRotationDegrees(img)
      img.style.transform = `rotate(${currentRotation - 90}deg)`
    }

    // Function to rotate the image right
    function rotateRight (img) {
      const currentRotation = getRotationDegrees(img)
      img.style.transform = `rotate(${currentRotation + 90}deg)`
    }

    // Helper function to get the current rotation degrees of an image
    function getRotationDegrees (img) {
      const matrix = window.getComputedStyle(img).getPropertyValue('transform')
      if (matrix === 'none') {
        return 0
      }
      const values = matrix.split('(')[1].split(')')[0].split(',')
      const a = values[0]
      const b = values[1]
      const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI))
      return angle < 0 ? angle + 360 : angle
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
