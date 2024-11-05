// modals.js
import { initializeMediaSelectModal } from './mediaSelectModal.js'
import { initializeBlockquoteModal } from './blockquoteModal.js'
import { initializeColoredCodeModal } from './coloredCodeModal.js'
import { initializeInternalLinksModal } from './internalLinksModal.js'


export function initializeModals () {
  initializeMediaSelectModal()
  initializeBlockquoteModal()
  initializeColoredCodeModal()
  initializeInternalLinksModal()
}

export function showModal (modalId) {
  const modal = new bootstrap.Modal(document.getElementById(modalId))
  modal.show()
}

export function hideModal (modalId) {
  const modalElement = document.getElementById(modalId)
  const modal = bootstrap.Modal.getInstance(modalElement)
  modal.hide()
}
