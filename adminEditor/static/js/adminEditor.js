/* eslint-disable no-new */
'use strict';

import { initializeModals, showModal, hideModal } from './modals.js';

const editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
  mode: 'markdown',
  lineNumbers: true,
  lineWrapping: true,
  styleActiveSelected: true,
  styleActiveLine: true,
  highlightMatches: true,
  viewportMargin: Infinity,
  codeFolding: true,
  // Add search options
  search: {
    bottom: true,
  },
});
// Expose the editor instance globally so it can be accessed by the menu
window.editor = editor;

const viewportHeight = window.innerHeight;
editor.setSize(null, viewportHeight + 'px');

let isDirty = false;

editor.on('change', function () {
  isDirty = true;
});

function openMediaGallery() {
  window.open('./manage-media.html', '_blank');
}

function checkSaveMessage() {
  if (isDirty) {
    const confirmationMessage =
      'You have unsaved changes. Are you sure you want to leave?';
    e.returnValue = confirmationMessage;
    return confirmationMessage;
  }
}

window.addEventListener('beforeunload', function (e) {
  checkSaveMessage();
});

document
  .getElementById('flexSwitchUseButton')
  .addEventListener('change', function () {
    const buttonColorGroup = document.getElementById('buttonColorGroup');
    if (this.checked) {
      buttonColorGroup.classList.remove('hidden');
    } else {
      buttonColorGroup.classList.add('hidden');
    }
  });

document
  .getElementById('flexSwitchUseButton')
  .dispatchEvent(new Event('change'));

document.addEventListener('DOMContentLoaded', function () {
  let config;

  const languageSelect = document.getElementById('language-select');
  const fileSelect = document.getElementById('file-select');

  fetch('/api/config')
    .then((response) => response.json())
    .then((data) => {
      config = data;
      initializeToolbar();
      initializeFileSelector();
      initializeButtons();
      initializeModals();
    });

  // Initialize Bootstrap dropdowns
  const dropdowns = document.querySelectorAll('.dropdown-toggle');
  dropdowns.forEach((dropdown) => {
    // eslint-disable-next-line no-new, no-undef
    new bootstrap.Dropdown(dropdown);
  });

  function initializeToolbar() {
    const toolbar = document.getElementById('toolbar');
    const menu = createHamburgerMenu();
    toolbar.innerHTML =
      '<div class="btn-group btn-group-sm" role="group">' + menu + '</div>';

    // Initialize Bootstrap dropdown
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    if (dropdownToggle) {
      // eslint-disable-next-line no-undef
      new bootstrap.Dropdown(dropdownToggle);
    }
    initializeHamburgerMenu();

    toolbar.innerHTML =
      toolbar.innerHTML +
      `<div class="btn-group btn-group-sm" role="group">
            <button class="btn btn-outline-secondary" onclick="editor.undo()" data-bs-toggle="tooltip" title="Undo"><i class="fas fa-undo"></i></button>
            <button class="btn btn-outline-secondary" onclick="editor.redo()" data-bs-toggle="tooltip" title="Redo"><i class="fas fa-redo"></i></button>
            </div><div class="btn-group btn-group-sm" id='menu-toolbar' role="group"></div>
        `;
    const buttonGroup = toolbar.querySelector('#menu-toolbar');
    config.shortcodes
      .sort((a, b) => a.order - b.order)
      .forEach((shortcode) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-secondary';
        button.innerHTML = `<i class="fas fa-${shortcode.icon}"></i>`;
        button.title = shortcode.tooltip;
        button.id = shortcode.id;
        button.onclick = () => insertShortcode(shortcode.code, shortcode.id);
        buttonGroup.appendChild(button);
      });
  }

  function initializeFileSelector() {
    languageSelect.addEventListener('change', updateFileList);
    fileSelect.addEventListener('change', loadSelectedFile);
    updateFileList();
  }

  function updateFileList() {
    const language = languageSelect.value;
    fetch(`/api/list?lang=${language}`)
      .then((response) => response.json())
      .then((data) => {
        fileSelect.innerHTML = '';
        const files = Array.isArray(data) ? data : data[language] || [];
        files.forEach((file) => {
          const option = document.createElement('option');
          option.value = file;
          option.textContent = file;
          fileSelect.appendChild(option);
        });
        loadSelectedFile();
      })
      .catch((error) => {
        console.error('Error fetching file list:', error);
        fileSelect.innerHTML = '<option>Error loading files</option>';
      });
  }

  function loadSelectedFile() {
    const language = languageSelect.value;
    const file = fileSelect.value;
    if (file) {
      fetch(`/api/load?file=${language}/${file}`)
        .then((response) => response.text())
        .then((content) => {
          editor.setValue(content);
          isDirty = false;
        })
        .catch((error) => {
          console.error('Error loading file:', error);
          editor.setValue('Error loading file content');
        });
    }
  }

  function initializeButtons() {
    document
      .getElementById('openMediaGallery')
      .addEventListener('click', () => {
        openMediaGallery();
      });

    document.getElementById('save-btn').addEventListener('click', saveFile);
    document
      .getElementById('spell-check-btn')
      .addEventListener('click', checkSpelling);
    document
      .getElementById('copy-btn')
      .addEventListener('click', copyToClipboard);
    document
      .getElementById('paste-btn')
      .addEventListener('click', pasteFromClipboard);
    document
      .getElementById('fullscreen-btn')
      .addEventListener('click', toggleFullscreen);
    document
      .getElementById('newPostButton')
      .addEventListener('click', initializeNewPostWizard);
  }

  function addTextToEnd(newText) {
    const doc = editor.getDoc();
    let lastLine = doc.lastLine();
    let lastLineLength = doc.getLine(lastLine).length;
    doc.replaceRange('\n' + newText, { line: lastLine, ch: lastLineLength });
    lastLine = doc.lastLine();
    lastLineLength = doc.getLine(lastLine).length;
    editor.scrollIntoView({ line: lastLine, ch: lastLineLength });
  }

  function insertShortcode(code, key = '') {
    const doc = editor.getDoc();
    const selection = doc.getSelection();
    switch (key) {
      case 'coloredCode':
        showModal('coloredCodeModal');
        break;
      case 'blockquoteSelect':
        showModal('blockquoteModal');
        break;
      case 'internalLink':
        showModal('internalLinksModal');
        break;
      case 'mediaSelect':
        showModal('mediaSelectModal');
        break;
      default:
        if (selection) {
          const text = code.replace('text', selection);
          doc.replaceSelection(`${text}`);
        } else {
          addEditorText(code);
        }
        break;
    }
  }

  function addEditorText(code) {
    const doc = editor.getDoc();
    const cursor = doc.getCursor();
    const selection = doc.getSelection();
    if (selection) {
      doc.replaceSelection(`${code}`);
    } else {
      if (cursor.sticky == null) {
        addTextToEnd(code);
      } else {
        doc.replaceRange(code, cursor);
      }
    }
  }

  // Initialize the menu functionality
  function initializeHamburgerMenu() {
    const editor = window.editor;

    const menuActions = {
      save: () => saveFile(),
      undo: () => editor.undo(),
      redo: () => editor.redo(),
      cut: () => {
        const selection = editor.getSelection();
        if (selection) {
          navigator.clipboard.writeText(selection);
          editor.replaceSelection('');
        }
      },
      copy: () => {
        const selection = editor.getSelection();
        if (selection) {
          navigator.clipboard.writeText(selection);
        }
      },
      paste: async () => {
        try {
          const text = await navigator.clipboard.readText();
          editor.replaceSelection(text);
        } catch (err) {
          console.error('Failed to paste:', err);
        }
      },
      selectAll: () => editor.execCommand('selectAll'),
      find: () => {
        // Use CodeMirror's search command
        const searchQuery =
          editor.getSelection() || editor.state.lastQuery || '';
        CodeMirror.commands.find(editor);
        // Pre-fill with selected text if any
        const searchField = document.querySelector('.CodeMirror-search-field');
        if (searchField) {
          searchField.value = searchQuery;
        }
      },
      findNext: () => {
        if (editor.state.lastQuery) {
          CodeMirror.commands.findNext(editor);
        } else {
          CodeMirror.commands.find(editor);
        }
      },
      findPrev: () => {
        if (editor.state.lastQuery) {
          CodeMirror.commands.findPrev(editor);
        } else {
          CodeMirror.commands.find(editor);
        }
      },
      replace: () => {
        CodeMirror.commands.replace(editor);
      },
      jumpToLine: () => {
        const line = prompt('Go to line:', '');
        if (line) {
          const lineNum = parseInt(line, 10) - 1;
          if (!isNaN(lineNum)) {
            editor.setCursor(lineNum, 0);
            editor.focus();
          }
        }
      },
      toggleLineNumbers: () => {
        editor.setOption('lineNumbers', !editor.getOption('lineNumbers'));
      },
      toggleLineWrapping: () => {
        editor.setOption('lineWrapping', !editor.getOption('lineWrapping'));
      },
      toggleFullscreen: () => {
        const cm = editor.getWrapperElement();
        cm.classList.toggle('CodeMirror-fullscreen');
        editor.refresh();
      },
    };

    // Use event delegation on the parent container
    document.addEventListener('click', (e) => {
      const menuItem = e.target.closest('.dropdown-item[data-action]');
      if (menuItem) {
        e.preventDefault();
        const action = menuItem.dataset.action;
        if (menuActions[action]) {
          try {
            menuActions[action]();
            console.log(`Action ${action} executed successfully`);
          } catch (err) {
            console.error(`Failed to execute ${action}:`, err);
          }
        }
      }
    });

    // Set up keyboard shortcuts
    const extraKeys = {
      'Ctrl-F': menuActions.find,
      'Ctrl-G': menuActions.findNext,
      'Shift-Ctrl-G': menuActions.findPrev,
      'Ctrl-H': menuActions.replace,
      'Alt-G': menuActions.jumpToLine,
      F11: menuActions.toggleFullscreen,
      'Ctrl-S': menuActions.save,
    };

    editor.setOption('extraKeys', extraKeys);
    // Log to verify initialization
    console.log('Menu initialized');
    document.querySelectorAll('.dropdown-item[data-action]').forEach((item) => {
      console.log('Found menu item:', item.dataset.action);
    });
  }

  function saveFile() {
    const language = languageSelect.value;
    const file = fileSelect.value;
    const content = editor.getValue();
    fetch(`/api/save?file=${language}/${file}`, {
      method: 'POST',
      body: content,
    })
      .then(() => {
        window.alert('File saved successfully');
        isDirty = false;
      })
      .catch((error) => {
        window.alert('Error saving file: ' + error);
      });
  }

  function checkSpelling() {
    const content = editor.getValue();
    const lang = languageSelect.value;

    fetch('https://api.languagetool.org/v2/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `text=${encodeURIComponent(
        content,
      )}&language=${lang}&enabledOnly=false`,
    })
      .then((response) => response.json())
      .then((data) => {
        const doc = editor.getDoc();
        data.matches.forEach((match) => {
          const from = doc.posFromIndex(match.offset);
          const to = doc.posFromIndex(match.offset + match.length);
          doc.markText(from, to, {
            className:
              match.rule.category.id === 'TYPOS'
                ? 'spelling-error'
                : 'grammar-error',
            title: match.message,
          });
        });
      });
  }

  // Function to initialize the new post wizard
  function initializeNewPostWizard() {
    const wizardContainerId = 'newPostWizard';
    // eslint-disable-next-line no-undef
    const wizard = new NewPostWizard(wizardContainerId);
  }

  function copyToClipboard() {
    navigator.clipboard
      .writeText(editor.getValue())
      .then(() => {
        window.alert('Content copied to clipboard');
      })
      .catch((err) => {
        window.alert('Failed to copy: ' + err);
      });
  }

  function pasteFromClipboard() {
    navigator.clipboard
      .readText()
      .then((text) => {
        addEditorText(text);
      })
      .catch((err) => {
        window.alert('Failed to paste: ' + err);
      });
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // Expose necessary functions to the window object
  window.addEditorText = addEditorText;
  window.showModal = showModal;
  window.hideModal = hideModal;
});

function createHamburgerMenu() {
  const menuHTML = `
  <div class="editor-menu">
    <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="editorMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
      <i class="fas fa-bars"></i>
    </button>
    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="editorMenuButton">
      <!-- File operations -->
      <li><h6 class="dropdown-header">File</h6></li>
      <li><a class="dropdown-item" href="#" data-action="save">
        <i class="fas fa-save me-2"></i>Save
        <span class="shortcut">Ctrl+S</span>
      </a></li>
      
      <!-- Edit operations -->
      <li><h6 class="dropdown-header">Edit</h6></li>
      <li><a class="dropdown-item" href="#" data-action="undo">
        <i class="fas fa-undo me-2"></i>Undo
        <span class="shortcut">Ctrl+Z</span>
      </a></li>
      <li><a class="dropdown-item" href="#" data-action="redo">
        <i class="fas fa-redo me-2"></i>Redo
        <span class="shortcut">Ctrl+Y</span>
      </a></li>
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item" href="#" data-action="cut">
        <i class="fas fa-cut me-2"></i>Cut
        <span class="shortcut">Ctrl+X</span>
      </a></li>
      <li><a class="dropdown-item" href="#" data-action="copy">
        <i class="fas fa-copy me-2"></i>Copy
        <span class="shortcut">Ctrl+C</span>
      </a></li>
      <li><a class="dropdown-item" href="#" data-action="paste">
        <i class="fas fa-paste me-2"></i>Paste
        <span class="shortcut">Ctrl+V</span>
      </a></li>
      <li><a class="dropdown-item" href="#" data-action="selectAll">
        <i class="fas fa-check-double me-2"></i>Select All
        <span class="shortcut">Ctrl+A</span>
      </a></li>
      
      <!-- Search operations -->
      <li><h6 class="dropdown-header">Search</h6></li>
      <li><a class="dropdown-item" href="#" data-action="find">
        <i class="fas fa-search me-2"></i>Find
        <span class="shortcut">Ctrl+F</span>
      </a></li>
      <li><a class="dropdown-item" href="#" data-action="findNext">
        <i class="fas fa-arrow-down me-2"></i>Find Next
        <span class="shortcut">F3</span>
      </a></li>
      <li><a class="dropdown-item" href="#" data-action="findPrev">
        <i class="fas fa-arrow-up me-2"></i>Find Previous
        <span class="shortcut">Shift+F3</span>
      </a></li>
      <li><a class="dropdown-item" href="#" data-action="replace">
        <i class="fas fa-exchange-alt me-2"></i>Replace
        <span class="shortcut">Ctrl+H</span>
      </a></li>
      <li><a class="dropdown-item" href="#" data-action="jumpToLine">
        <i class="fas fa-level-down-alt me-2"></i>Go to Line
        <span class="shortcut">Alt+G</span>
      </a></li>
      
      <!-- View operations -->
      <li><h6 class="dropdown-header">View</h6></li>
      <li><a class="dropdown-item" href="#" data-action="toggleLineNumbers">
        <i class="fas fa-list-ol me-2"></i>Toggle Line Numbers
      </a></li>
      <li><a class="dropdown-item" href="#" data-action="toggleLineWrapping">
        <i class="fas fa-align-justify me-2"></i>Toggle Line Wrapping
      </a></li>
      <li><a class="dropdown-item" href="#" data-action="toggleFullscreen">
        <i class="fas fa-expand me-2"></i>Toggle Fullscreen
        <span class="shortcut">F11</span>
      </a></li>
    </ul>
  </div>
`;

  return menuHTML;
}
