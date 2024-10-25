{
  /* <script type="module">
        import { initImageSelector } from './image-selector.js';
        
        document.addEventListener('DOMContentLoaded', function() {
            initImageSelector('imageSelectorContainer');
        });
    </script> */
}

export function initImageSelector(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return;
  }

  container.innerHTML = `
          <div class="container mt-5">
            <h1 class="mb-4">Images</h1>
            <div class="row mb-3">
              <div class="col">
                <input type="text" id="searchInput" class="form-control" placeholder="Search...">
              </div>
              <div class="col-auto">
                <button id="copyNameBtn" class="btn btn-secondary">Copy Name</button>
                <button id="downloadBtn" class="btn btn-secondary">Download</button>
                <button id="uploadBtn" class="btn btn-secondary">Upload</button>
              </div>
            </div>
            <div id="messageContainer" class="alert d-none" role="alert"></div>
            <div id="imageContainer" class="row row-cols-1 row-cols-md-3 g-4"></div>
            <div class="mt-3">
              <button id="deleteSelectedBtn" class="btn btn-danger">Delete selected</button>
              <button id="chooseSelectedBtn" class="btn btn-success">Choose selected</button>
            </div>
          </div>
        `;

  const imageContainer = container.querySelector("#imageContainer");
  const searchInput = container.querySelector("#searchInput");
  const messageContainer = container.querySelector("#messageContainer");
  const copyNameBtn = container.querySelector("#copyNameBtn");
  const downloadBtn = container.querySelector("#downloadBtn");
  const uploadBtn = container.querySelector("#uploadBtn");
  const deleteSelectedBtn = container.querySelector("#deleteSelectedBtn");
  const chooseSelectedBtn = container.querySelector("#chooseSelectedBtn");

  let images = [];

  // Fetch images from API
  fetch("/api/media-list")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      return response.json();
    })
    .then((data) => {
      images = data;
      renderImages(images);
    })
    .catch((error) => {
      showMessage(error.message, "danger");
    });

  // Render images
  function renderImages(imagesToRender) {
    imageContainer.innerHTML = "";
    imagesToRender.forEach((image) => {
      const col = document.createElement("div");
      col.className = "col";
      col.innerHTML = `
              <div class="card h-100">
                <img src="${image.url}" class="card-img-top" alt="${image.name}">
                <div class="card-body">
                  <h5 class="card-title">${image.name}</h5>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="${image.id}" id="check-${image.id}">
                    <label class="form-check-label" for="check-${image.id}">
                      Select
                    </label>
                  </div>
                </div>
              </div>
            `;
      imageContainer.appendChild(col);
    });
  }

  // Search functionality
  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const filteredImages = images.filter((image) =>
      image.name.toLowerCase().includes(searchTerm)
    );
    renderImages(filteredImages);
  });

  // Copy Name functionality
  copyNameBtn.addEventListener("click", function () {
    const selectedImage = getSelectedImage();
    if (selectedImage) {
      navigator.clipboard
        .writeText(selectedImage.name)
        .then(() => showMessage("Image name copied to clipboard", "success"))
        .catch(() => showMessage("Failed to copy image name", "danger"));
    } else {
      showMessage("Please select an image", "warning");
    }
  });

  // Download functionality
  downloadBtn.addEventListener("click", function () {
    const selectedImage = getSelectedImage();
    if (selectedImage) {
      window.open(selectedImage.url, "_blank");
    } else {
      showMessage("Please select an image to download", "warning");
    }
  });

  // Upload functionality (placeholder)
  uploadBtn.addEventListener("click", function () {
    showMessage("Upload functionality not implemented", "info");
  });

  // Delete selected functionality (placeholder)
  deleteSelectedBtn.addEventListener("click", function () {
    const selectedImages = getSelectedImages();
    if (selectedImages.length > 0) {
      showMessage(
        `Deleting ${selectedImages.length} image(s) - Not actually implemented`,
        "info"
      );
    } else {
      showMessage("Please select at least one image to delete", "warning");
    }
  });

  // Choose selected functionality
  chooseSelectedBtn.addEventListener("click", function () {
    const selectedImages = getSelectedImages();
    if (selectedImages.length > 0) {
      showMessage(
        `Selected ${selectedImages.length} image(s): ${selectedImages
          .map((img) => img.name)
          .join(", ")}`,
        "success"
      );
    } else {
      showMessage("Please select at least one image", "warning");
    }
  });

  // Helper function to get selected image
  function getSelectedImage() {
    const selectedCheckbox = container.querySelector(
      ".form-check-input:checked"
    );
    if (selectedCheckbox) {
      return images.find((image) => image.id === selectedCheckbox.value);
    }
    return null;
  }

  // Helper function to get all selected images
  function getSelectedImages() {
    const selectedCheckboxes = container.querySelectorAll(
      ".form-check-input:checked"
    );
    return Array.from(selectedCheckboxes).map((checkbox) =>
      images.find((image) => image.id === checkbox.value)
    );
  }

  // Helper function to show messages
  function showMessage(message, type) {
    messageContainer.textContent = message;
    messageContainer.className = `alert alert-${type}`;
    messageContainer.classList.remove("d-none");
    setTimeout(() => {
      messageContainer.classList.add("d-none");
    }, 3000);
  }
}
