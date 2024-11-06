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
  // eslint-disable-next-line no-undef
  const modal = new bootstrap.Modal(document.getElementById(modalId))
  modal.show()
}

export function hideModal (modalId) {
  const modalElement = document.getElementById(modalId)
  // eslint-disable-next-line no-undef
  const modal = bootstrap.Modal.getInstance(modalElement)
  modal.hide()
}
