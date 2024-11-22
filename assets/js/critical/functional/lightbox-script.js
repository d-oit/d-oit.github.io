{{- $enableZoom := .Site.Params.lightbox.enablezoom -}}
{{- $enableRotate := .Site.Params.lightbox.enableRotate -}}
{{- $disableSliderButtons := .Site.Params.lightbox.disableSliderButtons -}}

(() => {
  'use strict';

  // Wait for DOM content to load
  window.addEventListener('DOMContentLoaded', () => {
    const lightboxIcons = document.querySelectorAll('.lightbox-icon');
    const images = getLightboxImages();

    const FA_NAMESPACE = 'http://www.w3.org/2000/svg';

    // Helper to create SVG icons (if needed)
    function createSVGIcon(iconPath) {
      const svg = document.createElementNS(FA_NAMESPACE, 'svg');
      svg.setAttribute('xmlns', FA_NAMESPACE);
      svg.setAttribute('viewBox', '0 0 512 512');
      svg.setAttribute('width', '24');
      svg.setAttribute('height', '24');

      const path = document.createElementNS(FA_NAMESPACE, 'path');
      path.setAttribute('d', iconPath);

      svg.appendChild(path);
      return svg;
    }

    // Function to create and show the lightbox
    function showLightbox(img) {
      try {
        const lightbox = document.createElement('div');
        lightbox.classList.add('lightbox-container');

        const lightboxImage = createLightboxImage(img);

        const toolbar = document.createElement('div');
        toolbar.classList.add('lightbox-toolbar');

        const zoomInButton = createButton('zoom-in-button', '+');
        const zoomOutButton = createButton('zoom-out-button', '-');
        const rotateLeftButton = createButton('rotate-left-button', '⟲');
        const rotateRightButton = createButton('rotate-right-button', '⟳');
        const closeButton = createButton('close-button', '&times;');
        const prevButton = createButton('prev-button btn', '&larr;');
        const nextButton = createButton('next-button btn', '&rarr;');

        const slidePrevious = document.createElement('div');
        slidePrevious.classList.add('slide-lightbox-container', 'slide-btn-container-previous');
        slidePrevious.appendChild(prevButton);

        const slideNext = document.createElement('div');
        slideNext.classList.add('slide-lightbox-container', 'slide-btn-container-next');
        slideNext.appendChild(nextButton);

        {{ if $enableZoom }}
          toolbar.appendChild(zoomInButton);
          toolbar.appendChild(zoomOutButton);
        {{ end }}

        {{ if $enableRotate }}
          toolbar.appendChild(rotateLeftButton);
          toolbar.appendChild(rotateRightButton);
        {{ end }}

        toolbar.appendChild(closeButton);

        lightbox.appendChild(lightboxImage);
        lightbox.appendChild(toolbar);

        {{ if not $disableSliderButtons }} 
          lightbox.appendChild(slidePrevious);
          lightbox.appendChild(slideNext);
        {{ end }}

        document.body.appendChild(lightbox);

        closeButton.addEventListener('click', () => document.body.removeChild(lightbox));
        lightbox.addEventListener('click', (e) => {
          if (e.target === lightbox) document.body.removeChild(lightbox);
        });

        attachLightboxControls(lightbox, lightboxImage);
      } catch (error) {
        console.error('Error showing lightbox:', error);
      }
    }

    // Helper function to create a button
    function createButton(className, innerHTML) {
      const button = document.createElement('button');
      button.className = className;
      button.type = 'button';
      button.innerHTML = innerHTML;
      return button;
    }

    // Function to zoom in the image
    function zoomIn(img) {
      const currentWidth = img.clientWidth;
      img.style.width = currentWidth * 1.2 + 'px';
    }

    // Function to zoom out the image
    function zoomOut(img) {
      const currentWidth = img.clientWidth;
      img.style.width = currentWidth * 0.8 + 'px';
    }

    // Function to rotate the image
    function rotateImage(img, degrees) {
      const currentRotation = getRotationDegrees(img);
      img.style.transform = `rotate(${currentRotation + degrees}deg)`;
    }

    // Helper to get current rotation degrees
    function getRotationDegrees(img) {
      const matrix = window.getComputedStyle(img).getPropertyValue('transform');
      if (matrix === 'none') return 0;
      const values = matrix.split('(')[1].split(')')[0].split(',');
      const a = values[0];
      const b = values[1];
      const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
      return angle < 0 ? angle + 360 : angle;
    }

    // Function to navigate images
    function navigateImage(currentImg, direction) {
      try {
        const lightboxImages = getLightboxImages();
        const currentIndex = Array.from(lightboxImages).findIndex((img) => img.src === currentImg.src);
        const newIndex = currentIndex + direction;

        if (newIndex >= 0 && newIndex < lightboxImages.length) {
          const newImage = lightboxImages[newIndex];
         
          const newLightboxImage = createLightboxImage(newImage);
          const lightboxContainer = currentImg.closest('.lightbox-container');
          if(lightboxContainer == null) return
          lightboxContainer.replaceChild(newLightboxImage, currentImg);
          attachLightboxControls(lightboxContainer, newLightboxImage);
        
          const prevButton = lightboxContainer.querySelector('.prev-button');
          const nextButton = lightboxContainer.querySelector('.next-button');
          updateNavigationButtons(newLightboxImage, prevButton, nextButton);
        }
      } catch (error) {
        console.error('Error navigating image:', error);
      }
    }

    // Attach event listeners to controls
    function attachLightboxControls(lightboxContainer, lightboxImage) {
      const zoomInButton = lightboxContainer.querySelector('.zoom-in-button');
      const zoomOutButton = lightboxContainer.querySelector('.zoom-out-button');
      const rotateLeftButton = lightboxContainer.querySelector('.rotate-left-button');
      const rotateRightButton = lightboxContainer.querySelector('.rotate-right-button');
      const prevButton = lightboxContainer.querySelector('.prev-button');
      const nextButton = lightboxContainer.querySelector('.next-button');
          
      updateNavigationButtons(lightboxImage, prevButton, nextButton);

      if (zoomInButton) zoomInButton.addEventListener('click', () => zoomIn(lightboxImage));
      if (zoomOutButton) zoomOutButton.addEventListener('click', () => zoomOut(lightboxImage));
      if (rotateLeftButton) rotateLeftButton.addEventListener('click', () => rotateImage(lightboxImage, -90));
      if (rotateRightButton) rotateRightButton.addEventListener('click', () => rotateImage(lightboxImage, 90));
      if (prevButton) prevButton.addEventListener('click', () => navigateImage(lightboxImage, -1));
      if (nextButton) nextButton.addEventListener('click', () => navigateImage(lightboxImage, 1));
    }

    // Update navigation button states
    function updateNavigationButtons(img, prevButton, nextButton) {
      const lightboxImages = getLightboxImages();
      const currentIndex = Array.from(lightboxImages).findIndex((originalImg) => originalImg.src === img.src);

      if (lightboxImages.length <= 1) {
        prevButton.style.display = 'none';
        nextButton.style.display = 'none';
      } else {
        prevButton.style.display = currentIndex === 0 ? 'none' : 'block';
        nextButton.style.display = currentIndex === lightboxImages.length - 1 ? 'none' : 'block';
      }
    }

    // Helper to create lightbox image
    function createLightboxImage(img) {
      const lightboxImage = img.cloneNode(true);
      lightboxImage.classList.add('lightbox-image', 'rounded');
      return lightboxImage;
    }

    // Get unique lightbox images
    function getLightboxImages() {
      const lightboxImages = document.querySelectorAll('img.lightbox');
      return Array.from(lightboxImages).filter(
        (img, index, arr) => arr.findIndex((item) => item.src === img.src) === index
      );
    }

    // Add click event to lightbox icons and images
    lightboxIcons.forEach((icon) => {
      icon.addEventListener('click', (event) => {
        const img = icon.closest('.image-wrapper')?.querySelector('img');
        if (img) showLightbox(img);
        event.stopPropagation();
      });
    });

    images.forEach((img) => {
      img.addEventListener('click', () => showLightbox(img));
    });
  });
})();
