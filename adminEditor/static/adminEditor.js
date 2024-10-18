"use strict";

var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
  mode: "markdown",
  lineNumbers: true,
  lineWrapping: true,
  styleActiveSelected: true,
  styleActiveLine: true,
  highlightMatches: true,
  viewportMargin: Infinity,
});

const viewportHeight = window.innerHeight;
editor.setSize(null, viewportHeight + 'px');

var isDirty = false;

// Set the flag when the content changes
editor.on("change", function () {
  isDirty = true;
});

// Warn the user if there are unsaved changes
window.addEventListener("beforeunload", function (e) {
  if (isDirty) {
    var confirmationMessage =
      "You have unsaved changes. Are you sure you want to leave?";
    e.returnValue = confirmationMessage; // Standard for most browsers
    return confirmationMessage; // For some older browsers
  }
});

document.addEventListener("DOMContentLoaded", function () {
  let config;

  const languageSelect = document.getElementById("language-select");
  const fileSelect = document.getElementById("file-select");

  // Fetch configuration and initialize the editor
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
    // Add Undo and Redo buttons
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
        // Check if data is an object with language keys
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
  }

  function initializeModals() {
    initializeMediaSelectModal();
    initializeBlockquoteModal();
    initializeColoredCodeModal();
    initializeInternalLinksModal();
  }

  function insertShortcode(code, key = "") {
    const doc = editor.getDoc();
    const cursor = doc.getCursor();
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
      default:
        if (selection) {
          doc.replaceSelection(`**${selection}**`);
        } else {
          doc.replaceRange(code, cursor);
        }
        break;
    }
  }

  function saveFile() {
    const language = languageSelect.value;
    const file = fileSelect.value;
    const content = editor.value;
    fetch(`/api/save?file=${language}/${file}`, {
      method: "POST",
      body: content,
    })
      .then(() => {
        alert("File saved successfully");
      })
      .catch((error) => {
        alert("Error saving file: " + error);
      });
  }

  function checkSpelling() {
    const content = editor.getValue();
    const lang = document.getElementById("language-select").value;

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
        insertShortcode(text);
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

  function initializeMediaSelectModal() {
    const modal = new bootstrap.Modal(
      document.getElementById("mediaSelectModal")
    );
    const modalBody = document.querySelector("#mediaSelectModal .modal-body");
    const insertBtn = document.getElementById("insert-media-btn");

    // Fetch and display media list
    fetch("/api/media-list")
      .then((response) => response.json())
      .then((mediaFiles) => {
        modalBody.innerHTML = "";
        mediaFiles.forEach((file) => {
          const div = document.createElement("div");
          div.className = "form-check";
          div.innerHTML = `
                        <input class="form-check-input" type="radio" name="mediaFile" id="${file}" value="${file}">
                        <label class="form-check-label" for="${file}">${file}</label>
                    `;
          modalBody.appendChild(div);
        });
      });

    insertBtn.addEventListener("click", () => {
      const selectedFile = document.querySelector(
        'input[name="mediaFile"]:checked'
      );
      if (selectedFile) {
        insertShortcode(
          `![${selectedFile.value}](/img/blog/${selectedFile.value})`
        );
      }
      modal.hide();
    });
  }

  function initializeBlockquoteModal() {
    const modal = new bootstrap.Modal(
      document.getElementById("blockquoteModal")
    );
    const insertBtn = document.getElementById("insert-blockquote-btn");
    insertBtn.addEventListener("click", () => {
      const type = document.getElementById("blockquote-type").value;
      insertShortcode(
        `{{< blockquote type="${type}" >}}\nYour blockquote content here\n{{< /blockquote >}}`
      );
      modal.hide();
    });
  }

  function hideModal(modalId) {
    const modalElement = document.getElementById(modalId);
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }

  function initializeColoredCodeModal() {
    const insertBtn = document.getElementById("insert-colored-code-btn");
    const languageSelect = document.getElementById("code-language");

    // Populate language options
    const languages = [
      "JavaScript",
      "Python",
      "HTML",
      "CSS",
      "C#",
      "Hugo",
      "Java",
      "Ruby",
      "PHP",
      "Swift",
      "Kotlin",
      "TypeScript",
      "Go",
      "Rust",
      "R",
      "Perl",
      "Scala",
      "Dart",
      "SQL",
      "Bash",
      "PowerShell",
      "MATLAB",
      "Objective-C",
      "Assembly",
      "Fortran",
      "COBOL",
      "Lua",
      "Clojure",
      "Elixir",
      "Erlang",
      "F#",
      "Haskell",
      "Julia",
      "Lisp",
      "Pascal",
      "Prolog",
      "Racket",
      "Scheme",
      "Json",
      "XML",
      "YAML",
      "VHDL",
      "LaTeX",
      "Less",
      "SCSS",
      "Shell",
    ];
    languages.forEach((lang) => {
      const option = document.createElement("option");
      option.value = lang.toLowerCase();
      option.textContent = lang;
      languageSelect.appendChild(option);
    });

    insertBtn.addEventListener("click", () => {
      const language = document.getElementById("code-language").value;
      const code = document.getElementById("code-content").value;
      const formattedCode = "```" + language + "\n" + code + "\n```";
      const doc = editor.getDoc();
      const selection = doc.getSelection();
      if (selection) {
        editor.getDoc().replaceSelection(formattedCode);
      } else {
        insertTextAtLastNewLine(formattedCode);
      }
      hideModal("coloredCodeModal");
    });
  }

  function insertTextAtLastNewLine(text) {
    const doc = editor.getDoc();
    const lastLine = doc.lastLine();
    const lastLineLength = doc.getLine(lastLine).length;
    const lastLinePos = { line: lastLine, ch: lastLineLength };

    // Insert a newline character followed by the text
    doc.replaceRange("\n" + text, lastLinePos);
  }

  function initializeInternalLinksModal() {
    const modal = new bootstrap.Modal(
      document.getElementById("internalLinksModal")
    );
    const modalBody = document.querySelector("#internalLinksModal .modal-body");
    const insertBtn = document.getElementById("insert-internal-link-btn");

    // Fetch and display internal link list
    Promise.all([
      fetch("/api/list?lang=de").then((response) => response.json()),
      fetch("/api/list?lang=en").then((response) => response.json()),
    ]).then(([deFiles, enFiles]) => {
      modalBody.innerHTML = "<h6>German Files:</h6>";
      deFiles.forEach((file) => addLinkOption(file, "de"));
      modalBody.innerHTML += "<h6>English Files:</h6>";
      enFiles.forEach((file) => addLinkOption(file, "en"));
    });

    function addLinkOption(file, lang) {
      const div = document.createElement("div");
      div.className = "form-check";
      div.innerHTML = `
                <input class="form-check-input" type="radio" name="internalLink" id="${lang}-${file}" value="${lang}/${file}">
                <label class="form-check-label" for="${lang}-${file}">${file}</label>
            `;
      modalBody.appendChild(div);
    }

    insertBtn.addEventListener("click", () => {
        // TODO use insertInternalLink
      const selectedLink = document.querySelector(
        'input[name="internalLink"]:checked'
      );
      if (selectedLink) {
        const [lang, ...fileParts] = selectedLink.value.split("/");
        const file = fileParts.join("/");
        insertShortcode(`{{< link "${file}" >}}${file}{{< /link >}}`);
      }
      modal.hide();
    });
  }
});

function insertInternalLink() {
    const path = document.getElementById('internalLinkSelect').value;
    const text = document.getElementById('internalLinkText').value || path.split('/').pop();
    const link = `{{< button href="${path}" >}}${text}{{< /button >}}`;
    editor.getDoc().replaceSelection(link);
    hideModal('internalLinksModal');
}

function showModal(modalId) {
  const modal = new bootstrap.Modal(document.getElementById(modalId));
  modal.show();
}
