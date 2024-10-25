"use strict";

import { initializeModals, showModal, hideModal } from "./modals.js";

var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
  mode: "markdown",
  lineNumbers: true,
  lineWrapping: true,
  styleActiveSelected: true,
  styleActiveLine: true,
  highlightMatches: true,
  viewportMargin: Infinity
});

const viewportHeight = window.innerHeight;
editor.setSize(null, viewportHeight + "px");

var isDirty = false;

editor.on("change", function () {
  isDirty = true;
});

function checkSaveMessage() {
  if (isDirty) {
    var confirmationMessage =
      "You have unsaved changes. Are you sure you want to leave?";
    e.returnValue = confirmationMessage;
    return confirmationMessage;
  }
}

window.addEventListener("beforeunload", function (e) {
  checkSaveMessage()
});

document
  .getElementById("flexSwitchUseButton")
  .addEventListener("change", function () {
    var buttonColorGroup = document.getElementById("buttonColorGroup");
    if (this.checked) {
      buttonColorGroup.classList.remove("hidden");
    } else {
      buttonColorGroup.classList.add("hidden");
    }
  });

document
  .getElementById("flexSwitchUseButton")
  .dispatchEvent(new Event("change"));

document.addEventListener("DOMContentLoaded", function () {
  let config;

  const languageSelect = document.getElementById("language-select");
  const fileSelect = document.getElementById("file-select");

  fetch("/api/config")
    .then((response) => response.json())
    .then((data) => {
      config = data;
      initializeToolbar();
      initializeFileSelector();
      initializeButtons();
      initializeModals();   
    });



  function initializeToolbar() {
    const toolbar = document.getElementById("toolbar");
    toolbar.innerHTML = `
            <button class="btn btn-outline-secondary" onclick="editor.undo()" data-bs-toggle="tooltip" title="Undo"><i class="fas fa-undo"></i></button>
            <button class="btn btn-outline-secondary" onclick="editor.redo()" data-bs-toggle="tooltip" title="Redo"><i class="fas fa-redo"></i></button>
            <div class="btn-group btn-group-sm" role="group"></div>
        `;
    const buttonGroup = toolbar.querySelector(".btn-group");
    config.shortcodes
      .sort((a, b) => a.order - b.order)
      .forEach((shortcode) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "btn btn-secondary";
        button.innerHTML = `<i class="fas fa-${shortcode.icon}"></i>`;
        button.title = shortcode.tooltip;
        button.id = shortcode.id;
        button.onclick = () => insertShortcode(shortcode.code, shortcode.id);
        buttonGroup.appendChild(button);
      });
  }

  function initializeFileSelector() {
    languageSelect.addEventListener("change", updateFileList);
    fileSelect.addEventListener("change", loadSelectedFile);
    updateFileList();
  }

  function updateFileList() {    
    const language = languageSelect.value;
    fetch(`/api/list?lang=${language}`)
      .then((response) => response.json())
      .then((data) => {
        fileSelect.innerHTML = "";
        const files = Array.isArray(data) ? data : data[language] || [];
        files.forEach((file) => {
          const option = document.createElement("option");
          option.value = file;
          option.textContent = file;
          fileSelect.appendChild(option);
        });
        loadSelectedFile();
      })
      .catch((error) => {
        console.error("Error fetching file list:", error);
        fileSelect.innerHTML = "<option>Error loading files</option>";
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
          console.error("Error loading file:", error);
          editor.setValue("Error loading file content");
        });
    }
  }

  function initializeButtons() {
    document.getElementById("save-btn").addEventListener("click", saveFile);
    document
      .getElementById("spell-check-btn")
      .addEventListener("click", checkSpelling);
    document
      .getElementById("copy-btn")
      .addEventListener("click", copyToClipboard);
    document
      .getElementById("paste-btn")
      .addEventListener("click", pasteFromClipboard);
    document
      .getElementById("fullscreen-btn")
      .addEventListener("click", toggleFullscreen);
    document
      .getElementById("newPostButton")
      .addEventListener("click", initializeNewPostWizard);
  }

  function addTextToEnd(newText) {
    var doc = editor.getDoc();
    var lastLine = doc.lastLine();
    var lastLineLength = doc.getLine(lastLine).length;
    doc.replaceRange("\n" + newText, { line: lastLine, ch: lastLineLength });
    lastLine = doc.lastLine();
    lastLineLength = doc.getLine(lastLine).length;
    editor.scrollIntoView({ line: lastLine, ch: lastLineLength });
  }

  function insertShortcode(code, key = "") {
    const doc = editor.getDoc();
    const selection = doc.getSelection();
    switch (key) {
      case "coloredCode":
        showModal("coloredCodeModal");
        break;
      case "blockquoteSelect":
        showModal("blockquoteModal");
        break;
      case "internalLink":
        showModal("internalLinksModal");
        break;
      case "mediaSelect":
        showModal("mediaSelectModal");
        break;
      default:
        if (selection) {
          const text = code.replace("text", selection);
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

  function saveFile() {
    const language = languageSelect.value;
    const file = fileSelect.value;
    const content = editor.getValue();
    fetch(`/api/save?file=${language}/${file}`, {
      method: "POST",
      body: content,
    })
      .then(() => {
        alert("File saved successfully");
        isDirty = false;
      })
      .catch((error) => {
        alert("Error saving file: " + error);
      });
  }

  function checkSpelling() {
    const content = editor.getValue();
    const lang = languageSelect.value;

    fetch(`https://api.languagetool.org/v2/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `text=${encodeURIComponent(
        content
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
              match.rule.category.id === "TYPOS"
                ? "spelling-error"
                : "grammar-error",
            title: match.message,
          });
        });
      });
  }

  // Function to initialize the new post wizard
function initializeNewPostWizard() {
    const wizardContainerId = 'newPostWizard';
    const wizard = new NewPostWizard(wizardContainerId);
}

  function copyToClipboard() {
    navigator.clipboard
      .writeText(editor.getValue())
      .then(() => {
        alert("Content copied to clipboard");
      })
      .catch((err) => {
        alert("Failed to copy: " + err);
      });
  }

  function pasteFromClipboard() {
    navigator.clipboard
      .readText()
      .then((text) => {
        addEditorText(text);
      })
      .catch((err) => {
        alert("Failed to paste: " + err);
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
