import { hideModal } from './modals.js'


// mediaSelectModal.js
export function initializeMediaSelectModal () {
  const modal = new bootstrap.Modal(document.getElementById('mediaSelectModal'))
  const modalBody = document.querySelector('#mediaSelectModal .modal-body')
  const insertBtn = document.getElementById('insert-media-btn')

  fetch('/api/media-list')
    .then(response => response.json())
    .then(mediaFiles => {
      modalBody.innerHTML = ''
      const select = document.createElement('select')
      select.className = 'form-select caret'
      select.id = 'mediaFileSelect'

      const defaultOption = document.createElement('option')
      defaultOption.value = ''
      defaultOption.textContent = 'Select a file'
      defaultOption.selected = true
      defaultOption.disabled = true
      select.appendChild(defaultOption)

      mediaFiles.forEach(file => {
        const option = document.createElement('option')
        option.value = file
        option.textContent = file
        select.appendChild(option)
      })

      modalBody.appendChild(select)
    })

  insertBtn.addEventListener('click', () => {
    const selectedFile = document.getElementById('mediaFileSelect').value
    if (selectedFile) {
      window.addEditorText(`![${selectedFile}](/img/blog/${selectedFile})`)
    }
    hideModal('mediaSelectModal')
  })
}
