{{- $enableZoom := site.Params.lightbox.enablezoom -}}
{{- $enableRotate := .Site.Params.lightbox.enableRotate -}}

(() => {
  'use strict'

  window.addEventListener('DOMContentLoaded', () => {
    // Get all the lightbox-icon elements
    const lightboxIcons = document.querySelectorAll('.lightbox-icon')
    const images = getLightboxImages()

    // Font Awesome SVG namespace
    const FA_NAMESPACE = 'http://www.w3.org/2000/svg'

    // Helper to create SVG elements for Font Awesome icons
    // eslint-disable-next-line no-unused-vars
    function createSVGIcon(iconPath) {
      const svg = document.createElementNS(FA_NAMESPACE, 'svg')
      svg.setAttribute('xmlns', FA_NAMESPACE)
      svg.setAttribute('viewBox', '0 0 512 512') // Standard Font Awesome viewBox
      svg.setAttribute('width', '24') // Icon width
      svg.setAttribute('height', '24') // Icon height

      const path = document.createElementNS(FA_NAMESPACE, 'path')
      path.setAttribute('d', iconPath)

      svg.appendChild(path)
      return svg
    }

    // Function to create and show the lightbox
    function showLightbox(img) {
      // Create the lightbox element
      const lightbox = document.createElement('div')
      lightbox.classList.add('lightbox-container')

      // Create the image element
      let lightboxImage = createLightboxImage(img)

      // Create the floating toolbar
      const toolbar = document.createElement('div')
      toolbar.classList.add('lightbox-toolbar')

      // Create zoom in button
      const zoomInButton = document.createElement('button')
      zoomInButton.classList.add('zoom-in-button')
      zoomInButton.type = 'button'
      zoomInButton.innerHTML = '+'

      // Create zoom out button
      const zoomOutButton = document.createElement('button')
      zoomOutButton.classList.add('zoom-out-button')
      zoomOutButton.type = 'button'
      zoomOutButton.innerHTML = '-'

      // Create rotate left button
      const rotateLeftButton = document.createElement('button')
      rotateLeftButton.classList.add('rotate-left-button')
      rotateLeftButton.innerHTML = '⟲'

      // Create rotate right button
      const rotateRightButton = document.createElement('button')
      rotateRightButton.classList.add('rotate-right-button')
      rotateRightButton.innerHTML = '⟳'

      // Create the close button
      const closeButton = document.createElement('button')
      closeButton.classList.add('close-button')
      closeButton.type = 'button'
      closeButton.innerHTML = '&times;'

      // Create previous button
      const prevButton = document.createElement('button')
      prevButton.classList.add('prev-button')
      prevButton.classList.add('btn')
      prevButton.type = 'button'
      prevButton.innerHTML = '&larr;'

      // Create next button
      const nextButton = document.createElement('button')
      nextButton.classList.add('next-button')
      nextButton.classList.add('btn')
      nextButton.type = 'button'
      nextButton.innerHTML = '&rarr;'

      // Create the slide container
      const slidePrevious = document.createElement('div')
      slidePrevious.classList.add('slide-lightbox-container')
      slidePrevious.classList.add('slide-btn-container-previous')
      slidePrevious.appendChild(prevButton)

      const slideNext = document.createElement('div')
      slideNext.classList.add('slide-lightbox-container')
      slideNext.classList.add('slide-btn-container-next')
      slideNext.appendChild(nextButton)

      // Append buttons to the toolbar
      {{ if $enableZoom }}
        toolbar.appendChild(zoomInButton)
        toolbar.appendChild(zoomOutButton)
      {{ end }}

      {{ if $enableRotate }}
        toolbar.appendChild(rotateLeftButton)
        toolbar.appendChild(rotateRightButton)
      {{ end }}

      toolbar.appendChild(closeButton)

      // Append the image, close button, and toolbar to the lightbox
      lightbox.appendChild(lightboxImage)
      lightbox.appendChild(toolbar)
      lightbox.appendChild(slideNext)
      lightbox.appendChild(slidePrevious)

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

      // Add event listeners for previous and next buttons
      prevButton.addEventListener('click', () => {
        navigateImage(lightboxImage, -1)
      })

      nextButton.addEventListener('click', () => {
        navigateImage(lightboxImage, 1)
      })

      // Disable buttons if at the first or last image
      updateNavigationButtons(lightboxImage, prevButton, nextButton)
    }

    // Function to zoom in the image
    function zoomIn(img) {
      const currentWidth = img.clientWidth
      img.classList.add('fullscreen-image')
      img.style.width = currentWidth * 1.2 + 'px'
    }

    // Function to zoom out the image
    function zoomOut(img) {
      const currentWidth = img.clientWidth
      img.classList.remove('fullscreen-image')
      img.style.width = currentWidth * 0.8 + 'px'
    }

    // Function to rotate the image left
    // eslint-disable-next-line no-unused-vars
    function rotateLeft(img) {
      const currentRotation = getRotationDegrees(img)
      img.style.transform = `rotate(${currentRotation - 90}deg)`
    }

    // Function to rotate the image right
    // eslint-disable-next-line no-unused-vars
    function rotateRight(img) {
      const currentRotation = getRotationDegrees(img)
      img.style.transform = `rotate(${currentRotation + 90}deg)`
    }

    // Helper function to get the current rotation degrees of an image
    function getRotationDegrees(img) {
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

    // Function to navigate to the previous or next image
    function navigateImage(currentImg, direction) {
      const lightboxImages = getLightboxImages()

      // Find current image index
      const currentIndex = Array.from(lightboxImages).findIndex(
        img => img.src === currentImg.src
      )

      const newIndex = currentIndex + direction

      // Check if new index is valid
      if (newIndex >= 0 && newIndex < lightboxImages.length) {
        const newImage = lightboxImages[newIndex]

        // Create a new cloned image
        const newLightboxImage = createLightboxImage(newImage)

        // Replace the existing lightbox image
        const lightboxContainer = currentImg.closest('.lightbox-container')
        if(lightboxContainer == null) {
          return
        }
        lightboxContainer.replaceChild(newLightboxImage, currentImg)
      
        // Reattach event listeners for zoom, rotate, etc.
        attachLightboxControls(lightboxContainer, newLightboxImage)

        const prevButton = lightboxContainer.querySelector('.prev-button')
        const nextButton = lightboxContainer.querySelector('.next-button')

        // Update navigation buttons
        updateNavigationButtons(newLightboxImage, prevButton, nextButton)
      }
    }

    function attachLightboxControls(lightboxContainer, lightboxImage) {
      // Zoom buttons
      const zoomInButton = lightboxContainer.querySelector('.zoom-in-button')
      const zoomOutButton = lightboxContainer.querySelector('.zoom-out-button')
      if (zoomInButton) {
        zoomInButton.addEventListener('click', () => zoomIn(lightboxImage))
      }
      if (zoomOutButton) {
        zoomOutButton.addEventListener('click', () => zoomOut(lightboxImage))
      }

      // Rotate buttons
      const rotateLeftButton = lightboxContainer.querySelector('.rotate-left-button')
      const rotateRightButton = lightboxContainer.querySelector('.rotate-right-button')
      if (rotateLeftButton) {
        rotateLeftButton.addEventListener('click', () => rotateLeft(lightboxImage))
      }
      if (rotateRightButton) {
        rotateRightButton.addEventListener('click', () => rotateRight(lightboxImage))
      }

      // Previous and next buttons
      const prevButton = lightboxContainer.querySelector('.prev-button')
      const nextButton = lightboxContainer.querySelector('.next-button')
      if (prevButton) {
        prevButton.addEventListener('click', () => navigateImage(lightboxImage, -1))
      }
      if (nextButton) {
        nextButton.addEventListener('click', () => navigateImage(lightboxImage, 1))
      }
    }

    // Function to update the state of navigation buttons
    function updateNavigationButtons(img, prevButton, nextButton) {
      const lightboxImages = getLightboxImages()
      // Find current index by matching src with original images
      const currentIndex = Array.from(lightboxImages).findIndex(
        originalImg => originalImg.src === img.src
      )

      // Hide/show buttons based on index
      if (lightboxImages.length <= 1) {
        prevButton.classList.add('d-none')
        nextButton.classList.add('d-none')
      } else {
        // First image
        if (currentIndex === 0) {
          prevButton.classList.add('d-none')
          nextButton.classList.remove('d-none')
        }
        // Last image
        else if (currentIndex === lightboxImages.length - 1) {
          prevButton.classList.remove('d-none')
          nextButton.classList.add('d-none')
        }
        // Middle images
        else {
          prevButton.classList.remove('d-none')
          nextButton.classList.remove('d-none')
        }
      }
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

  function createLightboxImage(img) {
    let lightboxImage = document.createElement('img')
    lightboxImage = img.cloneNode(true)
    lightboxImage.className = ''
    lightboxImage.classList.add('lightbox-image')
    lightboxImage.classList.add('rounded')
    return lightboxImage
  }
})()
function getLightboxImages() {
  // Select all lightbox images
  const lightboxImages = document.querySelectorAll('img.lightbox')

  // Filter images with unique `src` attributes
  const uniqueSrcImages = Array.from(lightboxImages).filter((img, index, arr) => {
    // Find duplicates by checking if current `src` exists earlier in the array
    return arr.findIndex(item => item.src === img.src) === index
  })

  return uniqueSrcImages

}

