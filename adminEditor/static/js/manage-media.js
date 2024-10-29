import { initImageSelector } from './image-selector.js';

class ImageEditor {
    constructor() {
        this.editor = null;
        this.uploadedFile = null;
        this.selectedImage = null;
        this.createInitialStructure();
        this.initializeEditor();
        this.initializeImageSelector();
        this.setupEventListeners();
    }

    createInitialStructure() {
        // Create the necessary DOM structure
        const mainContainer = document.createElement('div');
        mainContainer.className = 'container';
        
        // Create upload section
        const uploadSection = document.createElement('div');
        uploadSection.className = 'upload-section';
        uploadSection.innerHTML = `
            <h3>Upload New Image</h3>
            <div class="mt-2">
                <input type="file" id="imageUpload" accept="image/*" class="form-control" />
                <small class="text-muted">Drag and drop an image or click to select</small>
            </div>
        `;

        // Create editor section
        const editorSection = document.createElement('div');
        editorSection.className = 'editor-section';
        editorSection.style.display = 'none';
        
        // Create the editor container
        const editorContainer = document.createElement('div');
        editorContainer.id = 'tuiImageEditor';
        editorSection.appendChild(editorContainer);

        // Create buttons
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'btn-group mt-3';
        buttonGroup.innerHTML = `
            <button id="saveBtn" class="btn btn-primary">Save Changes</button>
            <button id="cancelBtn" class="btn btn-secondary">Cancel</button>
        `;
        editorSection.appendChild(buttonGroup);

        // Create image selector container
        const imageSelectorContainer = document.createElement('div');
        imageSelectorContainer.id = 'imageSelector';

        // Append everything to main container
        mainContainer.appendChild(uploadSection);
        mainContainer.appendChild(editorSection);
        mainContainer.appendChild(imageSelectorContainer);

        // Find the target container in the DOM
        const targetContainer = document.querySelector('#image-upload-editor') || document.body;
        targetContainer.appendChild(mainContainer);
    }

    initializeEditor() {
        // Ensure the editor container exists
        const editorContainer = document.getElementById('tuiImageEditor');
        if (!editorContainer) {
            console.error('Editor container not found');
            return;
        }

        // Wait a brief moment to ensure DOM is ready
        setTimeout(() => {
            try {
                this.editor = new tui.ImageEditor('#tuiImageEditor', {
                    includeUI: {
                        loadImage: {
                            path: '',
                            name: 'Blank'
                        },
                        theme: {
                            'common.bi.image': 'https://uicdn.toast.com/toastui/img/tui-image-editor-bi.png',
                            'common.bisize.width': '251px',
                            'common.bisize.height': '21px'
                        },
                        menu: ['crop', 'flip', 'rotate', 'draw', 'shape', 'icon', 'text', 'mask', 'filter'],
                        initMenu: 'crop',
                        menuBarPosition: 'bottom'
                    },
                    cssMaxWidth: 700,
                    cssMaxHeight: 500,
                    selectionStyle: {
                        cornerSize: 20,
                        rotatingPointOffset: 70
                    }
                });
            } catch (error) {
                console.error('Failed to initialize editor:', error);
                this.showMessage('Failed to initialize image editor', 'danger');
            }
        }, 100);
    }

    initializeImageSelector() {
        // Initialize the image selector with custom config
        const container = document.getElementById('imageSelector');
        container.innerHTML = `
            <div class="container mt-5">
                <h2 class="mb-4">Existing Images</h2>
                <div class="row mb-3">
                    <div class="col">
                        <input type="text" id="searchInput" class="form-control" placeholder="Search images...">
                    </div>
                    <div class="col-auto">
                        <button id="editSelectedBtn" class="btn btn-primary">Edit Selected</button>
                        <button id="deleteSelectedBtn" class="btn btn-danger">Delete Selected</button>
                    </div>
                </div>
                <div id="messageContainer" class="alert d-none" role="alert"></div>
                <div id="imageContainer" class="row row-cols-1 row-cols-md-3 g-4"></div>
            </div>
        `;

        // Fetch and render images
        this.loadImages();
    }

    async loadImages() {
        try {
            const response = await fetch('/api/media-list');
            if (!response.ok) {
                throw new Error('Failed to fetch images');
            }
            const images = await response.json();
            this.renderImages(images);
        } catch (error) {
            this.showMessage(error.message, 'danger');
        }
    }

    renderImages(images) {
        const imageContainer = document.getElementById('imageContainer');
        imageContainer.innerHTML = '';

        images.forEach(image => {
            const col = document.createElement('div');
            col.className = 'col';
            col.innerHTML = `
                <div class="card h-100">
                    <img src="/media/${image}" class="card-img-top" alt="${image}">
                    <div class="card-body">
                        <h5 class="card-title">${image}</h5>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="${image}" id="check-${image}">
                            <label class="form-check-label" for="check-${image}">
                                Select
                            </label>
                        </div>
                    </div>
                </div>
            `;
            imageContainer.appendChild(col);
        });
    }

    setupEventListeners() {
        // Upload related events
        const uploadInput = document.getElementById('imageUpload');
        const saveBtn = document.getElementById('saveBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        const editSelectedBtn = document.getElementById('editSelectedBtn');
        const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
        const searchInput = document.getElementById('searchInput');

        uploadInput.addEventListener('change', (e) => this.handleImageUpload(e));
        saveBtn.addEventListener('click', () => this.saveImage());
        cancelBtn.addEventListener('click', () => this.cancelEdit());
        editSelectedBtn.addEventListener('click', () => this.editSelected());
        deleteSelectedBtn.addEventListener('click', () => this.deleteSelected());
        searchInput.addEventListener('input', (e) => this.handleSearch(e));

        // Setup drag and drop
        const uploadSection = document.querySelector('.upload-section');
        uploadSection.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadSection.style.borderColor = '#007bff';
        });

        uploadSection.addEventListener('dragleave', () => {
            uploadSection.style.borderColor = '#ccc';
        });

        uploadSection.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadSection.style.borderColor = '#ccc';
            if (e.dataTransfer.files.length) {
                uploadInput.files = e.dataTransfer.files;
                this.handleImageUpload({ target: uploadInput });
            }
        });
    }

    async handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        this.uploadedFile = file;
        const reader = new FileReader();

        reader.onload = (e) => {
            this.editor.loadImage(e.target.result);
            document.querySelector('.editor-section').style.display = 'block';
            document.querySelector('.upload-section').style.display = 'none';
        };

        reader.readAsDataURL(file);
    }

    async editSelected() {
        const selectedCheckbox = document.querySelector('.form-check-input:checked');
        if (!selectedCheckbox) {
            this.showMessage('Please select an image to edit', 'warning');
            return;
        }

        const imageName = selectedCheckbox.value;
        this.selectedImage = imageName;

        try {
            const response = await fetch(`/media/${imageName}`);
            const blob = await response.blob();
            const reader = new FileReader();

            reader.onload = (e) => {
                this.editor.loadImage(e.target.result);
                document.querySelector('.editor-section').style.display = 'block';
                document.querySelector('.upload-section').style.display = 'none';
            };

            reader.readAsDataURL(blob);
        } catch (error) {
            this.showMessage('Failed to load image for editing', 'danger');
        }
    }

    async deleteSelected() {
        const selectedCheckboxes = document.querySelectorAll('.form-check-input:checked');
        if (selectedCheckboxes.length === 0) {
            this.showMessage('Please select at least one image to delete', 'warning');
            return;
        }

        if (!confirm(`Are you sure you want to delete ${selectedCheckboxes.length} image(s)?`)) {
            return;
        }

        const deletePromises = Array.from(selectedCheckboxes).map(async checkbox => {
            const imageName = checkbox.value;
            try {
                const response = await fetch(`/api/delete-media?file=${imageName}`, {
                    method: 'DELETE'
                });
                if (!response.ok) throw new Error(`Failed to delete ${imageName}`);
                return imageName;
            } catch (error) {
                console.error(error);
                return null;
            }
        });

        const results = await Promise.all(deletePromises);
        const deleted = results.filter(result => result !== null);

        if (deleted.length > 0) {
            this.showMessage(`Successfully deleted ${deleted.length} image(s)`, 'success');
            this.loadImages();
        } else {
            this.showMessage('Failed to delete images', 'danger');
        }
    }

    handleSearch(event) {
        const searchTerm = event.target.value.toLowerCase();
        const images = document.querySelectorAll('.card');

        images.forEach(image => {
            const title = image.querySelector('.card-title').textContent.toLowerCase();
            if (title.includes(searchTerm)) {
                image.closest('.col').style.display = '';
            } else {
                image.closest('.col').style.display = 'none';
            }
        });
    }

    async saveImage() {
        try {
            const dataURL = this.editor.toDataURL();
            const blob = await fetch(dataURL).then(r => r.blob());
            
            const formData = new FormData();
            formData.append('file', blob, this.selectedImage || this.uploadedFile.name);

            const response = await fetch('/api/upload-media', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const result = await response.json();
            
            // Refresh image list
            this.loadImages();
            
            // Reset editor
            this.cancelEdit();
            
            this.showMessage('Image saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving image:', error);
            this.showMessage('Failed to save image. Please try again.', 'danger');
        }
    }

    cancelEdit() {
        document.querySelector('.editor-section').style.display = 'none';
        document.querySelector('.upload-section').style.display = 'block';
        document.getElementById('imageUpload').value = '';
        this.uploadedFile = null;
        this.selectedImage = null;
    }

    showMessage(message, type) {
        const messageContainer = document.getElementById('messageContainer');
        messageContainer.textContent = message;
        messageContainer.className = `alert alert-${type}`;
        messageContainer.classList.remove('d-none');
        setTimeout(() => {
            messageContainer.classList.add('d-none');
        }, 3000);
    }
}

// Initialize the editor when the DOM is fully loaded and TOAST UI is available
function initializeWhenReady() {
    if (typeof tui === 'undefined') {
        console.log('Waiting for TOAST UI to load...');
        setTimeout(initializeWhenReady, 100);
        return;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new ImageEditor());
    } else {
        new ImageEditor();
    }
}

initializeWhenReady();
