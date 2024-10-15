"use strict";

let editor;
let config;
let files;

function initEditor() {
    editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
        mode: "markdown",
        lineNumbers: true,
        lineWrapping: true,
        viewportMargin: Infinity
    });

    loadConfig();
    loadFileList();
}

function loadConfig() {
    fetch('/api/config')
        .then(response => response.json())
        .then(data => {
            config = data;
            createToolbar();
        });
}

function createToolbar() {
    const toolbar = document.getElementById("toolbar");

    // Add Undo and Redo buttons
    toolbar.innerHTML = `
        <button class="btn btn-outline-secondary" onclick="editor.undo()" data-bs-toggle="tooltip" title="Undo"><i class="fas fa-undo"></i></button>
        <button class="btn btn-outline-secondary" onclick="editor.redo()" data-bs-toggle="tooltip" title="Redo"><i class="fas fa-redo"></i></button>
        <div class="btn-group btn-group-sm" role="group"></div>
    `;

    const buttonGroup = toolbar.querySelector('.btn-group');
    for (const [key, value] of Object.entries(config.shortcodes)) {
        const button = document.createElement("button");
        button.className = "btn btn-outline-secondary";
        button.innerHTML = `<i class="fas fa-${config.icons[key]}"></i>`;
        button.onclick = () => insertShortcode(key, value);
        button.setAttribute('data-bs-toggle', 'tooltip');
        button.setAttribute('title', key.charAt(0).toUpperCase() + key.slice(1));
        buttonGroup.appendChild(button);
    }

    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

function insertShortcode(key, value) {
    const doc = editor.getDoc();
    const cursor = doc.getCursor();
    const selection = doc.getSelection();

    switch (key) {
        case '1_bold':
            if (selection) {
                doc.replaceSelection(`**${selection}**`);
            } else {
                doc.replaceRange("**bold**", cursor);
            }
            break;
        case '2_italic':
            if (selection) {
                doc.replaceSelection(`_${selection}_`);
            } else {
                doc.replaceRange("_italic_", cursor);
            }
            break;
        case '5_standardList':
            doc.replaceRange("- Item 1\n- Item 2\n- Item 3\n", cursor);
            break;
        case '3_numberedList':
            doc.replaceRange("1. Item 1\n2. Item 2\n3. Item 3\n", cursor);
            break;
        case '4_checkboxList':
            doc.replaceRange("- [ ] Task 1\n- [ ] Task 2\n- [ ] Task 3\n", cursor);
            break;
        case 'coloredCode':
            showModal('coloredCodeModal');
            break;
        case 'horizontalLine':
            doc.replaceRange("\n\n---\n\n", cursor);
            break;
        case 'internalLink':
            showInternalLinksDialog();
            break;
        case 'mediaSelect':
            showMediaSelectDialog();
            break;
        case '6_blockquoteSelect':
            showModal('blockquoteModal');
            break;
        default:
            doc.replaceRange(value, cursor);
    }
}


function showModal(modalId) {
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();
}

function insertColoredCode() {
    const language = document.getElementById('codeLanguage').value;
    const code = document.getElementById('codeContent').value;
    const formattedCode = "```" + language + "\n" + code + "\n```";
    editor.getDoc().replaceSelection(formattedCode);
    hideModal('coloredCodeModal');
}

function insertBlockquoteCode() {
    const blockquote = document.getElementById('blockquoteSelect').value;
    const text = document.getElementById('blockquoteContent').value;
    const formattedText = blockquote + "\n" + addPrefixToLines(text);
    editor.getDoc().replaceSelection(formattedText);
    hideModal('blockquoteModal');
}

function addPrefixToLines(text) {
    var lines = text.split('\n');
    for (var i = 0; i < lines.length; i++) {
        lines[i] = "> " + lines[i];
    }
    return lines.join('\n');
}

function showInternalLinksDialog() {
    const select = document.getElementById('internalLinkSelect');
    select.innerHTML = '';
    for (const lang in files) {
        for (const file of files[lang]) {
            const option = document.createElement('option');
            option.value = `./blog/${file}`;
            option.textContent = `./blog/${file}`;
            select.appendChild(option);
        }
    }
    showModal('internalLinksModal');
}


function insertInternalLink() {
    const path = document.getElementById('internalLinkSelect').value;
    const text = document.getElementById('internalLinkText').value || path.split('/').pop();
    const link = `{{< button href="${path}" >}}${text}{{< /button >}}`;
    editor.getDoc().replaceSelection(link);
    hideModal('internalLinksModal');
}

function hideModal(modalId) {
    const modalElement = document.getElementById(modalId);
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
}

function showMediaSelectDialog() {
    fetch('/api/media-list')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('mediaFileSelect');
            select.innerHTML = '';
            data.forEach(file => {
                const option = document.createElement('option');
                option.value = file;
                option.textContent = file;
                select.appendChild(option);
            });
            // TODO change, only for testing now -> create this as example for testing purposes:
            var fileName = document.getElementById("file-select").value;
            var newFileName = fileName.replace(/\.md$/, '_1'); // Replace .md with 1
            document.getElementById("newFileName").defaultValue = newFileName;
            document.getElementById("altText").defaultValue = newFileName;
            showModal('mediaSelectModal');
        });
}

function insertMediaFile() {
    var file = document.getElementById('mediaFileSelect').value;
    console.log(file)
    const fileMediaSelect = document.getElementById('fileMediaSelect-select').files[0].name;
    if (fileMediaSelect != null && fileMediaSelect) {
        file = fileMediaSelect;
        console.log(file)
    }
    const newName = document.getElementById('newFileName').value;
    const altText = document.getElementById('altText').value;

    fetch('/api/process-media', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file, newName }),
    })
        .then(response => response.json())
        .then(data => {
            const imageMarkdown = `![${altText}](/img/blog/${data.filename})`;
            editor.getDoc().replaceSelection(imageMarkdown);
            hideModal('mediaSelectModal');
        });
}

document.getElementById("fileMediaSelect-select").addEventListener("change", function () {
    var fileInput = document.getElementById("fileMediaSelect-select");
    var filePath = fileInput.value;

    var feedback = document.getElementById("fileMediaSelect-feedback");

    // Check if the selected file is in the ./mediaSet folder
    // TODO check against the media file list /api/media-list
    if (true) {
        feedback.textContent = "File selected: " + fileInput.files[0].name;
        feedback.style.color = "green";
    } else {
        feedback.textContent = "Please select a file from the media folder.";
        feedback.style.color = "red";
        fileInput.value = ""; // Clear the input
    }
});

function toggleFullscreen() {
    const editorWrapper = editor.getWrapperElement();
    if (!document.fullscreenElement) {
        if (editorWrapper.requestFullscreen) {
            editorWrapper.requestFullscreen();
        } else if (editorWrapper.mozRequestFullScreen) { // Firefox
            editorWrapper.mozRequestFullScreen();
        } else if (editorWrapper.webkitRequestFullscreen) { // Chrome, Safari and Opera
            editorWrapper.webkitRequestFullscreen();
        } else if (editorWrapper.msRequestFullscreen) { // IE/Edge
            editorWrapper.msRequestFullscreen();
        }
        editorWrapper.classList.add('fullscreen');
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
        editorWrapper.classList.remove('fullscreen');
    }
}

function loadFileList() {
    fetch('/api/list')
        .then(response => response.json())
        .then(data => {
            files = data;
            updateFileList();
        });
}

function updateFileList() {
    const lang = document.getElementById("language-select").value;
    const fileSelect = document.getElementById("file-select");
    fileSelect.innerHTML = "";
    if (files && files[lang]) {
        files[lang].forEach(file => {
            const option = document.createElement("option");
            option.value = file;
            option.textContent = file;
            fileSelect.appendChild(option);
        });
    }
    loadSelectedFile();
}

function loadSelectedFile() {
    const lang = document.getElementById("language-select").value;
    const file = document.getElementById("file-select").value;
    if (file) {
        fetch(`/api/load?file=${lang}/${file}`)
            .then(response => response.text())
            .then(content => editor.setValue(content));
    }
}

function saveContent() {
    const lang = document.getElementById("language-select").value;
    const file = document.getElementById("file-select").value;
    if (file) {
        const content = editor.getValue();
        fetch(`/api/save?file=${lang}/${file}`, {
            method: 'POST',
            body: content
        }).then(() => alert('Content saved!'));
    } else {
        alert('Please select a file to save.');
    }
}

function checkSpellingAndGrammar() {
    const content = editor.getValue();
    const lang = document.getElementById("language-select").value;

    fetch(`https://api.languagetool.org/v2/check`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `text=${encodeURIComponent(content)}&language=${lang}&enabledOnly=false`
    })
        .then(response => response.json())
        .then(data => {
            const doc = editor.getDoc();
            data.matches.forEach(match => {
                const from = doc.posFromIndex(match.offset);
                const to = doc.posFromIndex(match.offset + match.length);
                doc.markText(from, to, {
                    className: match.rule.category.id === 'TYPOS' ? 'spelling-error' : 'grammar-error',
                    title: match.message
                });
            });
        });
}

function copyToClipboard() {
    const content = editor.getValue();
    navigator.clipboard.writeText(content)
        .then(() => {
            alert('Content copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy content. Please try again.');
        });
}



function pasteFromClipboard() {
    navigator.clipboard.readText()
        .then(text => {
            editor.replaceSelection(text);
        })
        .catch(err => {
            console.error('Failed to read clipboard contents: ', err);
            alert('Failed to paste content. Please try again.');
        });
}

window.onload = initEditor;
