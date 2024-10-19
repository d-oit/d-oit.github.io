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
editor.setSize(null, viewportHeight + "px");

var isDirty = false;

editor.on("change", function () {
  isDirty = true;
});

window.addEventListener("beforeunload", function (e) {
  if (isDirty) {
    var confirmationMessage =
      "You have unsaved changes. Are you sure you want to leave?";
    e.returnValue = confirmationMessage;
    return confirmationMessage;
  }
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

// Initial check to set the visibility based on the initial state of the checkbox
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
  }

  function initializeModals() {
    initializeMediaSelectModal();
    initializeBlockquoteModal();
    initializeColoredCodeModal();
    initializeInternalLinksModal();
  }

  function addTextToEnd(newText) {
    var doc = editor.getDoc();
    var lastLine = doc.lastLine();
    var lastLineLength = doc.getLine(lastLine).length;
    doc.replaceRange("\n" + newText, { line: lastLine, ch: lastLineLength });
    lastLine = doc.lastLine();
    lastLineLength = doc.getLine(lastLine).length;
    // Scroll to the end
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

  function initializeMediaSelectModal() {
    const modal = new bootstrap.Modal(
      document.getElementById("mediaSelectModal")
    );
    const modalBody = document.querySelector("#mediaSelectModal .modal-body");
    const insertBtn = document.getElementById("insert-media-btn");

    fetch("/api/media-list")
      .then((response) => response.json())
      .then((mediaFiles) => {
        modalBody.innerHTML = "";
        const select = document.createElement("select");
        select.className = "form-select";
        select.id = "mediaFileSelect";

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select a file";
        defaultOption.selected = true;
        defaultOption.disabled = true;
        select.appendChild(defaultOption);

        mediaFiles.forEach((file) => {
          const option = document.createElement("option");
          option.value = file;
          option.textContent = file;
          select.appendChild(option);
        });

        modalBody.appendChild(select);
      });

    insertBtn.addEventListener("click", () => {
      const selectedFile = document.getElementById("mediaFileSelect").value;
      if (selectedFile) {
        addEditorText(
          `![${selectedFile}](/img/blog/${selectedFile})`
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
      addEditorText(
        `{{< blockquote type="${type}" >}}\nYour blockquote content here\n{{< /blockquote >}}`
      );
      modal.hide();
    });
  }

  function initializeColoredCodeModal() {
    const insertBtn = document.getElementById("insert-colored-code-btn");
    const languageSelect = document.getElementById("code-language");

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
      addEditorText(formattedCode);
      hideModal("coloredCodeModal");
    });
  }

  function initializeInternalLinksModal() {
    const modalBody = document.getElementById("internalLinksArea");
    const insertBtn = document.getElementById("insert-internal-link-btn");

    const langSelect = document.createElement("select");
    langSelect.id = "languageSelect";
    langSelect.className = "form-select mb-3";
    langSelect.innerHTML = `<option value="-">Select language</option>
        <option value="de">German</option>
        <option value="en">English</option>
    `;
    modalBody.appendChild(langSelect);

    const fileSelect = document.createElement("select");
    fileSelect.id = "internalLinkSelect";
    fileSelect.className = "form-select mb-3";
    modalBody.appendChild(fileSelect);

    langSelect.addEventListener("change", () => {
        const selectedLang = langSelect.value;
        fetch(`/api/list?lang=${selectedLang}`)
            .then((response) => response.json())
            .then((files) => {
                fileSelect.innerHTML = "";
                addDefaultOption(fileSelect);
                files.forEach((file) => addLinkOption(fileSelect, file, selectedLang));
            });
    });

    const linkTextInput = document.createElement("input");
    linkTextInput.type = "text";
    linkTextInput.id = "internalLinkText";
    linkTextInput.className = "form-control mt-3";
    linkTextInput.placeholder = "Enter link text (optional)";
    modalBody.appendChild(linkTextInput);

    insertBtn.addEventListener("click", () => {
      insertInternalLink();
    });
  }

    function addDefaultOption(selectElement) {
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.text = "Select a file";
      selectElement.appendChild(defaultOption);
  }
  
  function addLinkOption(selectElement, file, lang) {
      const option = document.createElement("option");
      option.value = file;
      option.text = file;
      option.setAttribute("data-language", lang);
      selectElement.appendChild(option);
  }

   

  function insertInternalLink() {
    const lang = document.getElementById("languageSelect").value;
    if(lang == "-") {
      alert("Please select a language and file");
      return;
    }
    const fileSelect = document.getElementById("internalLinkSelect");
    const path = fileSelect.value;
    const text = document.getElementById("internalLinkText").value;
    
    var showButton = document.getElementById("flexSwitchUseButton").value;
    showButton = showButton == "on" ? "true" : "false";	  
    var selectButtonColorElement = document.getElementById("buttonColorSelect");
    var selectedButtonColorValue =
      selectButtonColorElement.options[selectButtonColorElement.selectedIndex]
        .value;
    const link = `{{< refLink ref="${path}" lang="${lang}" text="${text}" showButton="${showButton}" color="${selectedButtonColorValue}" >}}`;
    addEditorText(link);
    hideModal("internalLinksModal");
}

  function showModal(modalId) {
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();
  }

  function hideModal(modalId) {
    const modalElement = document.getElementById(modalId);
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }
});
