// eslint-disable-next-line no-unused-vars
class NewPostWizard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    
    this.resetForm()
   

    this.init();
  }

  async init() {
    // Fetch existing tags and categories
    try {
      const [tagsResponse, categoriesResponse] = await Promise.all([
        fetch('/api/tags'),
        fetch('/api/categories'),
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
                    <button class="nav-link ${
                      this.currentStep === 1 ? 'active' : ''
                    }" data-step="1">
                        Basic Info
                    </button>
                </li>
                <li class="nav-item">
                    <button class="nav-link ${
                      this.currentStep === 2 ? 'active' : ''
                    }" data-step="2">
                        Thumbnail & Author
                    </button>
                </li>
                <li class="nav-item">
                    <button class="nav-link ${
                      this.currentStep === 3 ? 'active' : ''
                    }" data-step="3">
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
                        <option value="en" ${
                          this.formData.language === 'en' ? 'selected' : ''
                        }>English</option>
                        <option value="de" ${
                          this.formData.language === 'de' ? 'selected' : ''
                        }>German</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Title</label>
                    <input type="text" class="form-control" id="title" 
                           value="${this.formData.title}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Description</label>
                    <textarea class="form-control" id="description">${
                      this.formData.description
                    }</textarea>
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
        <div id="imageSelectorContainer"></div>
            <div class="step-content">
                <div class="mb-3">
                  <label class="form-label">Thumbnail URL</label>
                    <input type="text" class="form-control" id="thumbnailUrl" 
                       value="${this.formData.thumbnail.url}">
            </div>
                 
            <div class="mb-3">
                <label class="form-label">Thumbnail Local Image (select from the media-folder)</label>
                <input type="file" name="thumbnailLocalImage" accept="image/*" class="form-control" id="thumbnailLocalFile" 
                       
                      }>
                      <p>selected value: ${this.formData.thumbnail.localFile}</p>
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
                            ${Array.from(selectedTags)
                              .map(
                                (tag) => `
                                <span class="badge bg-primary me-1">
                                    ${tag}
                                    <i class="fas fa-times ms-1 remove-tag" data-tag="${tag}"></i>
                                </span>
                            `,
                              )
                              .join('')}
                        </div>
                        <input type="text" class="form-control" id="newTag" placeholder="Add new tag">
                        <div class="existing-tags mt-2">
                            ${this.existingTags
                              .map(
                                (tag) => `
                                <button type="button" 
                                        class="btn btn-sm ${
                                          selectedTags.has(tag.name)
                                            ? 'btn-primary'
                                            : 'btn-outline-primary'
                                        } me-1 mb-1 toggle-tag"
                                        data-tag="${tag.name}">
                                    ${tag.name}
                                </button>
                            `,
                              )
                              .join('')}
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Categories</label>
                    <div class="categories-container">
                        <div class="selected-categories mb-2">
                            ${Array.from(selectedCategories)
                              .map(
                                (category) => `
                                <span class="badge bg-secondary me-1">
                                    ${category}
                                    <i class="fas fa-times ms-1 remove-category" data-category="${category}"></i>
                                </span>
                            `,
                              )
                              .join('')}
                        </div>
                        <input type="text" class="form-control" id="newCategory" placeholder="Add new category">
                        <div class="existing-categories mt-2">
                            ${this.existingCategories
                              .map(
                                (category) => `
                                <button type="button" 
                                        class="btn btn-sm ${
                                          selectedCategories.has(category.name)
                                            ? 'btn-secondary'
                                            : 'btn-outline-secondary'
                                        } me-1 mb-1 toggle-category"
                                        data-category="${category.name}">
                                    ${category.name}
                                </button>
                            `,
                              )
                              .join('')}
                        </div>
                    </div>
                </div>
            </div>`;
  }

  createNavigationButtons() {
    return `
            <div class="d-flex justify-content-between mt-4">
                ${
                  this.currentStep > 1
                    ? `
                    <button type="button" class="btn btn-secondary prev-step">
                        Previous
                    </button>
                `
                    : '<div></div>'
                }
                ${
                  this.currentStep < 3
                    ? `
                    <button type="button" class="btn btn-primary next-step">
                        Next
                    </button>
                `
                    : `
                    <button type="button" class="btn btn-success submit-post">
                        Create Post
                    </button>
                `
                }
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

    this.attachEventListeners();
  }

  attachEventListeners() {
    // Step navigation buttons (nav-pills)
    this.container.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        if (this.isNavigating) return;
        const step = parseInt(e.target.getAttribute('data-step'));
        this.setStep(step);
      });
    });

    // Next/Previous buttons
    const nextStepButton = this.container.querySelector('.next-step');
    if (nextStepButton) {
      nextStepButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.isNavigating) return;
        this.nextStep();
      });
    }

    const prevStepButton = this.container.querySelector('.prev-step');
    if (prevStepButton) {
      prevStepButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.isNavigating) return;
        this.previousStep();
      });
    }

    const submitButton = this.container.querySelector('.submit-post');
    if (submitButton) {
      submitButton.addEventListener('click', (e) => {
        this.submit();
      });
    }

    // Input fields
    const titleInput = document.getElementById('title');
    titleInput?.addEventListener('input', (e) => {
      this.formData.title = e.target.value;
    });

    const descInput = document.getElementById('description');
    descInput?.addEventListener(
      'input',
      (e) => (this.formData.description = e.target.value),
    );

    const dateInput = document.getElementById('date');
    dateInput?.addEventListener(
      'input',
      (e) => (this.formData.date = e.target.value),
    );

    const langSelect = document.getElementById('language');
    langSelect?.addEventListener(
      'change',
      (e) => (this.formData.language = e.target.value),
    );

    // Tags and Categories
    this.container.querySelectorAll('.toggle-tag').forEach((tagButton) => {
      tagButton.addEventListener('click', (e) => {
        const tag = e.target.getAttribute('data-tag');
        this.toggleTag(tag);
      });
    });

    this.container.querySelectorAll('.remove-tag').forEach((removeIcon) => {
      removeIcon.addEventListener('click', (e) => {
        const tag = e.target.getAttribute('data-tag');
        this.removeTag(tag);
      });
    });

    const thumbnailLocalFile = document.getElementById('thumbnailLocalFile')
    if (thumbnailLocalFile) {
      thumbnailLocalFile.addEventListener('change',
        function (event) {
          const file = event.target.files[0]
          if (file) {
            this.formData.thumbnail.localFile = file.name
          }
        }.bind(this)
      )
    }

    const newTagInput = document.getElementById('newTag');
    newTagInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.addTag(e.target.value);
        e.target.value = '';
      }
    });

    this.container.querySelectorAll('.toggle-category').forEach((catButton) => {
      catButton.addEventListener('click', (e) => {
        const category = e.target.getAttribute('data-category');
        this.toggleCategory(category);
      });
    });

    this.container
      .querySelectorAll('.remove-category')
      .forEach((removeIcon) => {
        removeIcon.addEventListener('click', (e) => {
          const category = e.target.getAttribute('data-category');
          this.removeCategory(category);
        });
      });

    const newCategoryInput = document.getElementById('newCategory');
    newCategoryInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.addCategory(e.target.value);
        e.target.value = '';
      }
    });
  }

  setStep(step) {
    console.log('setStep:', step);
    this.isNavigating = true;
    this.currentStep = step;
    this.render();
    // Reset the flag after a short delay to prevent rapid clicking
    setTimeout(() => {
      this.isNavigating = false;
    }, 100);
  }

  nextStep() {
    console.log('nextStep, current step:', this.currentStep);
    if (this.currentStep < 3) {
      this.setStep(this.currentStep + 1);
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.setStep(this.currentStep - 1);
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
    }
  }

  removeTag(tag) {
    this.formData.tags = this.formData.tags.filter((t) => t !== tag);
    this.render();
  }

  addCategory(category) {
    if (category && !this.formData.categories.includes(category)) {
      this.formData.categories.push(category);
      this.render();
    }
  }

  removeCategory(category) {
    this.formData.categories = this.formData.categories.filter(
      (c) => c !== category,
    );
    this.render();
  }

  async submit() {
    if (this.formData.title.trim() === '') {
      window.alert('Title is required');
      return;
    }
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
      window.alert(`Post created successfully: ${data.filename}`);

      // Reset form
      this.resetForm();
      this.currentStep = 1;
      this.render();

      // Close modal if using Bootstrap modal
      const modalElement = document.getElementById('newPostModal');
      // eslint-disable-next-line no-undef
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    } catch (error) {
      window.alert('Error creating post: ' + error.message);
    }
  }

  resetForm() {
    this.currentStep = 1;
    this.existingTags = [];
    this.existingCategories = [];
    this.formData = {
      title: '',
      slug: '',
      description: '',
      date: new Date().toISOString().slice(0, 16),
      tags: [],
      categories: [],
      thumbnail: {
        url: '',
        localFile: '',
        author: '',
        authorUrl: '',
        origin: '',
      },
      language: 'en',
    };
  }
}
