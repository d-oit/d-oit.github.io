// newPostWizard.js
class NewPostWizard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentStep = 1;
        this.formData = {
            title: '',
            description: '',
            date: new Date().toISOString().slice(0, 16),
            tags: [],
            categories: [],
            thumbnail: {
                url: '',
                author: '',
                authorUrl: '',
                origin: ''
            },
            language: 'en'
        };
        this.existingTags = [];
        this.existingCategories = [];
        
        this.init();
    }

    async init() {
        // Fetch existing tags and categories
        try {
            const [tagsResponse, categoriesResponse] = await Promise.all([
                fetch('/api/tags'),
                fetch('/api/categories')
            ]);
            this.existingTags = await tagsResponse.json();
            this.existingCategories = await categoriesResponse.json();
        } catch (error) {
            console.error('Error fetching tags and categories:', error);
        }

        this.render();
        this.attachEventListeners();
    }

    createStepIndicator() {
        return `
            <ul class="nav nav-pills mb-4 justify-content-center">
                <li class="nav-item">
                    <button class="nav-link ${this.currentStep === 1 ? 'active' : ''}" 
                            onclick="wizard.setStep(1)" 
                            ${!this.formData.title ? 'disabled' : ''}>
                        Basic Info
                    </button>
                </li>
                <li class="nav-item">
                    <button class="nav-link ${this.currentStep === 2 ? 'active' : ''}" 
                            onclick="wizard.setStep(2)"
                            ${!this.formData.title ? 'disabled' : ''}>
                        Thumbnail & Author
                    </button>
                </li>
                <li class="nav-item">
                    <button class="nav-link ${this.currentStep === 3 ? 'active' : ''}" 
                            onclick="wizard.setStep(3)"
                            ${!this.formData.title ? 'disabled' : ''}>
                        Categories & Tags
                    </button>
                </li>
            </ul>`;
    }

    createBasicInfoStep() {
        return `
            <div class="step-content">
                <div class="mb-3">
                    <label class="form-label">Language</label>
                    <select class="form-select" id="language">
                        <option value="en" ${this.formData.language === 'en' ? 'selected' : ''}>English</option>
                        <option value="de" ${this.formData.language === 'de' ? 'selected' : ''}>German</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Title</label>
                    <input type="text" class="form-control" id="title" 
                           value="${this.formData.title}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Description</label>
                    <textarea class="form-control" id="description">${this.formData.description}</textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Date</label>
                    <input type="datetime-local" class="form-control" id="date" 
                           value="${this.formData.date}" required>
                </div>
            </div>`;
    }

    createThumbnailStep() {
        return `
            <div class="step-content">
                <div class="mb-3">
                    <label class="form-label">Thumbnail URL</label>
                    <input type="text" class="form-control" id="thumbnailUrl" 
                           value="${this.formData.thumbnail.url}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Author</label>
                    <input type="text" class="form-control" id="thumbnailAuthor" 
                           value="${this.formData.thumbnail.author}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Author URL</label>
                    <input type="url" class="form-control" id="thumbnailAuthorUrl" 
                           value="${this.formData.thumbnail.authorUrl}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Origin</label>
                    <input type="text" class="form-control" id="thumbnailOrigin" 
                           value="${this.formData.thumbnail.origin}">
                </div>
            </div>`;
    }

    createCategoriesStep() {
        const selectedTags = new Set(this.formData.tags);
        const selectedCategories = new Set(this.formData.categories);

        return `
            <div class="step-content">
                <div class="mb-3">
                    <label class="form-label">Tags</label>
                    <div class="tags-container">
                        <div class="selected-tags mb-2">
                            ${Array.from(selectedTags).map(tag => `
                                <span class="badge bg-primary me-1">
                                    ${tag}
                                    <i class="fas fa-times ms-1" onclick="wizard.removeTag('${tag}')"></i>
                                </span>
                            `).join('')}
                        </div>
                        <input type="text" class="form-control" id="newTag" placeholder="Add new tag">
                        <div class="existing-tags mt-2">
                            ${this.existingTags.map(tag => `
                                <button type="button" 
                                        class="btn btn-sm ${selectedTags.has(tag.name) ? 'btn-primary' : 'btn-outline-primary'} me-1 mb-1"
                                        onclick="wizard.toggleTag('${tag.name}')">
                                    ${tag.name}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Categories</label>
                    <div class="categories-container">
                        <div class="selected-categories mb-2">
                            ${Array.from(selectedCategories).map(category => `
                                <span class="badge bg-secondary me-1">
                                    ${category}
                                    <i class="fas fa-times ms-1" onclick="wizard.removeCategory('${category}')"></i>
                                </span>
                            `).join('')}
                        </div>
                        <input type="text" class="form-control" id="newCategory" placeholder="Add new category">
                        <div class="existing-categories mt-2">
                            ${this.existingCategories.map(category => `
                                <button type="button" 
                                        class="btn btn-sm ${selectedCategories.has(category.name) ? 'btn-secondary' : 'btn-outline-secondary'} me-1 mb-1"
                                        onclick="wizard.toggleCategory('${category.name}')">
                                    ${category.name}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>`;
    }

    createNavigationButtons() {
        return `
            <div class="d-flex justify-content-between mt-4">
                ${this.currentStep > 1 ? `
                    <button type="button" class="btn btn-secondary" onclick="wizard.previousStep()">
                        Previous
                    </button>
                ` : '<div></div>'}
                ${this.currentStep < 3 ? `
                    <button type="button" class="btn btn-primary" onclick="wizard.nextStep()" 
                            ${!this.formData.title ? 'disabled' : ''}>
                        Next
                    </button>
                ` : `
                    <button type="button" class="btn btn-success" onclick="wizard.submit()"
                            ${!this.formData.title ? 'disabled' : ''}>
                        Create Post
                    </button>
                `}
            </div>`;
    }

    render() {
        let stepContent = '';
        switch (this.currentStep) {
            case 1:
                stepContent = this.createBasicInfoStep();
                break;
            case 2:
                stepContent = this.createThumbnailStep();
                break;
            case 3:
                stepContent = this.createCategoriesStep();
                break;
        }

        this.container.innerHTML = `
            ${this.createStepIndicator()}
            <form id="newPostForm" class="needs-validation" novalidate>
                ${stepContent}
                ${this.createNavigationButtons()}
            </form>`;
    }

    attachEventListeners() {
        // Basic info form fields
        if (this.currentStep === 1) {
            const titleInput = document.getElementById('title');
            const descInput = document.getElementById('description');
            const dateInput = document.getElementById('date');
            const langSelect = document.getElementById('language');

            titleInput?.addEventListener('input', (e) => {
                this.formData.title = e.target.value;
                this.render();
            });
            descInput?.addEventListener('input', (e) => this.formData.description = e.target.value);
            dateInput?.addEventListener('input', (e) => this.formData.date = e.target.value);
            langSelect?.addEventListener('change', (e) => this.formData.language = e.target.value);
        }

        // Thumbnail form fields
        if (this.currentStep === 2) {
            const urlInput = document.getElementById('thumbnailUrl');
            const authorInput = document.getElementById('thumbnailAuthor');
            const authorUrlInput = document.getElementById('thumbnailAuthorUrl');
            const originInput = document.getElementById('thumbnailOrigin');

            urlInput?.addEventListener('input', (e) => this.formData.thumbnail.url = e.target.value);
            authorInput?.addEventListener('input', (e) => this.formData.thumbnail.author = e.target.value);
            authorUrlInput?.addEventListener('input', (e) => this.formData.thumbnail.authorUrl = e.target.value);
            originInput?.addEventListener('input', (e) => this.formData.thumbnail.origin = e.target.value);
        }

        // Tags and Categories
        if (this.currentStep === 3) {
            const newTagInput = document.getElementById('newTag');
            const newCategoryInput = document.getElementById('newCategory');

            newTagInput?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addTag(e.target.value);
                    e.target.value = '';
                }
            });

            newCategoryInput?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addCategory(e.target.value);
                    e.target.value = '';
                }
            });
        }
    }

    setStep(step) {
        if (this.formData.title || step === 1) {
            this.currentStep = step;
            this.render();
            this.attachEventListeners();
        }
    }

    nextStep() {
        if (this.currentStep < 3 && this.formData.title) {
            this.currentStep++;
            this.render();
            this.attachEventListeners();
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.render();
            this.attachEventListeners();
        }
    }

    toggleTag(tag) {
        if (this.formData.tags.includes(tag)) {
            this.removeTag(tag);
        } else {
            this.addTag(tag);
        }
    }

    toggleCategory(category) {
        if (this.formData.categories.includes(category)) {
            this.removeCategory(category);
        } else {
            this.addCategory(category);
        }
    }

    addTag(tag) {
        if (tag && !this.formData.tags.includes(tag)) {
            this.formData.tags.push(tag);
            this.render();
            this.attachEventListeners();
        }
    }

    removeTag(tag) {
        this.formData.tags = this.formData.tags.filter(t => t !== tag);
        this.render();
        this.attachEventListeners();
    }

    addCategory(category) {
        if (category && !this.formData.categories.includes(category)) {
            this.formData.categories.push(category);
            this.render();
            this.attachEventListeners();
        }
    }

    removeCategory(category) {
        this.formData.categories = this.formData.categories.filter(c => c !== category);
        this.render();
        this.attachEventListeners();
    }

    async submit() {
        try {
            const response = await fetch('/api/create-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.formData),
            });

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            const data = await response.json();
            alert(`Post created successfully: ${data.filename}`);
            
            // Reset form
            this.formData = {
                title: '',
                description: '',
                date: new Date().toISOString().slice(0, 16),
                tags: [],
                categories: [],
                thumbnail: {
                    url: '',
                    author: '',
                    authorUrl: '',
                    origin: ''
                },
                language: 'en'
            };
            this.currentStep = 1;
            this.render();
            
            // Close modal if using Bootstrap modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('newPostModal'));
            if (modal) {
                modal.hide();
            }
        } catch (error) {
            alert('Error creating post: ' + error.message);
        }
    }
}